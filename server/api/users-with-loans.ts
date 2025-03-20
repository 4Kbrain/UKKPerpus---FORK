import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
  return await prisma.user.findMany({
    where: {
      peminjaman: {
        some: {} // Hanya ambil user yang punya peminjaman
      }
    },
    include: {
      peminjaman: {
        include: { book: true } // Ambil detail buku dalam peminjaman
      }
    }
  });
});
