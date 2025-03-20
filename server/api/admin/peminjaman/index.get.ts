import { getServerSession } from "#auth";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const tampils = await prisma.peminjaman.findMany({
    include: {
      book: {
        select: {
          id: true,
          judul: true, 
          pengarang: true,
          isbn: true,
          penerbit: true,
        }
      },
      user: {
        select: { fullname: true, email: true },
      },
    },
  });

  if (!tampils.length) {
    throw createError({ statusCode: 404, statusMessage: "Data not found" });
  }

  return tampils;
});
