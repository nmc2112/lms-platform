import { db } from "@/lib/db";
import { Attachment, Chapter, ChapterAttachment, Question } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  sectionId: string;
  chapterId: string;
};

interface ExtendedChapter extends Chapter {
  attachments: ChapterAttachment[];
  questions: Question[];
}

export const getChapter = async ({
  userId,
  courseId,
  sectionId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
        description:true,
        comments: true
      }
    });

    const section = await db.section.findUnique({
      where: {
        isPublished: true,
        id: sectionId,
      }
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
      include: {
        questions: true,
        attachments: true
         // Include questions in the query
      }
    }) as ExtendedChapter;

    if (!chapter || !course || !section) {
      throw new Error("Chapter or course or section not found");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId
        }
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        }
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          sectionId: sectionId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          }
        },
        orderBy: {
          position: "asc",
        }
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        }
      }
    });

    return {
      chapter,
      section,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      section: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    }
  }
}
