import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const search = query.search?.toString().trim() || "";
  const categoryId = query.categoryId?.toString() || "";
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereCondition: any = {};

  if (search) {
    whereCondition.OR = [
      { categoryId: { contains: search } },
      { category: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  
  if (categoryId && categoryId !== "Semua") {
    whereCondition.categoryId = categoryId;
  }

  const bookCategory = await prisma.bookCategory.findMany({
    where: whereCondition,
    skip,
    take: limit,
    select: {
      id: true,
      bookId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    success: true,
    status: 200,
    message: "Books fetched successfully",
    items: bookCategory,
  };
});
