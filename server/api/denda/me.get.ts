import prisma from "~/lib/prisma";
import { getServerSession } from "#auth"; // Sidebase NuxtAuth

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const userId = session.user.id; // Ambil userId dari sesi login

  try {
    const denda = await prisma.denda.findMany({
      where: { userId: userId }, // Pakai userId eksplisit
      include: {
        peminjaman: {
          include: {
            book: true, 
          },
        },
      },
    });
    console.log("Data denda dari database:", denda);
    const totalDenda = denda.reduce((acc, curr) => acc + curr.amount.toNumber(), 0);

    return {
      denda,
      totalDenda
    };
  } catch (error) {
    console.error("Error fetching denda:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
