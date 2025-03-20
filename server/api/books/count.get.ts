import prisma from "~/lib/prisma"

export default defineEventHandler(async () => {
  const total = await prisma.buku.count()
  return { total }
})
