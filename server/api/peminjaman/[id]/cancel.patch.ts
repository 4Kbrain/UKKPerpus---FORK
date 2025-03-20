import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  try {
    const updatedLoan = await prisma.peminjaman.update({
      where: { id },
      data: { status: 'DIBATALKAN' },
    });

    return { message: 'Peminjaman berhasil dibatalkan', status: updatedLoan.status };
  } catch (error) {
    return createError({ statusCode: 500, message: 'Gagal membatalkan peminjaman' });
  }
});
