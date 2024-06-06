/*
  Warnings:

  - You are about to drop the column `chapterId` on the `UserProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,sectionId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sectionId` to the `UserProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `UserProgress_chapterId_idx` ON `UserProgress`;

-- DropIndex
DROP INDEX `UserProgress_userId_chapterId_key` ON `UserProgress`;

-- AlterTable
ALTER TABLE `UserProgress` DROP COLUMN `chapterId`,
    ADD COLUMN `sectionId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `UserProgress_sectionId_idx` ON `UserProgress`(`sectionId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserProgress_userId_sectionId_key` ON `UserProgress`(`userId`, `sectionId`);
