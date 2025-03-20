import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  
  try {

    const id = event.context.params?.id
    
    if(!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Book is not found"
      })
    }
    const book = await prisma.buku.delete({
      where: {
        id
      }
    })
    
    return { message: "Book deleted successfully", book }
  } catch(error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: "Error deleting book"
    })
  }
})
