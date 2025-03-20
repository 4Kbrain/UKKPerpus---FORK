import { setHeader } from 'h3';
import prisma from '~/lib/prisma';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import { defineEventHandler, getQuery, sendStream } from 'h3';
import { format } from 'date-fns';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { month, year, type, print } = query;

  if (!month || !year || !type) {
    return { error: 'Parameter month, year, dan type harus disertakan.' };
  }

  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 0);

  let reports = [];

  try {
    switch (type) {
      case 'peminjaman':
        reports = await prisma.peminjaman.findMany({
          where: { borrowedAt: { gte: startDate, lte: endDate } },
          include: {
            user: { select: { fullname: true } },
            book: { select: { judul: true } },
          },
        });
        break;

      case 'pengembalian':
        reports = await prisma.peminjaman.findMany({
          where: { returnedAt: { gte: startDate, lte: endDate } },
          include: {
            user: { select: { fullname: true } },
            book: { select: { judul: true } },
          },
        });
        break;

      case 'denda':
        reports = await prisma.peminjaman.findMany({
          where: { denda: { gt: 0 }, returnedAt: { gte: startDate, lte: endDate } },
          include: {
            user: { select: { fullname: true } },
            book: { select: { judul: true } },
          },
        });
        break;

      case 'buku-sering':
        reports = await prisma.$queryRaw`
          SELECT b.judul AS book, COUNT(p.bookId) AS jumlah_peminjaman
          FROM Peminjaman p
          JOIN Buku b ON p.bookId = b.id
          WHERE p.borrowedAt BETWEEN ${startDate} AND ${endDate}
          GROUP BY p.bookId
          ORDER BY jumlah_peminjaman DESC
          LIMIT 10
        `;
        break;

      case 'buku-tidak-sering':
        reports = await prisma.buku.findMany({
          where: {
            id: {
              notIn: (await prisma.peminjaman.findMany({ select: { bookId: true } })).map(p => p.bookId),
            },
          },
          select: { judul: true },
        });
        break;

      case 'pengguna-aktif':
        reports = await prisma.$queryRaw`
          SELECT u.fullname AS name, COUNT(p.userId) AS jumlah_peminjaman
          FROM Peminjaman p
          JOIN User u ON p.userId = u.id
          WHERE p.borrowedAt BETWEEN ${startDate} AND ${endDate}
          GROUP BY p.userId
          ORDER BY jumlah_peminjaman DESC
          LIMIT 10
        `;
        break;

      default:
        return { error: 'Jenis laporan tidak valid.' };
    }

    const formattedReports = reports.map((report, index) => ({
      id: report.id || index + 1,
      name: report.user?.fullname || report.name || '-',
      book: report.book?.judul || report.book || '-',
      date: report.borrowedAt ? format(report.borrowedAt, 'dd MMMM yyyy') : '-',
    }));

    if (print === 'true') {
      setHeader(event, 'Content-Type', 'application/pdf');
      setHeader(event, 'Content-Disposition', `attachment; filename="Laporan_${type}_${month}_${year}.pdf"`);
      return sendStream(event, generatePDF(formattedReports, type, month, year));
    }

    console.log("Raw Reports:", reports);

    return formattedReports;
  } catch (error) {
    console.error(error);
    return { error: 'Terjadi kesalahan saat mengambil laporan' };
  }
});

function generatePDF(reports, type, month, year) {
  console.log(`Mengirim PDF Laporan ${type}: ${month}/${year}, Jumlah Data: ${reports.length}`);
  
  const doc = new PDFDocument();
  const stream = new Readable({ read() {} });

  doc.on('data', (chunk) => stream.push(chunk));
  doc.on('end', () => stream.push(null));

  doc.fontSize(18).text(`Laporan ${type} - ${month}/${year}`, { align: 'center' });
  doc.moveDown();

  reports.forEach((report, index) => {
    doc.fontSize(12).text(`${index + 1}. ${report.name} - ${report.book} (${report.date})`);
  });

  doc.end();
  return stream;
}
