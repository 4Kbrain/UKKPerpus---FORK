import prisma from "~/lib/prisma"


export default defineEventHandler(async () => {
  try {
    const total = await prisma.peminjaman.count({
      where: {
        status: "DIPINJAM"
      }
    })
    return { total }
  } catch (error) {
    console.error('Error fetching total borrowed books:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
