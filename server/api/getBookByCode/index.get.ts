import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const { kode_buku } = await readBody(event);

    const book = await prisma.buku.findFirst({
      where: { kode_buku },
      select: { id: true },
    });

    if (!book) {
      throw createError({
        statusCode: 404,
        message: "Book not found",
      });
    }

    return book;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Server Error" });
  }
});
