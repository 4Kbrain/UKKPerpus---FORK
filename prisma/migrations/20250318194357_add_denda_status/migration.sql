/*
  Warnings:

  - You are about to alter the column `amount` on the `denda` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `denda` MODIFY `amount` DECIMAL(10, 2) NOT NULL;
