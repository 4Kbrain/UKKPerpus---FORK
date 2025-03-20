import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const params = event.context.params

  // Ensure params is defined
  if (!params || !params.id) {
    return sendError(event, new Error('Missing book ID'))
  }

  const id = params.id

  try {
    const book = await prisma.buku.findUnique({
      where: { id },
      include: {
        peminjaman: {
          where: {
            // Hanya ambil peminjaman yang masih aktif
            status: { in: ["DISETUJUI", "DIPINJAM", "DIPERPANJANG"] }, 
          },
        },
        categories: { 
          include: {
            category: true, 
          },
        },
      },
    })
    

    if (!book) {
      return sendError(event, new Error('Book not found'))
    }

    // Hitung apakah buku masih tersedia
    const available = book.jumlah > book.peminjaman.length

    return { ...book, available } // Tambahkan available ke response
  } catch (error) {
    return sendError(event, new Error('Error fetching book'))
  }
})
