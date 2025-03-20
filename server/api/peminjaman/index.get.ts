import prisma from "~/lib/prisma";
import { getServerSession } from "#auth"; // Sidebase NuxtAuth

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const userId = session.user.id; // Ambil userId dari sesi login

  try {
    const peminjaman = await prisma.peminjaman.findMany({
      where: { userId },
      include: {
        book: true, // Ambil detail buku yang dipinjam
      },
    });

    return peminjaman;
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
