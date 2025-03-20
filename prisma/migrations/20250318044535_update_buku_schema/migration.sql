-- DropForeignKey
ALTER TABLE `bookcategory` DROP FOREIGN KEY `BookCategory_bookId_fkey`;

-- DropIndex
DROP INDEX `BookCategory_bookId_categoryId_key` ON `bookcategory`;

-- AddForeignKey
ALTER TABLE `BookCategory` ADD CONSTRAINT `BookCategory_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Buku`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
