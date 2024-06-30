"use client";

import { useEffect, useState } from "react";
import AsssignmentService from "@/app/admin/services/AsssignmentService";

interface Question {
  id: number;
  content: string;
  options: string[];
  correctOption: number;
}

interface QuizFormProps {
  assignmentId: number;
}

const ClockDuration = ({ initialDuration }: { initialDuration: number }) => {
  const [time, setTime] = useState(initialDuration); // Initialize with the provided duration

  useEffect(() => {
    console.log("ClockDuration initialized with:", initialDuration);
    setTime(initialDuration); // Ensure time is set when initialDuration changes
  }, [initialDuration]);

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000); // Update time every second

      return () => clearInterval(timerId); // Cleanup on unmount
    }
  }, [time]);

  // Helper function to format time
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div>
      <h2>Time Remaining: {formatTime(time)}</h2>
    </div>
  );
};

const QuizForm = ({ assignmentId }: QuizFormProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [duration, setDuration] = useState<number>(0); // Duration in seconds

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
        const durationInSeconds = assignmentResponse.data.duration;
        setDuration(durationInSeconds);
        console.log("Assignment duration set to:", durationInSeconds);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFeedback = questions.map((question, index) => {
      if (selectedOptions[index] === question.correctOption) {
        return "Correct!";
      } else {
        return "Wrong!";
      }
    });
    setFeedback(newFeedback);
  };

  return (
    <div>
      <ClockDuration initialDuration={duration} />
      <form onSubmit={handleSubmit} className="p-4">
        <h2 className="text-xl font-semibold mb-4">Chapter Quiz</h2>
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
