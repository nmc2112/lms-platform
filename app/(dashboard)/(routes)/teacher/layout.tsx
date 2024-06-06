import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";


const TeacherLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { userId } = auth();


  if (!isTeacher(userId)) {
    return redirect("/sign-in");
  }

  return <>{children}</>
}
 
export default TeacherLayout;