import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "@/node_modules/next/navigation";
import { auth } from "@clerk/nextjs/server";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { ListChecks } from "lucide-react";
import { CircleDollarSign, File } from "lucide-react";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { SectionsForm } from "./_components/sections-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";



const CourseIdPage = async({
    params
}:{
    params : {courseId: string}
}) => {
    const { userId } = auth();
    if(!userId){
        return redirect("/sign-in")
    }

    const course = await db.course.findUnique({
        where:{
            id: params.courseId,
            userId
        },
        include: {
            sections: {
                orderBy: {
                    position: "asc",
                },
            },
            attachments:{
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    }) 

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    })

    if(!course){
        return redirect("/sign-in");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.sections.some(section => section.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields} / ${totalFields})`

    const isComplete = requiredFields.every(Boolean);

    return ( 
        <>
        {!course.isPublished && (
            <Banner
                label="This course is unpublished. It will not be visible to the students"
            />
        )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Course Setup
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <Actions
                        disabled={!isComplete}
                        courseId={params.courseId}
                        isPublished={course.isPublished}
                        
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size="sm" variant="success" icon={LayoutDashboard}/>
                            <h2 className="text-xl">
                                Customize your course
                            </h2>
                        </div>
                        <TitleForm 
                            initialData={course}
                            courseId={course.id}
                        />
                        <DescriptionForm 
                            initialData={course}
                            courseId={course.id}
                        />
                        <ImageForm 
                            initialData={course}
                            courseId={course.id}
                        />
                        <CategoryForm 
                            initialData={course}
                            courseId={course.id} 
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}                    
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks}/>
                                <h2 className="text-xl">Course sections</h2>
                            </div>
                            <SectionsForm 
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSign}/>
                                <h2 className="text-xl">
                                    Sell your course
                                </h2>
                            </div>
                            <PriceForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File}/>
                                <h2 className="text-xl">
                                    Resources & Attachments
                                </h2>
                            </div>
                            <AttachmentForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                    </div>
                </div>
            </div> 
        </>
        );
}
 
export default CourseIdPage;