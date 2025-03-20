import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const books = await prisma.buku.findMany({
    orderBy: {
      created_at: "desc",
    },
    take: 5,
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  return books;
});
