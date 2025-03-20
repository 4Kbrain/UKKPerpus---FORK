import { defineEventHandler, createError } from 'h3'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Denda ID is required' })
  }

  const denda = await prisma.denda.findUnique({
    where: { id },
    include: {
      user: { select: { fullname: true, username: true } } // Ambil info user
    }
  })

  if (!denda) {
    throw createError({ statusCode: 404, statusMessage: 'Denda not found' })
  }

  return denda
})
