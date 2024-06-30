/*
  Warnings:

  - Added the required column `updateAt` to the `QuesCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `QuesCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `QuesCategory` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;
