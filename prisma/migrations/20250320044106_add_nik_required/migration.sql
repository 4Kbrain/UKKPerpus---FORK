/*
  Warnings:

  - Made the column `nik` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `nik` VARCHAR(191) NOT NULL;
