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
import { Pencil, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course, Section } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { SectionsList } from "./sections-list";

interface SectionsFormProps {
    initialData: Course & { sections: Section[] };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
    
})

export const SectionsForm = ({
    initialData,
    courseId}: SectionsFormProps) => {

    const [isCreating, setIsCreating] = useState(false);    
    const [isUpdating, setIsUpdating] = useState(false);    

    const toggleCreating = () => setIsCreating((current) => !current)

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values:  z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/sections`, values);
            toast.success("Sections created");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const onReorder = async (updateData: { id: string; position: number}[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/sections/reorder`, {
                list: updateData
            })
            toast.success("Sections reordered");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/sections/${id}`);
    }

    return(
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course sections
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    )
                    :(
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>    
                            Add a section
                        </>
                    )}
                </Button>    
            </div>
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.sections && "text-slate-500 italic"
                )}>
                    {!initialData.sections.length && "No sections"}
                    <SectionsList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.sections || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the sections
                </p>
            )}
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"    
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'This course is about ...'"
                                            {...field}    
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}    
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}