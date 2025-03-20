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
    const user = await prisma.user.delete({
      where: {
        id
      }
    })
    
    return { message: "User deleted successfully", user }
  } catch(error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: "Error deleting user"
    })
  }
})
