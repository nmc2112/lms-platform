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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/clerk-react";

interface ReviewFormProps {
  courseId: string;
  userId: string;
}

const formSchema = z.object({
  text: z.string().min(1, "Review text is required"),
  star: z.number().min(1, "Star rating is required").max(5, "Star rating must be 5 or less"),
});

const ReviewForm: React.FC<ReviewFormProps> = ({ courseId, userId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      star: 0,
    },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };

    fetchReviews();
  }, [courseId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const newReview = {
        ...values,
        userId,
        userName: user.fullName || "User",
        courseId,
        createdAt: new Date(),
      };

      const response = await axios.post(`/api/courses/${courseId}/reviews`, newReview);
      const createdReview = response.data;
      setReviews([createdReview, ...reviews]);
      toast.success("Review submitted successfully");
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
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
            name="star"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`text-lg ${field.value >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                        onClick={() => field.onChange(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting}
                    placeholder="Write your review here..."
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
        {reviews.map((review) => (
          <li key={review.id} className="flex items-start space-x-4 p-4 bg-white shadow rounded-lg">
            <div className="flex-shrink-0">
              {getAvatarLogo(review.userName)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{review.userName}</div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-lg ${review.star >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
              <div className="mt-1 text-sm text-gray-700">{review.text}</div>
              <div className="mt-1 text-xs text-gray-500">{new Date(review.createdAt).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewForm;
