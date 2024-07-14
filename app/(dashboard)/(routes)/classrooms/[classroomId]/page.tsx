import { Button } from "@/components/ui/button";
import Link from "next/link"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { Assistant } from "next/font/google/index";
import AsssignmentService from "@/app/admin/services/AsssignmentService";
import { Assignment } from "@prisma/client";
import QuizForm from "./_components/quiz-form";

const AssignmentIdPage = async({
    params
}:{
    params : {
        assignmentId: number}
}) => {

    const { userId } = auth();

    if(!userId) {
        return redirect("/sign-in");
    }


    return(
        <div className="p-6">
            <QuizForm assignmentId={params.assignmentId} userId={userId}/>
        </div>
    );
}

export default AssignmentIdPage;