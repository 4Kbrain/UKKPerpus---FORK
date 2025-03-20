import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { loanId } = body

  // Ambil data peminjaman
  const peminjaman = await prisma.peminjaman.findUnique({
    where: { id: loanId }
  })

  if (!peminjaman) {
    throw createError({ statusCode: 404, statusMessage: 'Peminjaman tidak ditemukan' })
  }

  // Pastikan peminjaman belum pernah diperpanjang sebelumnya
  if (peminjaman.status === 'DIPERPANJANG') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Peminjaman sudah pernah diperpanjang dan tidak dapat diperpanjang lagi'
    })
  }

  // Perhitungan H-1 sebelum dueDate
  const today = new Date()
  const dueDate = new Date(peminjaman.dueDate)
  
  // Normalisasi tanggal agar perbandingan hanya di level tanggal, bukan jam
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)

  const diffDays = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

  if (diffDays > 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Perpanjangan hanya dapat dilakukan H-1 sebelum due date'
    })
  }

  // Perpanjang 7 hari dari dueDate lama
  const newDueDate = new Date(dueDate)
  newDueDate.setDate(dueDate.getDate() + 7)

  // Perbarui peminjaman lama dengan dueDate baru
  const updatedLoan = await prisma.peminjaman.update({
    where: { id: loanId },
    data: {
      dueDate: newDueDate,
      status: 'DIPERPANJANG'
    }
  })

  return {
    message: 'Perpanjangan berhasil',
    updatedLoan
  }
})
