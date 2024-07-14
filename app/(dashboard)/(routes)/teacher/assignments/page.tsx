
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import { ClassAssignment } from "./_components/classroom-assignment";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const AssignmentsPage =  async () => {

    const { userId } = auth();
    if(!userId) {
        return redirect("/sign-in");
    }
    return(
        
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Assignment Management</h2>
            <DataTable columns={columns} userId={userId} />
        </div>
    );
}

export default AssignmentsPage;