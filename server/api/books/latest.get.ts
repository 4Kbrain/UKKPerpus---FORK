import prisma from "~/lib/prisma"
import { statusBuku } from "@prisma/client"


export default defineEventHandler(async () => {
  const books = await prisma.buku.findMany({
    where: { status: statusBuku.TERSEDIA},
    orderBy: { created_at: 'desc' },
    take: 5
  })

  return books.map(book => ({
    id: book.id,
    judul: book.judul,
    pengarang: book.pengarang,
    penerbit: book.penerbit,
    tahun: book.tahun_terbit,
    status: book.status,
    cover: book.cover || "/default-avatar.png"
  }))
})
