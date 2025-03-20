import { defineEventHandler, getRouterParams, readBody } from 'h3';
import prisma from '~/lib/prisma';
import { statusBuku } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { status } = await readBody(event);

  if (!id || !status) {
    return { error: 'ID dan status diperlukan' };
  }

  try {
    const existingLoan = await prisma.peminjaman.findUnique({
      where: { id },
      include: { book: true }, // Ambil data buku jika ada
    });

    if (!existingLoan) {
      return { error: 'Peminjaman tidak ditemukan' };
    }

    if (status === existingLoan.status) {
      return { error: 'Status sudah sesuai, tidak ada perubahan' };
    }

    // Jika hanya update status tanpa perubahan jumlah buku
    if (status !== 'DIPINJAM' && status !== 'DIKEMBALIKAN') {
      const loan = await prisma.peminjaman.update({
        where: { id },
        data: { status },
      });

      return { message: 'Status peminjaman diperbarui', loan };
    }

    // Jika ingin mengubah jumlah buku, pastikan ada data buku terkait
    if (!existingLoan.book) {
      return { error: 'Buku terkait tidak ditemukan' };
    }

    // Update status & jumlah buku dalam satu transaksi
    await prisma.$transaction([
      prisma.peminjaman.update({
        where: { id },
        data: {
          status,
          returnedAt: status === 'DIKEMBALIKAN' ? new Date() : null,
        },
      }),
      prisma.buku.update({
        where: { id: existingLoan.bookId },
        data: {
          jumlah: status === 'TERSEDIA' ? { decrement: 1 } : { increment: 1 },
          status: status === 'TERSEDIA' ? undefined : statusBuku.TERSEDIA,
        },
      }),
    ]);

    return { message: `Buku berhasil ${status === 'DIPINJAM' ? 'dipinjam' : 'dikembalikan'}` };
  } catch (error) {
    console.error('Gagal memperbarui status peminjaman:', error);
    return { error: 'Gagal memperbarui status peminjaman' };
  }
});
