"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form"

import{
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

interface ChapterQuizFormProps {
    courseId: string;
    sectionId: string;
    chapterId: string;
}

export const ChapterQuizForm = ({
    courseId,
    sectionId,
    chapterId
}: ChapterQuizFormProps) => {

    const router = useRouter();


    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/sections/${sectionId}/chapters/${id}/questions`);
    }

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter quiz
                <Button onClick={() => onEdit(chapterId)} variant="ghost">
                    <Pencil className="h-4 w-4 mr-2"/>    
                    Edit quiz
                </Button>    
            </div>
        </div>
    )
}