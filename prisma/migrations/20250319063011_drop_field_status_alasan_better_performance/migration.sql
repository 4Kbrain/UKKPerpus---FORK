/*
  Warnings:

  - You are about to drop the column `statusAlasan` on the `denda` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `denda` DROP COLUMN `statusAlasan`,
    MODIFY `reason` ENUM('DIGANTIKAN', 'KETERLAMBATAN', 'RUSAK', 'HILANG', 'LAINNYA') NOT NULL;
