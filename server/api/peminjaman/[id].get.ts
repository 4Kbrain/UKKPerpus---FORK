import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id || typeof id !== "string") {
      throw createError({ statusCode: 400, message: "ID tidak valid" });
    }

    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
      include: {
        book: true, // Pastikan ini sesuai dengan schema Prisma
        user: true, // Jika ingin menampilkan nama peminjam
      },
    });

    if (!peminjaman) {
      throw createError({ statusCode: 404, message: "Peminjaman tidak ditemukan" });
    }

    return {
      id: peminjaman.id,
      title: peminjaman.book?.judul || "Judul Tidak Diketahui", // Ambil judul buku
      bookCover: peminjaman.book?.cover || "", // Ambil gambar buku jika ada
      borrowerName: peminjaman.user?.fullname || "Nama Tidak Diketahui", // Nama peminjam (opsional)
      borrowedAt: peminjaman.borrowedAt,
      dueDate: peminjaman.dueDate,
      status: peminjaman.status,
    };
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    throw createError({ statusCode: 500, message: "Terjadi kesalahan server" });
  }
});
