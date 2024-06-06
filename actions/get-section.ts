import { db } from "@/lib/db";
import { Attachment, Chapter, Section } from "@prisma/client";

interface GetSectionProps {
  userId: string;
  courseId: string;
  sectionId: string;
};

export const getSection = async ({
  userId,
  courseId,
  sectionId,
}: GetSectionProps) => {
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
      }
    });

    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        isPublished: true,
      }
    });

    if (!section || !course) {
      throw new Error("Section or course not found");
    }

    let attachments: Attachment[] = [];
    let nextSection: Section | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId
        }
      });
    }

    if (section.isFree || purchase) {

      nextSection = await db.section.findFirst({
        where: {
          id: sectionId,
          isPublished: true,
          position: {
            gt: section?.position,
          }
        },
        orderBy: {
          position: "asc",
        }
      });
    }


    return {
      course,
      nextSection,
      purchase,
    };
  } catch (error) {
    console.log("[GET_SECTION]", error);
    return {
      section: null,
      course: null,
      nextSection: null,
      purchase: null,
    }
  }
}