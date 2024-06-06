/*
  Warnings:

  - You are about to drop the column `sectionId` on the `UserProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,chapterId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chapterId` to the `UserProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `UserProgress_sectionId_idx` ON `UserProgress`;

-- DropIndex
DROP INDEX `UserProgress_userId_sectionId_key` ON `UserProgress`;

-- AlterTable
ALTER TABLE `UserProgress` DROP COLUMN `sectionId`,
    ADD COLUMN `chapterId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `UserProgress_chapterId_idx` ON `UserProgress`(`chapterId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserProgress_userId_chapterId_key` ON `UserProgress`(`userId`, `chapterId`);
