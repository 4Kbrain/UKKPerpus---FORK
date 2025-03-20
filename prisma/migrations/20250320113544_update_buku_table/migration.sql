/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `Buku` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `buku` ADD COLUMN `edisi` VARCHAR(20) NULL,
    ADD COLUMN `isbn` VARCHAR(20) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Buku_isbn_key` ON `Buku`(`isbn`);
