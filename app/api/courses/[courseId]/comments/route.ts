import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req:Request,
    {params}: { params: { courseId: string; text: string}})
    {
    try {
        const user = await currentUser();

        if(!user || !user.id || !user.emailAddresses?.[0]?.emailAddress){
            return new NextResponse("Unauthorized", {status: 401})    
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true
            },  
        })

        if(!course){
            return new NextResponse("Not found", { status: 404})
        }


        const comment = await db.comment.create({
            data: {
                text: params.text,
                userId: user.id,
                courseId: params.courseId
            }
        })

        

        return NextResponse.json(comment)

    } catch (error) {
        console.log("[COURSE_ID_COMMENT]", error);
        return new NextResponse("Internal error", {status: 500})    
    }
}