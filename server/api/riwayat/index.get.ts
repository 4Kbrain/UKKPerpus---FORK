import { getServerSession } from '#auth';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Ambil riwayat peminjaman user
  const riwayatPeminjaman = await prisma.peminjaman.findMany({
    where: { userId: session.user.id },
    include: { book: true }, // Bisa ditambah detail buku
  });

  return riwayatPeminjaman;
});
