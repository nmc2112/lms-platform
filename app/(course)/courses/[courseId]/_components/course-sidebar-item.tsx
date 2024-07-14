"use client";

import { CheckCircle, ChevronDown, ChevronUp, Lock, PlayCircle, StickyNote, Folder, FileText, HelpCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import axios from "axios";
import { Chapter, ChapterAttachment, Question, UserProgress } from "@prisma/client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import toast from "react-hot-toast";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  courseId: string;
  chapters: { id: string, title: string, isPublished: boolean, isFree: boolean, videoUrl?: string | null, userProgress: UserProgress[], attachments: ChapterAttachment[], questions: Question[] }[];
  isPurchase: boolean;
}

const fetchVideoDuration = (videoUrl: string) => {
  return new Promise<number>((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration;
      const minutes = Math.ceil(duration / 60); // Round up to the nearest minute
      resolve(minutes);
    });
  });
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
  const confetti = useConfettiStore();

  const isActive = pathname?.includes(id);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [videoDurations, setVideoDurations] = useState<{ [key: string]: number }>({});
  const [totalDuration, setTotalDuration] = useState(0);
  const [resourcesOpen, setResourcesOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const completedChapters = chapters.filter(chapter => 
      Array.isArray(chapter.userProgress) && chapter.userProgress.length > 0 
      && chapter.userProgress[0].isCompleted
    ).length;

    setCompletedCount(completedChapters);

    const fetchDurations = async () => {
      const durations: { [key: string]: number } = {};
      let total = 0;
      for (const chapter of chapters) {
        if (chapter.videoUrl) {
          const duration = await fetchVideoDuration(chapter.videoUrl);
          durations[chapter.id] = duration;
          total += duration;
        }
      }
      setVideoDurations(durations);
      setTotalDuration(total);

    };

    fetchDurations();
  }, [chapters]);

  const toggleDropDown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleResources = (chapterId: string) => {
    setResourcesOpen((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleCheckboxChange = async (chapterId: string, sectionId: string, isCompleted: boolean) => {
    try {
      await axios.put(`/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      });

      toast.success("Progress updated");
      router.refresh();

      const updatedChapters = chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            userProgress: chapter.userProgress.map(progress => ({
              ...progress,
              isCompleted: !isCompleted
            }))
          };
        }
        return chapter;
      });
      const completedChapters = updatedChapters.filter(chapter => 
        Array.isArray(chapter.userProgress) && chapter.userProgress.length > 0 
        && chapter.userProgress[0].isCompleted
      ).length;
      setCompletedCount(completedChapters);
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

  return (
    <div>
      <div
        onClick={toggleDropDown}
        className={cn(
          "flex justify-between items-center gap-x-2 text-slate-500 border-gray-500 text-md font-[350] px-5 py-4 pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
          isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        )}
      >
        <div className="flex flex-col">
          <b className="text-md">{label}</b> 
          <p className="text-xs">{completedCount} / {chapters.length} | {totalDuration}min</p>
        </div>
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
            const isViewing = pathname?.includes(chapter.id);
            const duration = videoDurations[chapter.id];

            return (
              <div 
                key={chapter.id} 
                className={cn(
                  "cursor-pointer justify-between items-center gap-x-1 border-collapse border-gray-500 text-slate-500 text-sm font-[400] px-3 py-2 pl-3 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                  isViewing && "bg-blue-200" // Change to the background color you prefer
                )}
                onClick={() => router.push(`/courses/${courseId}/sections/${id}/chapters/${chapter.id}`)}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-x-2 py-2 pl-4">
                    {isLocked ? (
                      <Lock className="h-4 w-4 text-black" />
                    ) : (
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        readOnly
                        className="form-checkbox h-4 w-4 accent-gray-500"
                        onChange={() => handleCheckboxChange(chapter.id, id, isCompleted)}
                      />
                    )}
                    <span className={cn("text-slate-900", isViewing && "text-slate-700")}>
                      {chapter.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <div className="flex items-center pl-4">
                      {chapter.videoUrl ? (
                        <>
                          <PlayCircle className="h-4 w-4 mr-1" />
                          <span>{duration ? `${duration}min` : "Loading..."}</span>
                        </>
                      ) : (
                        <>
                          {chapter.questions && chapter.questions.length > 0 ? (
                            <></>
                          ) : (
                            <StickyNote className="h-4 w-4 mr-1" />
                          )}
                        </>
                      )}
                    </div>
                    {chapter.attachments && chapter.attachments.length > 0 && !isLocked && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleResources(chapter.id);
                          }}
                          className="text-xs border border-black rounded px-2 py-1 flex items-center"
                        >
                          <Folder className="mr-1 h-4 w-4" />
                          Resources
                          {resourcesOpen[chapter.id] ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </button>
                        {resourcesOpen[chapter.id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg z-10">
                            {chapter.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center text-xs text-slate-600 px-4 py-2 hover:bg-gray-100">
                                <FileText className="mr-2 h-4 w-4" />
                                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                  {attachment.name}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
