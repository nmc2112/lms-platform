"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ToastProvider } from "@/components/providers/toaster-provider";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    })
})
const CreatePage = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const { isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            const response = await axios.post("/api/quesBanks", values);
            toast.success("Category created");
            router.push(`/teacher/quesBanks/${response.data.id}`);
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return(
        <div className="max-w-5xl mx-auto flex md-items-center md-justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Name your category
                </h1>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Category Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isSubmitting}
                                                placeholder="e.g 'Advanced web development'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            What is the category of the question bank?
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Link href="/teacher/quesBanks">
                                    <Button 
                                        type="button"
                                        variant="ghost">
                                            Cancel
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit"
                                    disabled={!isValid || isSubmitting}>
                                        Continue
                                </Button>
                            </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CreatePage;