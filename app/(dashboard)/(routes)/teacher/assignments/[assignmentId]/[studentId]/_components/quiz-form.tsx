"use client";

import React, { useEffect, useState } from "react";
import AsssignmentService from "@/app/admin/services/AsssignmentService";
import ClockDuration from "./clock-duration";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Question {
  id: string;
  content: string;
  options: string[];
  correctOption: number;
}

interface Answer {
  questionId: string;
  answer: number;
}

interface QuizFormProps {
  assignmentId: number;
  studentId: string;
}

const QuizForm = ({ assignmentId, studentId }: QuizFormProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [duration, setDuration] = useState<number>(0); // Duration in minutes
  const [assignmentStatus, setAssignmentStatus] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [teacherComment, setTeacherComment] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const router = useRouter();


  useEffect(() => {
    async function checkAssignmentStatus() {
      try {
        const response = await AsssignmentService.getFinishedAssignment(studentId, assignmentId);
        const status = response.data.status;
        setAssignmentStatus(status);
        if (status === 1) {
          const detail = Array.isArray(response.data.detail) ? response.data.detail : JSON.parse(response.data.detail);
          setAnswers(detail);
          const questions = response.data.questions.map((question: any) => {
            return {
              ...question,
              options: JSON.parse(question.options)
            };
          });
          setQuestions(questions);
          setTeacherComment(response.data.teacherComment || '');
        } else {
          fetchQuestions();
        }
      } catch (error) {
        console.error("Error checking assignment status:", error);
      }
    }

    async function fetchQuestions() {
      try {
        const assignmentResponse = await AsssignmentService.getQuestionsByAssignment(assignmentId);
        const fetchedQuestions: Question[] = assignmentResponse.data.questions;

        const validatedQuestions = fetchedQuestions.map((question) => {
          let options = [];
          if (typeof question.options === "string") {
            try {
              options = JSON.parse(question.options);
            } catch (error) {
              console.error("Error parsing options: ", error);
            }
          } else if (Array.isArray(question.options)) {
            options = question.options;
          }
          return {
            ...question,
            options,
          };
        });

        setQuestions(validatedQuestions);
        setDuration(assignmentResponse.data.duration);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    
    checkAssignmentStatus();
  }, [assignmentId]);

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const correctAnswers = questions.filter((question, index) => selectedOptions[index] === question.correctOption).length;
    const totalQuestions = questions.length;
    const grade = (correctAnswers / totalQuestions) * 100;

    const answers = questions.map((question, index) => ({
      questionId: question.id,
      answer: selectedOptions[index],
    }));

    const dataToSubmit = {
      assignmentId: assignmentId,
      studentId: studentId,
      result: grade,
      detail: JSON.stringify(answers),
      teacherComment: newComment,
    };

    try {
      const response = await AsssignmentService.addAssignmentStudent(dataToSubmit);
      toast.success("You have completed this assignment");
      router.push("/assignments");
      router.refresh();
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  const handleCommentSubmit = async () => {
    try {

      const dataToSubmit = {
        assignmentId: assignmentId,
        teacherComment: newComment
      }

      const response = await AsssignmentService.updateAssignmentStudent(studentId,dataToSubmit)
  
        toast.success("Comment submitted successfully");
        router.refresh();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Error submitting comment");
    }
  };
  

  return (
    <div>
      {assignmentStatus !== 1 && <ClockDuration initialDuration={duration} />}
      <form onSubmit={handleSubmit} className="p-4">
        <h2 className="text-xl font-semibold mb-4">Assignment</h2>
        {questions.map((question, questionIndex) => {
          const userAnswer = answers.find((answer) => answer.questionId === question.id)?.answer;
          const isCorrect = userAnswer !== undefined && userAnswer === question.correctOption;
          return (
            <div key={question.id} className="mb-6 p-4 border rounded">
              <p className="font-medium mb-2">{`${questionIndex + 1}. ${question.content}`}</p>
              <ul className="list-none pl-0">
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex} className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={optionIndex}
                        checked={
                          assignmentStatus === 1
                            ? userAnswer === optionIndex
                            : selectedOptions[questionIndex] === optionIndex
                        }
                        onChange={() => handleOptionChange(questionIndex, optionIndex)}
                        className="form-radio mr-2"
                        disabled={assignmentStatus === 1} // Disable options if assignment is already submitted
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
              {assignmentStatus === 1 && (
                <div>
                  <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                    Your Answer: {question.options[userAnswer || 0]} - {isCorrect ? "Correct" : "Wrong"}
                  </p>
                  {!isCorrect && (
                    <p className="text-blue-600">
                      Correct Answer: {question.options[question.correctOption]}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {assignmentStatus !== 1 && (
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Submit Answers
          </button>
        )}
        {assignmentStatus === 1 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-4">
              Your Grade:{" "}
              {answers && answers.length
                ? (
                    (answers.filter((answer) =>
                      questions.find(
                        (question) =>
                          question.id === answer.questionId &&
                          question.correctOption === answer.answer
                      )
                    ).length /
                      questions.length) *
                    100
                  ).toFixed(2)
                : 0}
              %
            </h3>
            <div className="mt-4 p-4 border rounded bg-gray-100">
              <h4 className="text-lg font-semibold mb-2">Teacher&apos;s Comment:</h4>
              <p>{teacherComment}</p>
            </div>
          </div>
        )}
          <div className="mt-4">
            <label htmlFor="teacherComment" className="block text-sm font-medium text-gray-700">
              Add Comment (For Teacher)
            </label>
            <textarea
              id="teacherComment"
              rows={4}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              type="button"
              onClick={handleCommentSubmit}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Submit Comment
            </button>
          </div>
      </form>
    </div>
  );
};

export default QuizForm;
