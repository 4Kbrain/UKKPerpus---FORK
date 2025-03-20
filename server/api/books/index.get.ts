import prisma from "~/lib/prisma"
import { statusBuku } from "@prisma/client"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const search = query.search?.toString().trim() || ""
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  const whereCondition = search ? {
    OR: [
      {
        judul: {
          contains: search
        }
      },
      {
        pengarang: {
          contains: search
        }
      }
    ]
  } : {}


  const books = await prisma.buku.findMany({
    where: {
      ...whereCondition,
      status: statusBuku.TERSEDIA,
    },
    skip,
    take: limit,
    select: {
      id: true,
      judul: true,
      cover: true,
      pengarang: true,
      categories: {
        select: {
          category: {
            select: {
              name: true
            }
          }
        }
      },
      penerbit:true,
      tahun_terbit: true,
      jumlah: true,
      status: true,
      kode_buku: true, 
    }
  });
  // console.log("Data buku terkini:", books);

  const formattedBooks = books.map(book => ({
    ...book,
    categories: book.categories.map(cat => cat.category.name)
  }));

  const availableBook = await prisma.buku.count({
    where: {
      status: statusBuku.TERSEDIA
    },
  });

  const notAvailableBook = await prisma.buku.count({
    where: {
      status: statusBuku.TIDAK_TERSEDIA
    },
  });

  const total = await prisma.buku.count({
    where: whereCondition
  })

  return {
    success: true,
    status: 200,
    message: "Books fetched successfully",
    items: formattedBooks,
    total,
    availableBook,
    notAvailableBook
  }
})
