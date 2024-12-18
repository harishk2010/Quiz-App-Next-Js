"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Start() {
  const [quizTitles, setQuizTitles] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizTitles = async () => {
      try {
        const res = await fetch("/api/quiz-titles");

        if (!res.ok) {
          throw new Error(`Failed to fetch quiz titles: ${res.status}`);
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setQuizTitles(data); // Store the quiz titles in state
        } else {
          throw new Error("Expected an array of quiz titles");
        }
      } catch (error) {
        console.error("Error fetching quiz titles:", error);
        setError(error instanceof Error ? error : new Error("Unknown error"));
      }
    };

    fetchQuizTitles();
  }, []);

  const handleQuizClick = async (title: string) => {
    try {
      const res = await fetch("/api/quiz-questions", {
        method: "POST",
        body: JSON.stringify({ title }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch questions for ${title}`);
      }

      const data = await res.json();
      // Save questions in sessionStorage and redirect
      sessionStorage.setItem("questions", JSON.stringify(data));
      router.push("/student/questions-page");
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-semibold mb-10">Select a Quiz</h1>
      {quizTitles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {quizTitles.map((title, index) => (
            <button
              key={index}
              onClick={() => handleQuizClick(title)}
              className="bg-white border border-gray-300 text-gray-800 font-medium py-4 px-6 rounded-lg shadow-sm hover:shadow-md hover:border-gray-400 transition duration-150"
            >
              {title}
            </button>
          ))}
        </div>
      ) : (
        <h2 className="text-lg font-medium bg-gray-200 text-gray-700 py-4 px-6 rounded-lg">
          No quizzes are available at the moment.
        </h2>
      )}
      {error && (
        <p className="mt-6 text-sm text-red-600 bg-red-100 border border-red-300 py-2 px-4 rounded-lg">
          {error.message}
        </p>
      )}
    </div>
  );
}
