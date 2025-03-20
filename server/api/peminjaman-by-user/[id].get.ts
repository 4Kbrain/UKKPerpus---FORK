import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const userId = event.context.params.userId;

  return await prisma.peminjaman.findMany({
    where: { userId },
    include: { book: true }
  });
});
