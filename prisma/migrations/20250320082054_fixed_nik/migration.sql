/*
  Warnings:

  - You are about to alter the column `phone` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `nik` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(16)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `phone` VARCHAR(15) NOT NULL,
    MODIFY `nik` CHAR(16) NOT NULL;
