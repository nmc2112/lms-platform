import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    // Fetch all chapters in the course (regardless of publication status)
    const allChapters = await db.chapter.findMany({
      where: {
        section: {
          courseId: courseId,
        },
        isPublished: true,
      },
      select: {
        id: true,
      }
    });

    const totalChapters = allChapters.length;
    console.log("Total Chapters in Course:", totalChapters, "Course ID:", courseId);

    // Fetch chapters in the course that the user has completed
    const completedChapters = await db.userProgress.findMany({
      where: {
        userId: userId,
        chapter: {
          section: {
            courseId: courseId,
          },
        },
        isCompleted: true,
      },
      select: {
        chapterId: true,
      }
    });

    const completedChapterCount = completedChapters.length;
    console.log("Completed Chapters Count:", completedChapterCount);

    if (totalChapters === 0) {
      return 0; // Avoid division by zero if no chapters are in the course
    }

    const progressPercentage = (completedChapterCount / totalChapters) * 100;
    console.log("Progress Percentage:", progressPercentage);

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
}
