import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  try {
    const updatedLoan = await prisma.peminjaman.update({
      where: { id },
      data: { status: 'DIAJUKAN' },
    });

    return { message: 'Peminjaman berhasil diajukan', status: updatedLoan.status };
  } catch (error) {
    return createError({ statusCode: 500, message: 'Gagal mengajukan peminjaman' });
  }
});
