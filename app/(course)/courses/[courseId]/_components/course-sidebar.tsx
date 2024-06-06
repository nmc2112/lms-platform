import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, Section, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseProgress } from "@/components/course-progress";

import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarProps {
  course: Course & {
    sections: (Section[] & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase &&(
          <div className="mt-10">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.sections.map((section) => (
          <CourseSidebarItem
            key={section.id}
            id={section.id}
            label={section.title}
            // isCompleted={!!section.chapters.userProgress?.[0]?.isCompleted}
            courseId={course.id} isCompleted={false} isLocked={false} 
            chapters={section.chapters}           // isLocked={!chapter.isFree}
            // isLocked={!section.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};
