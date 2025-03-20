import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  if (method !== 'GET') {
    return { error: 'Method tidak didukung' };
  }

  const query = getQuery(event);
  console.log('Query Diterima:', query); // Tambahkan log ini

  const { userId, status, page = 1, limit = 10 } = query;

  if (!userId) {
    return { error: 'userId diperlukan' };
  }

  try {
    const filter = { userId };

    if (status) {
      const statusArray = String(status).split(',').map(s => s.trim().toUpperCase());
      filter.status = { in: statusArray };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log('Filter Query:', JSON.stringify(filter, null, 2)); // Debugging filter

    const [peminjaman, totalCount] = await Promise.all([
      prisma.peminjaman.findMany({
        where: filter,
        include: {
          user: { select: { id: true, fullname: true, email: true, phone: true } },
          book: { select: { id: true, judul: true, kode_buku: true, cover: true } }
        },
        skip,
        take: parseInt(limit),
        orderBy: { borrowedAt: 'desc' }
      }),
      prisma.peminjaman.count({ where: filter })
    ]);

    console.log('Total Peminjaman Ditemukan:', totalCount);

    return {
      items: peminjaman,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    };
  } catch (error) {
    console.error('Error fetching peminjaman:', error);
    return { error: 'Gagal mengambil data peminjaman', details: error.message };
  }
});
