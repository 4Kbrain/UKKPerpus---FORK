/*
  Warnings:

  - You are about to alter the column `status` on the `denda` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `denda` MODIFY `status` ENUM('BELUM_LUNAS', 'LUNAS') NOT NULL DEFAULT 'BELUM_LUNAS';
