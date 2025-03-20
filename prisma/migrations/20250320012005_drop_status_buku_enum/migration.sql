/*
  Warnings:

  - The values [DIPINJAM,DIBLOKIR,DIRESERVASI] on the enum `Buku_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `buku` MODIFY `status` ENUM('TIDAK_TERSEDIA', 'TERSEDIA') NOT NULL DEFAULT 'TERSEDIA';
