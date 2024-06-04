"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";


interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    sectionId: string;
    chapterId: string;
    isPublished: boolean;
}

export const ChapterActions = ({
    disabled,
    courseId,
    sectionId,
    chapterId,
    isPublished
}: ChapterActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if(isPublished) {
                await axios.patch(`/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/unpublish`);
                toast.success('Chapter unpublished');
            }
            else{
                await axios.patch(`/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/publish`);
                toast.success('Chapter published');
            }
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }finally{
            setIsLoading(false);
        }

    }
    
    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`);

            toast.success("Chapter deleted");
            router.refresh();
            router.push(`/teacher/courses/${courseId}/sections/${sectionId}`);
            
        } catch (error) {
            toast.error("Something went wrong")
        }finally{
            setIsLoading(false);
        }
    }
    return(
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}