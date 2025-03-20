import { defineEventHandler, getRouterParam } from "h3";
import prisma from "~/lib/prisma";
import { getServerSession } from "#auth"; // Sidebase NuxtAuth

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    if (!session?.user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const bookId = getRouterParam(event, "id");
    const userId = session.user.id;

    if (!bookId || !userId) {
      throw createError({ statusCode: 400, statusMessage: "Invalid bookId or userId" });
    }

    // Cek apakah buku sudah ada di favorit
    const existingFavorite = await prisma.favorit.findFirst({
      where: { userId, bookId },
    });

    if (existingFavorite) {
      return { message: "Already in favorites" };
    }

    // Tambahkan buku ke favorit
    const favorit = await prisma.favorit.create({
      data: { bookId, userId },
    });

    console.log("Added to favorites:", favorit);

    return favorit;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to update favorites" });
  }
});
