import { defineEventHandler, getQuery } from "h3";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const users = await prisma.user.findMany({
      where: { is_verify: false },
      select: { id: true, email: true, nik: true, is_verify: true },
      skip,
      take: pageSize,
    });

    const totalUsers = await prisma.user.count({ where: { is_verify: false } });
    const totalPages = Math.ceil(totalUsers / pageSize);

    return { users, totalPages };
  } catch (error) {
    return { error: "Failed to fetch users" };
  }
});
