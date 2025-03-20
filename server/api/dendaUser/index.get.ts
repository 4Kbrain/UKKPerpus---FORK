import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const search = query.search?.toString().trim() || "";
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereCondition = {
    role: "PEMINJAM",
    ...(search
      ? {
          OR: [
            { fullname: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {}),
  };

  const users = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
  });

  const total = await prisma.user.count({ where: whereCondition });

  return {
    success: true,
    status: 200,
    message: "Users fetched successfully",
    items: users,
    total,
  };
});
