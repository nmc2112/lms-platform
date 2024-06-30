import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            console.error("Authorization failed: No user ID found");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!await isTeacher(userId)) {
            console.error(`Authorization failed: User ${userId} is not a teacher`);
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { name, duration, numberOfQuestions, classroomId, quesCategoryId } = await req.json();
        console.log("Received data:", { name, duration, numberOfQuestions, classroomId, quesCategoryId });

        // Validate the input data more thoroughly
        if (!name || !duration || !numberOfQuestions || !classroomId || !quesCategoryId) {
            console.error("Validation error: Missing required fields", { name, duration, numberOfQuestions, classroomId, quesCategoryId });
            return new NextResponse("Bad Request: Missing required fields", { status: 400 });
        }

        // Additional validation for data types
        if (typeof name !== 'string' || isNaN(Number(duration)) || isNaN(Number(numberOfQuestions))) {
            console.error("Validation error: Invalid data types", { name, duration, numberOfQuestions });
            return new NextResponse("Bad Request: Invalid data types", { status: 400 });
        }

        const assignment = await db.assignment.create({
            data: {
                userId,
                name,
                duration: parseInt(duration),
                numberOfQuestions: parseInt(numberOfQuestions),
                classroomId,
                quesCategoryId,
            }
        });

        console.log("Assignment created successfully:", assignment);
        return new NextResponse(JSON.stringify({ status: 'success', assignment }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error in creating assignment:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
