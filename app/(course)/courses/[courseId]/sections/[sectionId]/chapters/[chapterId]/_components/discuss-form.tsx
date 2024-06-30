"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@prisma/client";
import { useUser } from "@clerk/clerk-react";

interface DiscussFormProps {
  comments: Comment[];
  courseId: string;
  userId: string;
}

const formSchema = z.object({
  text: z.string().min(1, "Comment text is required"),
});

export const DiscussForm = ({ comments, courseId, userId }: DiscussFormProps) => {
  // Sort initial comments by createdAt from new to old
  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComments, setNewComments] = useState<Comment[]>(sortedComments);
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const newComment = {
        ...values,
        userId,
        userName: user.fullName || "User", // Include userName here
        courseId,
        createdAt: new Date(),
      };

      console.log("Submitting comment:", newComment);

      const response = await axios.post(`/api/courses/${courseId}/comments`, newComment);
      const createdComment = response.data;
      // Add the new comment at the beginning of the array and sort
      setNewComments([createdComment, ...newComments]);
      toast.success("Comment submitted successfully");
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarLogo = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    return (
      <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full text-lg font-semibold">
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {user && (
        <div className="mb-4">
          {getAvatarLogo(user.fullName || "User")}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting}
                    placeholder="Write your comment here..."
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button disabled={isSubmitting} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
      <ul className="mt-6 space-y-4">
        {newComments.map((comment) => (
          <li key={comment.id} className="flex items-start space-x-4 p-4 bg-white shadow rounded-lg">
            <div className="flex-shrink-0">
              {getAvatarLogo(comment.userName)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{comment.userName}</div>
              <div className="mt-1 text-sm text-gray-700">{comment.text}</div>
              <div className="mt-1 text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscussForm;
