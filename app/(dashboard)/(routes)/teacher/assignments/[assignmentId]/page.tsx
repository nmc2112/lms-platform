
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const StudentList =  async ({
    params
}: {
    params: {assignmentId: number}
}) => {

    const { userId } = auth();
    if(!userId) {
        return redirect("/sign-in");
    }
    return(
        
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Student List By Assignment</h2>
            <DataTable columns={columns} assignmentId={params.assignmentId} />
        </div>
    );
}

export default StudentList;