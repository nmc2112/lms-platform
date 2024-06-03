import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "@/node_modules/next/server";

const mux = new Mux({
    tokenId:process.env.MUX_TOKEN_ID,
    tokenSecret:process.env.MUX_TOKEN_SECRET,
});

export async function DELETE(
    req: Request,
    {params}: {params:{ courseId:string; sectionId:string}}
){
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const ownCourse = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId: userId
            }
        })

        if(!ownCourse){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const section = await db.section.findUnique({
            where:{
                id: params.sectionId,
                courseId: params.courseId,
            }
        }) 

        if(!section){
            return new NextResponse("Not Found", {status: 404})
        }


        const deletedSection = await db.chapter.delete({
            where: {
                id: params.sectionId
            }
        });

        const publishedSectionsInCourse = await db.section.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        })

        if(!publishedSectionsInCourse.length){
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedSection);

    } catch (error) {
        console.log("[SECTION_ID_DELETE]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: {
        courseId: string;
        chapterId: string
    }}
){
    try {
        const { userId } = auth();

        const {isPublished, ...values} = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const ownCourse = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId: userId,
            }
        })

        if(!ownCourse){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const section = await db.section.update({
            where:{
                id: params.chapterId,
                courseId: params.courseId,
            },
            data:{
                ...values
            }
        }) 

        return NextResponse.json(section);

    } catch (error) {
        console.log("[SECTION_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", {status: 500})
        
    }
}