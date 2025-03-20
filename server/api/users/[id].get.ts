import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
  }

  if (event.method === 'GET') {
    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: id }
    })
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }
    return user
  }

  if (event.method === 'PUT') {
    // Update user
    const body = await readBody(event)

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        fullname: body.fullname,
        email: body.email,
        username: body.username,
        phone: body.phone,
        gender: body.gender,
        role: body.role,
        photo: body.photo,
        address: body.address,
        is_verify: body.is_verify,
        is_active: body.is_active,
        nik: body.nik,
      }
    })
    return updatedUser
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
