/*
  Warnings:

  - You are about to drop the column `jumlah_tersedia` on the `buku` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nik]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `buku` DROP COLUMN `jumlah_tersedia`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `nik` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_nik_key` ON `User`(`nik`);
