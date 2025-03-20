import prisma from "~/lib/prisma"


export default defineEventHandler(async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { books: true } }
    },
    orderBy: { books: { _count: 'desc' } },
    take: 5
  })

  return categories.map(cat => ({
    name: cat.name,
    count: cat._count.books,
    icon: "mdi-book-open-variant",
    color: "indigo",
    slug: cat.slug
  }))
})
