-- AlterTable
ALTER TABLE `denda` ADD COLUMN `statusAlasan` ENUM('DIGANTIKAN') NOT NULL DEFAULT 'DIGANTIKAN',
    MODIFY `amount` DECIMAL(10, 2) NULL;
