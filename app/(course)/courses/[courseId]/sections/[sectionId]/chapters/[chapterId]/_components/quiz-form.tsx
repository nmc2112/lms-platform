"use client"

import { useState } from "react";
import { Question } from "@prisma/client";

interface QuizFormProps {
  questions: Question[];
}

const QuizForm = ({ questions }: QuizFormProps) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>(new Array(questions.length).fill(-1));
  const [feedback, setFeedback] = useState<string[]>(new Array(questions.length).fill(""));

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
  );
};

export default QuizForm;
