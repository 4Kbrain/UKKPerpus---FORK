import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id 
  const body = await readBody(event)

  if (!id || body.amount === undefined || !body.status) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  if (body.amount > 0 && body.status.toLowerCase() === 'lunas') {
    throw createError({ statusCode: 400, statusMessage: 'Cannot mark as "lunas" while amount is greater than 0' })
  }

  try {
    const updatedFine = await prisma.denda.update({
      where: { id }, 
      data: { amount: body.amount, status: body.status }
    })
    return { success: true, fine: updatedFine }
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message })
  }
})
