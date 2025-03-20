import prisma from "~/lib/prisma";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const userId = session.user.id; // Ambil userId dari sesi login

  try {
    const favorit = await prisma.favorit.findMany({
      where: { userId },
      include: {
        book: true
      }
    });

    console.log("Fetching favorit for user:", userId);

    return favorit;
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
