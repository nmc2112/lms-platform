
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "@/node_modules/next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { 
        courseId:string; 
        sectionId: string,
        chapterId: string}}
){
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status:401})
        }

        const ownSection = await db.section.findUnique({
            where: {
                id: params.sectionId
            }
        })

        if(!ownSection){
            return new NextResponse("Unauthorized", {status:404})
        }

        const unpublishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                sectionId: params.sectionId
            },
            data: {
                isPublished: false
            }
        })

        const publishedChaptersInSection = await db.chapter.findMany({
            where:{
                sectionId: params.sectionId,
                isPublished: true,
            }
        })

        if(!publishedChaptersInSection.length){
            await db.section.update({
                where: {
                    id: params.sectionId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(unpublishedChapter);
    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]", error);
        return new NextResponse('Internal Error', {status: 500})
    }
}