/*
  Warnings:

  - A unique constraint covering the columns `[chapterId]` on the table `ChapterAttachment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ChapterAttachment_chapterId_key` ON `ChapterAttachment`(`chapterId`);
