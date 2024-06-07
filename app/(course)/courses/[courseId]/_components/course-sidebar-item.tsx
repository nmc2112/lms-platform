"use client";

import { CheckCircle, ChevronDown, ChevronUp, Lock, PlayCircle, BookOpenText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { UserProgress } from "@prisma/client";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  courseId: string;
  chapters: { id: string, title: string, isPublished: boolean, isFree: boolean, videoUrl?: string, userProgress: UserProgress[]}[];
  isPurchase: boolean;
};

export const CourseSidebarItem = ({
  label,
  id,
  courseId,
  chapters,
  isPurchase
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname?.includes(id);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const completedChapters = chapters.filter(chapter => 
      Array.isArray(chapter.userProgress) && chapter.userProgress.length > 0 
      && chapter.userProgress[0].isCompleted
    ).length;

    setCompletedCount(completedChapters);
  }, [chapters]);

  const toggleDropDown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <div>
      <div
        onClick={toggleDropDown}
        className={cn(
          "flex justify-between items-center gap-x-2 text-slate-500 text-sm font-[500] px-5 py-4 pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
          isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        )}
      >
        <b>{label}</b> 
        <span>{completedCount} / {chapters.length}</span>
        {isDropdownOpen ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
      </div>
      {isDropdownOpen && (
        <div>
          {chapters.filter(chapter => chapter.isPublished).map(chapter => {
            const isLocked = !chapter.isFree && !isPurchase;
            const isCompleted = Array.isArray(chapter.userProgress) && chapter.userProgress.length > 0 
              ? !!chapter.userProgress[0].isCompleted 
              : false;

            const Icon = isLocked ? Lock 
                        : (isCompleted ? CheckCircle 
                        : (chapter.videoUrl ? PlayCircle : BookOpenText));
            
            return (
              <div 
                key={chapter.id} 
                className={cn("cursor-pointer justify-between items-center gap-x-2 text-slate-500 text-sm font-[400] px-5 py-4 pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20")}
                onClick={() => router.push(`/courses/${courseId}/sections/${id}/chapters/${chapter.id}`)}
              >
                <div className="flex items-center gap-x-2 py-4">
                  <Icon size={22} className={cn("text-slate-500", isActive && "text-slate-700", isCompleted && "text-emerald-700")} />
                  {chapter.title}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
