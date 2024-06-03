import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "@/node_modules/next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Banner } from "@/components/banner";
import { Actions } from "../../_components/actions";
import { ChaptersForm } from "./_components/chapters-form";



const SectionIdPage = async({
    params
}:{
    params : {sectionId: string}
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

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks}/>
                                <h2 className="text-xl">Course sections</h2>
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