/*
  Warnings:

  - Made the column `totalDenda` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_email_idx` ON `user`;

-- DropIndex
DROP INDEX `User_username_idx` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `totalDenda` DECIMAL(10, 2) NOT NULL DEFAULT 0;
