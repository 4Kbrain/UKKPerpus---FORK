import prisma from "~/lib/prisma"


export default defineEventHandler(async (event) => {
  const query = getQuery(event).query as string

  if (!query) return []

  const books = await prisma.buku.findMany({
    where: {
      OR: [
        { judul: { contains: query, mode: 'insensitive' } },
        { pengarang: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 10
  })

  return books.map(book => ({
    id: book.id,
    judul: book.judul,
    pengarang: book.pengarang,
    penerbit: book.penerbit,
    tahun: book.tahun,
    status: book.status,
    cover: book.cover || "/default-avatar.png"
  }))
})
