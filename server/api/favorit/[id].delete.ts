import { defineEventHandler, getRouterParam } from "h3";
import prisma from "~/lib/prisma"
import { getServerSession } from "#auth"; // Sidebase NuxtAuth


export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const bookId = getRouterParam(event, "id");

  const userId = session.user.id; // Ambil userId dari sesi login

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  await prisma.favorit.deleteMany({
    where: { bookId, userId },
  });

  return { message: "Removed from favorites" };
});
