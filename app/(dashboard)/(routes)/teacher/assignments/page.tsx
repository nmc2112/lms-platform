
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
    const assignments = await db.assignment.findMany({
        where: {
            userId,
        },
        orderBy: {
          name: "asc",
        },
      });
    return(
        
        <div className="p-6">
            <DataTable columns={columns} data={assignments} userId={userId} />
        </div>
    );
}

export default AssignmentsPage;