import prisma from "~/lib/prisma"


export default defineEventHandler(async () => {
  try {
    const total = await prisma.category.count()
    return { total }
  } catch (error) {
    console.error('Error fetching total categories:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
