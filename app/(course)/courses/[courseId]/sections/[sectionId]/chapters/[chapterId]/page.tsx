import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseInfo from "./_components/course-info";
import HtmlRenderer from "./_components/html-renderer";
import QuizForm from "./_components/quiz-form";
import SlideForm from "./_components/slide-form";
import DiscussForm from "./_components/discuss-form";
import ReviewForm from "./_components/review-form";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; sectionId: string; chapterId: string }
}) => {
  const { userId } = auth();
  
  if (!userId) {
    return redirect("/sign-in");
  }

  const chapterData = await getChapter({
    userId,
    courseId: params.courseId,
    sectionId: params.sectionId,
    chapterId: params.chapterId,
  });

  const {
    chapter,
    section,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = chapterData;

  if (!chapter || !course || !section) {
    return redirect("/sign-in");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  const reviewsCount = course.reviews.length
  const averageRating = reviewsCount
      ? course.reviews.reduce((acc, review) => acc + review.star, 0) / reviewsCount
      : 0;

  return ( 
    <div className="flex flex-col min-h-screen">
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-7xl mx-auto w-full">
        <div className="p-2">
          {chapter.videoUrl ? (
            <VideoPlayer
              chapterId={params.chapterId}
              title={chapter.title}
              courseId={params.courseId}
              sectionId={params.sectionId}
              nextChapterId={nextChapter?.id}
              playbackId={muxData?.playbackId!}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
            />
          ) : (
            <>
              {chapter.questions && chapter.questions.length > 0 ? (
                <QuizForm questions={chapter.questions} />
              ) : (
                <>
                  {chapter.attachments.length === 1 ? (
                    <div className="flex flex-col min-h-[50vh] p-5">
                      <SlideForm url={chapter.attachments[0].url} />
                    </div>
                  ) : (
                    <div className="flex flex-col min-h-[50vh] p-5">
                      <HtmlRenderer content={chapter.description} />
                    </div>
                  )}
                </>
              )}
            </>
          )}

        </div>
      </div>
      <div className="w-full px-4"> 
        <div className="p-2 flex flex-col md:flex-row items-center justify-between mx-auto w-full">
          <h4 className="text-xl font-semibold mb-2">
            {chapter.title}
          </h4>
          {purchase ? (
            <CourseProgressButton
              chapterId={params.chapterId}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted} 
              sectionId={params.sectionId}  />
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price!}
            />
          )}
        </div>
        <div className="flex flex-col mx-auto w-full">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-2 w-full">
              <TabsTrigger 
                value="overview" 
                className="px-6 font-medium border-b-2 border-transparent hover:border-gray-300 w-full text-center"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="announcements" 
                className="px-6 font-medium border-b-2 border-transparent hover:border-gray-300 w-full text-center"
              >
                Discussion
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="px-6 font-medium border-b-2 border-transparent hover:border-gray-300 w-full text-center"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            <Separator />
            <TabsContent value="overview" className="flex-grow">
              <p className="text-xl p-4">{course.description!} </p>
              <CourseInfo courseRatings={course.reviews.length} students={course.purchases.length} averageRating={averageRating} />
              {!!attachments.length && (
                <>
                  <Separator />
                  <div className="p-4">
                    {attachments.map((attachment) => (
                      <a 
                        href={attachment.url}
                        target="_blank"
                        key={attachment.id}
                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                      >
                        <File />
                        <p className="line-clamp-1">
                          {attachment.name}
                        </p>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="announcements" className="flex-grow">
                <DiscussForm comments={course.comments} courseId={params.courseId} userId={userId}/>
            </TabsContent>
            <TabsContent value="reviews" className="flex-grow">
              <ReviewForm courseId={params.courseId} userId={userId}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;
            
