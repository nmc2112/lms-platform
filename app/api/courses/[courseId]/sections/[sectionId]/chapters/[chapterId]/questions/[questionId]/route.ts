import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, sectionId: string; chapterId: string; questionId: string}}
){
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized",{ status: 401});
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })


        if(!courseOwner) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const question = await db.question.delete({
            where: {
                chapterId: params.chapterId,
                id: params.questionId
            }
        })

        return NextResponse.json(question);
    } catch (error) {
        console.log("CHAPTERQUESTON_ID", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}