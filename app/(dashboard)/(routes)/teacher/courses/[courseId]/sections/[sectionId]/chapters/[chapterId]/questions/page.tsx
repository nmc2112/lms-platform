"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const choiceSchema = z.object({
  text: z.string().min(1, "Choice text is required"),
});

const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  choices: z.array(choiceSchema).min(2, "At least two choices are required"),
});

const formSchema = z.object({
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});

export const QuestionIdPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questions: [{ question: "", choices: [{ text: "" }, { text: "" }] }],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const choiceFieldsArray = questionFields.map((questionField, questionIndex) =>
    useFieldArray({
      control: form.control,
      name: `questions.${questionIndex}.choices`,
    })
  );

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/questions", values);
      toast.success("Questions added successfully");
      router.push("/questions"); // Redirect to the questions list page
    } catch (error) {
      toast.error("Failed to add questions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (<></>)
};

export default QuestionIdPage;
