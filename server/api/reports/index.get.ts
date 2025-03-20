import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getQuery, sendStream, setResponseHeader } from 'h3';
import PDFDocument from "pdfkit";
import { Readable } from 'stream';
import { PassThrough } from 'stream';


const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { type, start, end, print } = query;

  if (!type || !start || !end) {
    return { error: 'Parameter type, start, dan end harus disertakan.' };
  }

  const startDate = new Date(start as string);
  const endDate = new Date(end as string);

  try {
    let reports = [];

    switch (type) {
      case 'Peminjaman':
        reports = await prisma.peminjaman.findMany({
          where: {
            borrowedAt: { gte: startDate, lte: endDate },
          },
          include: { user: true, book: true },
        });
        break;

      case 'Pengembalian':
        reports = await prisma.peminjaman.findMany({
          where: {
            status: 'DIKEMBALIKAN',
            returnedAt: { gte: startDate, lte: endDate },
          },
          include: { user: true, book: true },
        });
        break;

      case 'Denda':
        reports = await prisma.peminjaman.findMany({
          where: {
            status: 'TERLAMBAT',
            dueDate: { gte: startDate, lte: endDate },
          },
          include: { user: true, book: true },
        });
        break;

      case 'Semua': // Tambahan untuk menangani semua laporan
        reports = await prisma.peminjaman.findMany({
          where: {
            OR: [
              { borrowedAt: { gte: startDate, lte: endDate } },
              { returnedAt: { gte: startDate, lte: endDate } },
              { dueDate: { gte: startDate, lte: endDate } },
            ],
          },
          include: { user: true, book: true },
        });
        break;

      default:
        return { error: 'Jenis laporan tidak valid' };
    }

    const formattedReports = reports.map((report) => ({
      id: report.id,
      name: report.user.fullname,
      book: report.book.judul,
      date: report.borrowedAt ? report.borrowedAt.toISOString().split('T')[0] : '-',
      status: report.status || '-',
      type
    }));

    if (print) {
      const pdfStream = await generatePDF(formattedReports, type);
      setResponseHeader(event, 'Content-Type', 'application/pdf');
      setResponseHeader(event, 'Content-Disposition', `attachment; filename=laporan_${type}.pdf`);
      return sendStream(event, pdfStream);
    }

    return formattedReports;
  } catch (error) {
    console.error(error);
    return { error: 'Terjadi kesalahan saat mengambil laporan' };
  }
});

// Fungsi untuk membuat PDF
async function generatePDF(reports: any[], type: string) {
  console.log("Membuat PDF untuk laporan:", type);
  
  const doc = new PDFDocument();
  // const stream = new Readable({
  //   read() {},
  // });
  const stream = new PassThrough();

  doc.pipe(stream);

  // Header PDF
  doc.fontSize(18).text(`Laporan ${type}`, { align: 'center' }).moveDown();
  
  // Isi laporan
  reports.forEach((report, index) => {
    doc.fontSize(12).text(`${index + 1}. ${report.name} - ${report.book} (${report.date}) - ${report.status}`);
  });

  doc.end();

  return stream;
}
