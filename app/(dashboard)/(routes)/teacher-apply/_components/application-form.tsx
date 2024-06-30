"use client";

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import  Image   from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ApplicationFormProps {
    initialData: TeacherRequest;
}

const formSchema = z.object({
    url: z.string().min(1, {
        message: "File is required"
    })
})

export const ApplicationForm = ({
    initialData,
    }: ApplicationFormProps) => {

    const [isEditing, setIsEditing] = useState(false);    

    const toggleEdit = () => setIsEditing((current) => !current)

    const router = useRouter();

    const onSubmit = async (values:  z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            await axios.patch(`/api/teacher-apply/${initialData.userClerkId}`, values);
            toast.success("CV updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.url && (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add an file
                        </>
                    )}
                    {!isEditing && initialData.url && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>    
                            Edit file
                        </>
                    )}
                </Button>    
            </div>
            {!isEditing && (
                <>
                    {!initialData.url && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.url && (
                        <div className="space-y-2">
                            <div
                                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 md"
                            >
                            <p className="text-xs line-clamp-1">
                                {initialData.url}
                            </p>
                        </div>
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if(url){
                                onSubmit({url: url});
                            }
                        }}
                    />
                    {/* <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div> */}
                </div>
            )}
        </div>
    )
}