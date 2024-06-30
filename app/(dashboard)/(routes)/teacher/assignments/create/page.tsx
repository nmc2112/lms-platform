import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClassAssignment } from "../_components/classroom-assignment";


const CreatePage = async () => {
    const { userId } = auth();
    if(!userId) {
        return redirect("/sign-in");
    }
    const quesCategories = await db.quesCategory.findMany({
        where: {
            userId,
        },
        orderBy: {
          name: "asc",
        },
      });
    return(
        <ClassAssignment userId={userId} quesCategories={quesCategories}/>
    )
}

export default CreatePage;