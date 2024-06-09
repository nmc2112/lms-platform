import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { Prisma } from "@prisma/client";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string; sectionId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { url } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.chapterAttachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                chapterId: params.chapterId,
            }
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.error("CHAPTER_ID_ATTACHMENTS ERROR: ", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a PrismaClientKnownRequestError
            console.error("Prisma error code:", error.code);
            if (error.code === 'P2002') {
                return new NextResponse("Duplicate entry", { status: 400 });
            }
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            console.error("Validation error:", error.message);
            return new NextResponse("Validation Error", { status: 400 });
        }

        return new NextResponse("Internal Error", { status: 500 });
    }
}
