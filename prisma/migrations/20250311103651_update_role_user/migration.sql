/*
  Warnings:

  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMINISTRATOR', 'PETUGAS', 'PEMINJAM') NOT NULL DEFAULT 'PEMINJAM';
