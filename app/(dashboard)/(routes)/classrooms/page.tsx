import { Button } from "@/components/ui/button";
import Link from "next/link"
import { DataTable } from "./_components/data-table";

import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { Assistant } from "next/font/google/index";
import AsssignmentService from "@/app/admin/services/AsssignmentService";
import { Assignment } from "@prisma/client";

const ClassroomPage = () => {

    const { userId } = auth();

    if(!userId) {
        return redirect("/sign-in");
    }


    return(
        
        <div className="p-6">
            <DataTable columns={columns} userId={userId} />
        </div>
    );
}

export default ClassroomPage;