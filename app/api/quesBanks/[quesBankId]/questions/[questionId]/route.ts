import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function DELETE(
    req: Request,
    { params }: { params: {quesBankId: string; questionId: string}}
){
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized",{ status: 401});
        }

        const question = await db.question.delete({
            where: {
                quesCategoryId: params.quesBankId,
                id: params.questionId
            }
        });

        return NextResponse.json(question);
    } catch (error) {
        console.log("QUESTONBANK_ID", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function PUT(
    req: Request,
    { params }: { params: {quesBankId: string; questionId: string}}
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { content, options, correctOption } = await req.json();

        const question = await db.question.update({
            where: {
                quesCategoryId: params.quesBankId,
                id: params.questionId
            },
            data: {
                content,
                options,
                correctOption,
                quesCategoryId: params.quesBankId,
            }
        });

        return NextResponse.json(question);
    } catch (error) {
        console.log("QUESTONBANK_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
