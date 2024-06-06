import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import AdminNavBar from "./(components)/AdminNavBar";
import AdminSideBar from "./(components)/AdminSideBar";

async function checkAdmin(userId?: string | null): Promise<boolean> {
  const users = await db.user.findMany({
      where: {
          role: "admin",
          userClerkId: {
            not: ""
          }
      }
  });

  return users.find(user => user.userClerkId === userId) !== undefined;
}


const AdminLayout = async ({
    children
  }: Readonly<{
    children: React.ReactNode;
  }>) => {

    const { userId } = auth();

    // Usage example:
    checkAdmin(userId).then(isAdmin => {
      console.log(isAdmin ? 'User is an admin' : 'User is not an admin');
    });

    if(await checkAdmin(userId) === false){
      redirect("/sign-in");
    }
    return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <AdminSideBar/>
        <AdminNavBar>
            <main className="flex flex-col gap-4 p-4 lg:gap-6">{children}</main>
        </AdminNavBar>

    </div>
    )
  }
export default AdminLayout;