import { Prisma } from '@prisma/client'
import prisma from '~/lib/prisma'

async function main() {
  const existingCategories = await prisma.category.findFirst()

  if (existingCategories) {
    return {
      statusCode: 400,
      body: {
        message: 'Categories already seeded'
      }
    }
  }

  const categoryData: Prisma.CategoryCreateInput[] = [
    {
      name: 'Fiction'
    },
    {
      name: 'Mystery'
    },
    {
      name: 'Horror'
    },
    {
      name: 'Romance'
    },
    {
      name: 'Fantasy'
    }
  ]

  await prisma.category.createMany({
    data: categoryData
  })


  return {
    statusCode: 201,
    body: {
      message: 'Categories seeded successfully'
    }
  }
}

// System: Run the main function
main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
