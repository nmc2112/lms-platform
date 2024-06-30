"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash, Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ChapterAssignmentFormProps {
    initialData: Chapter;
    courseId: string;
    sectionId: string;
    chapterId: string;
}

interface Question {
    id: string;
    content: string;
    options: string[];
    correctOption: number;
}

const questionSchema = z.object({
    content: z.string().min(1, "Question content is required"),
    options: z.array(z.object({ value: z.string().min(1, "Option is required") })).min(2, "At least two options are required"),
    correctOption: z.number().min(0, "Correct option is required"),
});

export const ChapterAssignmentForm = ({
    initialData,
    courseId,
    sectionId,
    chapterId,
}: ChapterAssignmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const router = useRouter();

    useEffect(() => {
        console.log("Initial Data:", initialData);
        // Fetch questions from the database
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/questions`);
                setQuestions(response.data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [courseId, sectionId, chapterId, initialData]);

    const form = useForm({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            content: '',
            options: [{ value: '' }, { value: '' }, { value: '' }],
            correctOption: 0,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options"
    });

    const { isSubmitting, isValid } = form.formState;

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof questionSchema>) => {
        console.log("Form Data: ", values);

        if (values.correctOption >= values.options.length) {
            toast.error("Correct option must be a valid index");
            return;
        }

        try {
            const response = await axios.post(`/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/questions`, {
                ...values,
                options: values.options.map(option => option.value),
                correctOption: parseInt(values.correctOption.toString(), 10),
            });
            toast.success("Question added successfully");
            setQuestions([...questions, response.data]);
            form.reset();
            toggleEdit();
        } catch (error) {
            toast.error("Something went wrong");
            console.error("Error adding question:", error);
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/questions/${id}`);
            toast.success("Question deleted");
            setQuestions(questions.filter(question => question.id !== id));
        } catch (error) {
            toast.error("Something went wrong");
            console.error("Error deleting question:", error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter assignment
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add question
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {questions.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No questions yet
                        </p>
                    )}
                    {questions.length > 0 && (
                        <div className="space-y-2">
                            {questions.map((question) => (
                                <div
                                    key={question.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 md"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{question.content}</p>
                                        <ul className="horizontal-list">
                                            {question.options.map((option, index) => (
                                                <li key={index} className={index === question.correctOption ? "text-green-600" : ""}>
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {deletingId === question.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== question.id && (
                                        <button
                                            onClick={() => onDelete(question.id)}
                                            className="ml-auto hover:opacity-75 transition"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Enter question content" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {fields.map((field, index) => (
                            <FormField
                                key={field.id}
                                control={form.control}
                                name={`options.${index}.value`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2">
                                                <Input {...field} placeholder={`Option ${index + 1}`} />
                                                <Button type="button" variant="ghost" onClick={() => remove(index)}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        <Button type="button" variant="ghost" onClick={() => append({ value: '' })}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add option
                        </Button>

                        <FormField
                            control={form.control}
                            name="correctOption"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Enter correct option index"
                                            min="0"
                                            max={fields.length - 1}
                                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))} // Convert to number on change
                                        />
                                    </FormControl>
                                    <FormMessage />
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
    );
};
