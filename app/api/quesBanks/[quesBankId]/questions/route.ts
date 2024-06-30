// Import necessary modules and define your database connection
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Handle GET request to fetch questions for a specific chapter
export async function GET(
    req: Request,
    { params }: { params: {quesBankId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        const questions = await db.question.findMany({
            where: {
                quesCategoryId: params.quesBankId,
            }
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error("QUESTION_BANK_ID ERROR: ", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Handle POST request to add a new question
export async function POST(
    req: Request,
    { params }: { params: { quesBankId: string } }
) {
    try {
        const { userId } = auth();
        const { content, options, correctOption } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Validate correctOption index before creation
        if (correctOption >= options.length || correctOption < 0) {
            return new NextResponse("Invalid correct option index", { status: 400 });
        }

        const question = await db.question.create({
            data: {
                content,
                options,
                correctOption,
                chapterId:"",
                quesCategoryId: params.quesBankId,
            }
        });

        return NextResponse.json(question);
    } catch (error) {
        console.error("BANK_ID_QUESTIONS ERROR: ", error);

        return new NextResponse("Internal Error", { status: 500 });
    }
}
