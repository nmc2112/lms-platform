import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "@/node_modules/next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Banner } from "@/components/banner";
import { Actions } from "../../_components/actions";
import { ChaptersForm } from "./_components/chapters-form";
import Link from "next/link";
import { SectionActions } from "./_components/section-actions";



const SectionIdPage = async({
    params
}:{
    params : {
        courseId: string,
        sectionId: string}
}) => {
    const { userId } = auth();
    if(!userId){
        return redirect("/sign-in")
    }

    const section = await db.section.findUnique({
        where:{
            id: params.sectionId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                },
            }
        }
    }) 

    if(!section){
        return redirect("/sign-in");
    }

    return ( 
        <>
        {!section.isPublished && (
            <Banner
                label="This section is unpublished. It will not be visible to the students"
            />
        )}
            <div className="p-6">

                
            <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2"/> 
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">Section Creation</h1>
                                {/* <span className="text-sm text-slate-700">Complete all fields {completionText}</span> */}
                            </div>
                            <SectionActions
                                disabled={false}
                                courseId={params.courseId}
                                sectionId={params.sectionId}
                                isPublished={section.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid  gap-6 mt-16">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks}/>
                                <h2 className="text-xl">Section {section.title}</h2>
                            </div>
                            <ChaptersForm 
                                initialData={section}
                                courseId={section.courseId}
                                sectionId={section.id}
                            />
                        </div>
                    </div>
                </div>
            </div> 
        </>
        );
}
 
export default SectionIdPage;