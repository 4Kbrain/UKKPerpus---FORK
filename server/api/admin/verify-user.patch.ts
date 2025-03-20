import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.userId) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: body.userId },
      data: { is_verify: true },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    throw createError({ statusCode: 500, message: "Failed to verify user" });
  }
});
