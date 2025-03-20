/*
  Warnings:

  - You are about to alter the column `reason` on the `denda` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `denda` MODIFY `reason` ENUM('KETERLAMBATAN', 'RUSAK', 'HILANG', 'LAINNYA') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `totalDenda` DECIMAL(10, 2) NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE `Notifikasi` (
    `id` CHAR(36) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `dendaId` VARCHAR(191) NULL,
    `message` VARCHAR(191) NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Buku_status_idx` ON `Buku`(`status`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- CreateIndex
CREATE INDEX `User_username_idx` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `Notifikasi` ADD CONSTRAINT `Notifikasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifikasi` ADD CONSTRAINT `Notifikasi_dendaId_fkey` FOREIGN KEY (`dendaId`) REFERENCES `Denda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `Denda_peminjamanId_idx` ON `Denda`(`peminjamanId`);
-- DROP INDEX `Denda_peminjamanId_fkey` ON `denda`;

-- RedefineIndex
CREATE INDEX `Denda_userId_idx` ON `Denda`(`userId`);
-- DROP INDEX `Denda_userId_fkey` ON `denda`;
