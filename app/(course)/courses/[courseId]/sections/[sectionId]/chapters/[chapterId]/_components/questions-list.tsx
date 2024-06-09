import { Question } from "@prisma/client";

interface QuestionsListProps {
  questions: Question[];
}

const QuestionsList = ({ questions }: QuestionsListProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chapter Questions</h2>
      {questions.map((question, index) => (
        <div key={question.id} className="mb-4 p-4 border rounded">
          <p className="font-medium">{`${index + 1}. ${question.content}`}</p>
          <ul className="list-disc pl-5 mt-2">
            {question.options.map((option, i) => (
              <li key={i} className={i === question.correctOption ? "text-green-600" : ""}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;
