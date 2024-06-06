"use client";

import { CheckCircle, ChevronDown, ChevronUp, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Chapter } from "@prisma/client";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  courseId: string;
  chapters: { id: string, title: string }[];
};

export const CourseSidebarItem = ({
  label,
  id,
  courseId,
  chapters
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/sections/${id}`);
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          {label}
          {isDropdownOpen ? (
              <ChevronUp />
          ) : (
              <ChevronDown />
          )}
      </div>
      {isDropdownOpen && (
        <div>
          {chapters.map(chapter => (
            <div 
              key={chapter.id} 
              className={cn("cursor-pointer justify-between items-center gap-x-2 text-slate-500 text-sm font-[400] px-5 py-4 pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20")}
              onClick={() => router.push(`/courses/${courseId}/sections/${id}/chapters/${chapter.id}`)}>
              {chapter.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
