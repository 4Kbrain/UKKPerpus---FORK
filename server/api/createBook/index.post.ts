import prisma from '~/lib/prisma'

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)

    // Validasi input wajib
    if (!body.judul || !body.kode_buku || !body.pengarang) {
      throw createError({ statusCode: 400, message: 'Data tidak lengkap' })
    }

    // Cek apakah kode_buku sudah digunakan
    const existingBook = await prisma.buku.findUnique({
      where: { kode_buku: body.kode_buku }
    })
    if (existingBook) {
      throw createError({ statusCode: 400, message: 'Kode Buku sudah digunakan' })
    }

    // Jika ISBN diinput, cek apakah sudah ada di database (karena unik)
    if (body.isbn) {
      const existingISBN = await prisma.buku.findUnique({
        where: { isbn: body.isbn }
      })
      if (existingISBN) {
        throw createError({ statusCode: 400, message: 'ISBN sudah digunakan' })
      }
    }

    // Buat buku baru
    const newBook = await prisma.buku.create({
      data: {
        judul: body.judul,
        kode_buku: body.kode_buku,
        pengarang: body.pengarang,
        penerbit: body.penerbit,
        jumlah: body.jumlah || 1,
        status: body.status || 'TERSEDIA',
        cover: body.cover || null,
        sinopsis: body.sinopsis || null,
        tahun_terbit: body.tahun_terbit ? new Date(body.tahun_terbit) : null,
        isbn: body.isbn || null,
        edisi: body.edisi || null
      }
    })

    // Jika ada kategori, tambahkan ke BookCategory
    if (Array.isArray(body.categories) && body.categories.length > 0) {
      await prisma.bookCategory.createMany({
        data: body.categories.map((categoryId: string) => ({
          bookId: newBook.id,
          categoryId
        })),
        // Menghindari duplikasi data
        skipDuplicates: true 
      })
    }

    return { success: true, book: newBook }
  } catch (error: any) {
    console.error('Gagal membuat buku:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Terjadi kesalahan pada server'
    })
  }
})
