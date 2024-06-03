import { db } from "@/lib/db";
import { NextResponse } from "@/node_modules/next/server";
import { auth } from "@clerk/nextjs/server";


export async function POST(
    req: Request,
    { params }: { params: {courseId: string,sectionId: string}} 
){
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const sectionOwner = await db.section.findUnique({
            where: {
                id: params.sectionId,
            }
        })

        if(!sectionOwner){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                sectionId: params.sectionId,
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1

        const chapter = await db.chapter.create({
            data: {
                title,
                sectionId: params.sectionId,
                position: newPosition
            }
        })

        return NextResponse.json(chapter)
    } catch (error) {
        console.log("[CHAPTERS]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}