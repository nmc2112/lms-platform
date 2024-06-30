// pages/api/courses/[courseId]/comments.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      console.error("Unauthorized access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      console.error("Course not found:", params.courseId);
      return new NextResponse("Not found", { status: 404 });
    }

    const body = await req.json();
    const { text } = body;

    if (!text) {
      console.error("Comment text is required");
      return new NextResponse("Comment text is required", { status: 400 });
    }

    const comment = await db.comment.create({
      data: {
        text,
        userId: user.id,
        userName: user.fullName || "User", // Save userName here
        courseId: params.courseId,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("[COURSE_ID_COMMENT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const comments = await db.comment.findMany({
      where: {
        courseId: params.courseId,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[COURSE_COMMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
