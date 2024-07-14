import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "@/node_modules/next/server";
import { redirect } from "@/node_modules/next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Icon, LayoutDashboard, Eye, Video, BookCheck, CircleEllipsis } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";
import { ChapterQuizForm } from "./_components/chapter-quiz-form";
import { ChapterAttachmentForm } from "./_components/chapter-attachments-form";
import { ChapterAssignmentForm } from "./_components/chapter-assignment-form";

const ChapterIdPage = async ({
    params,
    searchParams
}: {
    params: { courseId: string; sectionId: string; chapterId: string },
    searchParams: { option: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/sign-in");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
        },
        include: {
            attachments: true,
            questions: true
        }
    });

    if (!chapter) {
        return redirect("/sign-in");
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        // chapter.videoUrl
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    const selectedOption = searchParams.option || "video";

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="This chapter is unpublished. It will not be visible in this course"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}/sections/${params.sectionId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to section setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                                <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={params.courseId}
                                sectionId={params.sectionId}
                                chapterId={params.chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleEllipsis} />
                                <h2 className="text-xl">Chapter Option</h2>
                            </div>
                            <div>
                                <form method="get" action="">
                                    <div className="mt-2 flex rounded-md shadow-sm">
                                        <select id="option-select" name="option" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                            <option value="video" selected={selectedOption === "video"}>Video & Slide</option>
                                            <option value="quiz" selected={selectedOption === "quiz"}>Quiz</option>
                                        </select>
                                        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-md">Select</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">Customize your chapter</h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={params.courseId}
                                sectionId={params.sectionId}
                                chapterId={params.chapterId}
                            />

                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params.courseId}
                                sectionId={params.sectionId}
                                chapterId={params.chapterId}
                            />

                            <ChapterAttachmentForm
                                initialData={chapter}
                                courseId={params.courseId}
                                sectionId={params.sectionId}
                                chapterId={params.chapterId}
                            />

                            {selectedOption === "quiz" && (
                                <ChapterQuizForm
                                    initialData={chapter}
                                    courseId={params.courseId}
                                    sectionId={params.sectionId}
                                    chapterId={params.chapterId}
                                />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">Access Settings</h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={params.courseId}
                                sectionId={params.sectionId}
                                chapterId={params.chapterId}
                            />
                        </div>
                    </div>
                    {selectedOption === "video" && (
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Video} />
                                <h2 className="text-xl">Add a video</h2>
                            </div>
                            <ChapterVideoForm
                                initialData={chapter}
                                courseId={params.courseId}
                                sectionId={params.sectionId}
                                chapterId={params.chapterId}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChapterIdPage;
