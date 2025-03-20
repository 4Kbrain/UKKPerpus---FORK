import prisma from "~/lib/prisma";
import { ReasonDenda } from "~/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const search = query.search?.toString().trim() || "";
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereCondition = search
    ? {
        OR: [
          {
            user: {
              fullname: {
                contains: search,
              },
            },
          },
          {
            user: {
              email: {
                contains: search,
              },
            },
          },
        ],
      }
    : {};

const denda = await prisma.denda.findMany({
  where: whereCondition,
  include: {
    user: {
      select: {
        fullname: true,
        email: true,
      },
    },
    peminjaman: {
      select: {
        book: {
          select: {
            judul: true,
          },
        },
      },
    },
  },
  skip: 0,
  take: 10,
});

const totalDendaBelumDibayar = await prisma.denda.count({
  where: {
    status: "BELUM_LUNAS",
  },
});

const totalDendaDibayar = await prisma.denda.count({
  where: {
    status: "LUNAS",
  },
});

const totalPenggunaDenda = await prisma.denda.count({
  where: {
    createdAt: {
      gte: new Date(new Date().setHours(0, 0, 0, 0)), // Menghitung dari awal hari ini
    },
  },
});


  const total = await prisma.denda.count({
    where: whereCondition,
  });

  return {
    success: true,
    status: 200,
    message: "Denda fetched successfully",
    items: denda,
    total,
    totalDendaBelumDibayar,
    totalDendaDibayar,
    totalPenggunaDenda,
  };

  // return { items: users, total }
});
