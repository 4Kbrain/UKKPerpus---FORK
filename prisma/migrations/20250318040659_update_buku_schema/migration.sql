/*
  Warnings:

  - A unique constraint covering the columns `[kode_buku]` on the table `Buku` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Buku_kode_buku_key` ON `Buku`(`kode_buku`);
