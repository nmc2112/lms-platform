// pages/api/courses/[courseId]/reviews.ts

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
    const { text, star } = body;

    if (!text || !star) {
      console.error("Review text and star rating are required");
      return new NextResponse("Review text and star rating are required", { status: 400 });
    }

    const review = await db.review.create({
      data: {
        text,
        star,
        userId: user.id,
        userName: user.fullName || "User",
        courseId: params.courseId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[COURSE_ID_REVIEW]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const reviews = await db.review.findMany({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[COURSE_REVIEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
