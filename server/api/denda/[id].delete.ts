import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  
  try {

    const id = event.context.params?.id
    
    if(!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "User is not found"
      })
    }
    const denda = await prisma.denda.delete({
      where: {
        id
      }
    })
    
    return { message: "User deleted successfully", denda }
  } catch(error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: "Error deleting denda"
    })
  }
})
