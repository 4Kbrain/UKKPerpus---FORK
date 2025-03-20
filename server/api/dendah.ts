import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    // Get all peminjaman with associated denda
    return await prisma.peminjaman.findMany({
      include: {
        user: true,
        book: true,
        dendaRecords: true
      }
    })
  }


  if (method === 'POST') {
    const body = await readBody(event)
    const { userId, peminjamanId, amount, reason } = body

    if (!userId || !peminjamanId || !amount || !reason) {
      throw createError({ statusCode: 400, message: 'Missing required fields' })
    }

    // Pastikan peminjaman ada
    const peminjaman = await prisma.peminjaman.findUnique({ where: { id: peminjamanId } })
    if (!peminjaman) {
      throw createError({ statusCode: 404, message: 'Peminjaman not found' })
    }

    // Pastikan user ada
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    // Pastikan amount dalam format number
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw createError({ statusCode: 400, message: 'Invalid amount' })
    }

    const newDenda = await prisma.denda.create({
      data: {
        userId,
        peminjamanId,
        amount: parsedAmount,
        reason,
        status: "BELUM_LUNAS" // Status default
      }
    })

    return newDenda
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
