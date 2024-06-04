import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "@/node_modules/next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { 
        courseId:string; 
        sectionId: string,
        chapterId: string
    }}
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

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId
            }
        })

        if(!chapter || !chapter.title || !chapter.description){
            return new NextResponse("Missing required fields", {status:400})
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                sectionId: params.sectionId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(publishedChapter);
    } catch (error) {
        console.log("[CHAPTER_PUBLISH]", error);
        return new NextResponse('Internal Error', {status: 500})
    }
}