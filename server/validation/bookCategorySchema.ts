import { BookCategory } from "@prisma/client"
import { z } from "zod";

export const BookCategorySchema = z.object({
    bookId: z.string().uuid("UUID must be valid"),
    categoryId: z.string().uuid("UUID must be valid"),
    // userId: z.string().uuid("UUID must be valid"),
})


export type BookCategorySchema = z.infer<typeof BookCategorySchema>;