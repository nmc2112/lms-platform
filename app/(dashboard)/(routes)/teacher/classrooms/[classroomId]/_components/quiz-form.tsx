"use client";

import { useEffect, useState } from "react";
import AsssignmentService from "@/app/admin/services/AsssignmentService";
import ClockDuration from "./clock-duration";

interface Question {
  id: number;
  content: string;
  options: string[];
  correctOption: number;
}

interface QuizFormProps {
  assignmentId: number;
  userId: String
}

const QuizForm = ({ assignmentId, userId }: QuizFormProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [duration, setDuration] = useState<number>(0); // Duration in minutes

  useEffect(() => {
    async function fetchData() {
      try {
        const assignmentResponse = await AsssignmentService.getQuestionsByAssignment(assignmentId);
        console.log("Raw Data: ", assignmentResponse.data);
        const fetchedQuestions: Question[] = assignmentResponse.data.questions;

        // Parse options if they are JSON strings
        const validatedQuestions = fetchedQuestions.map((question) => {
          console.log("Question before validation: ", question);
          let options = [];
          if (typeof question.options === 'string') {
            try {
              options = JSON.parse(question.options);
            } catch (error) {
              console.error("Error parsing options: ", error);
            }
          } else if (Array.isArray(question.options)) {
            options = question.options;
          }
          const validatedQuestion = {
            ...question,
            options,
          };
          console.log("Question after validation: ", validatedQuestion);
          return validatedQuestion;
        });

        setQuestions(validatedQuestions);

        // Ensure duration is set
        const durationInMinutes = assignmentResponse.data.duration;
        setDuration(durationInMinutes);
        console.log("Assignment duration set to:", durationInMinutes);

        console.log("Validated Questions: ", validatedQuestions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [assignmentId]);

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string[]>([]);

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newFeedback = questions.map((question, index) => {
      if (selectedOptions[index] === question.correctOption) {
        return "Correct!";
      } else {
        return "Wrong!";
      }
    });
    setFeedback(newFeedback);

    // Calculate and log the grade
    const correctAnswers = questions.filter((question, index) => selectedOptions[index] === question.correctOption).length;
    const totalQuestions = questions.length;
    const grade = (correctAnswers / totalQuestions) * 100;
    console.log(`Grade: ${grade}%`);

    // Save the assignment data
    try {
      const dataToSubmit = {
        assignmentId: assignmentId,
        studentId: userId, // Replace with the actual student ID
        result: grade,
        detail: "Assignment submitted successfully"
      };
      console.log(dataToSubmit)
      const response = await AsssignmentService.addAssignmentStudent(dataToSubmit);
      console.log("Assignment saved:", response.data);
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  return (
    <div>
      <ClockDuration initialDuration={duration} />
      <form onSubmit={handleSubmit} className="p-4">
        <h2 className="text-xl font-semibold mb-4">Assignment</h2>
        {questions.map((question, questionIndex) => (
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
                      checked={selectedOptions[questionIndex] === optionIndex}
                      onChange={() => handleOptionChange(questionIndex, optionIndex)}
                      className="form-radio mr-2"
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
            {feedback[questionIndex] && (
              <p className={feedback[questionIndex] === "Correct!" ? "text-green-600" : "text-red-600"}>
                {feedback[questionIndex]}
              </p>
            )}
          </div>
        ))}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit Answers
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
