import prisma from "~/lib/prisma";
import { sendError } from "h3";

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  const body = await readBody(event);

  if (!params || !params.id) {
    return sendError(event, new Error("Missing book ID"));
  }

  try {
    const updatedBook = await prisma.buku.update({
      where: { id: params.id },
      data: {
        judul: body.judul,
        pengarang: body.pengarang,
        categoryId: body.categoryId,
      },
    });

    return updatedBook;
  } catch (error) {
    return sendError(event, new Error("Error updating book"));
  }
});
