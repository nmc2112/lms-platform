import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "@/node_modules/next/navigation";
import { auth } from "@clerk/nextjs/server";
import { QuestionBankForm } from "./_components/questionbank-form";



const QuesBankIdPage = async({
    params
}:{
    params : {quesBankId: string}
}) => {
    const { userId } = auth();
    if(!userId){
        return redirect("/sign-in")
    }

    const quesByCategory = await db.quesCategory.findUnique({
        where:{
            id: params.quesBankId,
            userId
        },
        include: {
            questions: true
        }
    }) 

    if (!quesByCategory) {
        return <p>Category not found or you do not have access to this category.</p>;
      }

    return ( 
        <QuestionBankForm initialData={quesByCategory} quesBankId={params.quesBankId}/>
    );
}
 
export default QuesBankIdPage;