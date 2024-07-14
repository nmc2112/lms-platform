import { Button } from "@/components/ui/button";
import Link from "next/link"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const QuesBankPage =  async () => {

    const { userId } = auth();

    if(!userId) {
        return redirect("/sign-in");
    }

    const quesCategories = await db.quesCategory.findMany({
        where: {
            userId,
        },
        orderBy:{
            createdAt: "desc"
        }
    })

    return(
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Question Bank Management</h2>
            <DataTable columns={columns} data={quesCategories} userId={userId} />
        </div>
    );
}

export default QuesBankPage;