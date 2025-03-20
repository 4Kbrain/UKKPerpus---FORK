import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    //  Validasi request body
    if (!body || !body.userId || !body.bookId || !body.borrowedAt || !body.dueDate) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Data peminjaman tidak lengkap.",
      }));
    }

    //  Validasi format tanggal agar tidak error saat di-convert ke Date
    if (isNaN(Date.parse(body.borrowedAt)) || isNaN(Date.parse(body.dueDate))) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: "Format Tanggal Salah",
        message: "Tanggal peminjaman atau pengembalian tidak valid.",
      }));
    }

    // Memastikan `dueDate` lebih besar dari `borrowedAt`
    if (new Date(body.dueDate) <= new Date(body.borrowedAt)) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: "Tanggal Tidak Valid",
        message: "Tanggal pengembalian harus setelah tanggal peminjaman.",
      }));
    }

    //  Cek apakah buku yang ingin dipinjam ada
    const book = await prisma.buku.findUnique({
      where: { id: body.bookId },
    });

    if (!book) {
      return sendError(event, createError({
        statusCode: 404,
        statusMessage: "Buku Tidak Ditemukan",
        message: "Buku yang ingin dipinjam tidak tersedia.",
      }));
    }

    // Mengecek apakah user sudah memiliki peminjaman untuk buku yang sama (hindari peminjaman ganda)
    const existingLoan = await prisma.peminjaman.findFirst({
      where: {
        userId: body.userId,
        bookId: body.bookId,
        status: { in: ["DIAJUKAN","PENDING", "DIPINJAM"] },
      },
    });
    

    if (existingLoan) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: "Tidak bisa meminjam buku yang sama",
        message: "Anda sudah meminjam buku ini dan masih dalam status aktif.",
      }));
    }

    //  Mengecek jumlah peminjaman user agar tidak lebih dari batas (3 buku)
    const jumlahPeminjaman = await prisma.peminjaman.count({
      where: {
        userId: body.userId,
        status: { in: ["PENDING", "DIPINJAM"] },
      },
    });

    if (jumlahPeminjaman >= 3) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: "Limit Peminjaman Tercapai",
        message: "Anda sudah meminjam 3 buku. Kembalikan buku sebelum meminjam lagi.",
      }));
    }

    //  Buat peminjaman baru
    const peminjaman = await prisma.peminjaman.create({
      data: {
        userId: body.userId,
        bookId: body.bookId,
        borrowedAt: new Date(body.borrowedAt),
        dueDate: new Date(body.dueDate), 
        returnedAt: null,
        status: "PENDING",
      },
    });

    return {
      message: "Peminjaman berhasil diajukan",
      peminjamanId: peminjaman.id,
    };
  } catch (error) {
    console.error("Server Error:", error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Terjadi kesalahan pada server.",
    }));
  }
});
