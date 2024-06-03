import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { NextResponse } from "@/node_modules/next/server";
import { auth } from "@clerk/nextjs/server";


export async function POST(
    req: Request,
    { params }: { params: { courseId: string}} 
){
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if(!courseOwner){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const lastSection = await db.section.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastSection ? lastSection.position + 1 : 1

        const section = await db.section.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition
            }
        })

        return NextResponse.json(section)
    } catch (error) {
        console.log("[SECTIONS]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}