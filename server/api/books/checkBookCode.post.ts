import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { kode_buku } = await readBody(event)

  const existingBook = await prisma.buku.findUnique({
    where: { kode_buku }
  })

  return { exists: !!existingBook }
})
