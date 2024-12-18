"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Quiz = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("questions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      router.push("/");
    }

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handleAnswerSelect = (selectedAnswer: string) => {
    if (answered) return;

    const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;
    if (isCorrect) setScore(score + 1);
    setUserAnswers([...userAnswers, selectedAnswer]);
    setAnswered(true);
    setCorrectAnswer(questions[currentQuestionIndex].answer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setCorrectAnswer("");
    } else {
      sessionStorage.setItem("score", JSON.stringify(score));
      router.push("/student/score-page");
    }
  };

  if (!questions.length) return <div>Loading...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 px-6 py-12">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {currentQuestion.question}
        </h1>
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option: string, index: number) => {
            let buttonClasses =
              "w-full px-6 py-4 text-lg font-medium rounded-lg shadow-md transition duration-200";

            if (answered) {
              if (option === correctAnswer) {
                buttonClasses += " bg-green-500 text-white"; // Correct Answer
              } else if (
                userAnswers.includes(option) &&
                option !== correctAnswer
              ) {
                buttonClasses += " bg-red-500 text-white"; // Wrong Answer
              } else {
                buttonClasses += " bg-gray-300 text-gray-800"; // Neutral
              }
            } else {
              buttonClasses +=
                " bg-blue-500 text-white hover:bg-blue-600"; // Default
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={buttonClasses}
                disabled={answered}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleNextQuestion}
            disabled={!answered}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              answered
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-gray-400 cursor-not-allowed"
            } transition duration-200`}
          >
            {currentQuestionIndex + 1 < questions.length ? "Next" : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
