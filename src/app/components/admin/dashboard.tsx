"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [quizTitles, setQuizTitles] = useState<string[]>([]);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [showNewTitleInput, setShowNewTitleInput] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("Answer");
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add this state to manage loading status

  // Fetch quiz titles on component mount
  useEffect(() => {
    const fetchQuizTitles = async () => {
      const isAuthenticated = localStorage.getItem("admin-authenticated");
      if (!isAuthenticated) {
        router.push("/instructor/login");
      }
      try {
        const res = await fetch("/api/quiz-titles");

        if (!res.ok) {
          throw new Error(`Failed to fetch quiz titles: ${res.status}`);
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          console.log(data);
          setQuizTitles(data);
        } else {
          throw new Error("Expected an array of quiz titles");
        }
      } catch (error) {
        console.error("Error fetching quiz titles:", error);
        setQuizTitles([]);
      }
    };

    fetchQuizTitles();
  }, []);

  // Add new quiz title
  const addQuizTitle = async () => {
    if (newQuizTitle.trim() === "") {
      alert("Quiz title cannot be empty!");
      return;
    }

    // Send the new quiz title to the server using a POST request
    try {
      const response = await fetch("/api/quiz-titles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newQuizTitle.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to add quiz title");
      }

      const result = await response.json();
      console.log(result);

      // Assuming the server responds with the new quiz title
      setQuizTitles((prev) => [...prev, result.newQuizTitle]);
      setNewQuizTitle("");
      setShowNewTitleInput(false);
      alert("Quiz title added successfully!");
    } catch (err) {
      console.error("Error adding quiz title:", err);
      alert("Error adding quiz title");
    }
  };

  // Handle quiz question submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Trim the values before sending them to the API
    const trimmedQuizTitle = quizTitle.trim();
    const trimmedQuestion = question.trim();
    const trimmedOptions = options.map((option) => option.trim());
    const trimmedAnswer = answer.trim();

    const quizData = {
      quizTitle: trimmedQuizTitle,
      question: trimmedQuestion,
      options: trimmedOptions,
      answer: trimmedAnswer,
    };

    console.log(quizData.options);

    // Basic validation to check if all fields are filled
    if (
      !trimmedQuizTitle ||
      !trimmedQuestion ||
      trimmedOptions.some((option) => option === "") ||
      trimmedOptions.length !== 4 || // Ensure exactly 4 options
      trimmedAnswer === "Answer"
    ) {
      alert("Please fill in all fields correctly, including 4 options.");
      return;
    }

    try {
      // Show loading feedback
      setLoading(true);

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      // Stop loading feedback
      setLoading(false);

      if (res.ok) {
        alert("Quiz added successfully!");
        resetForm();
      } else {
        const errorData = await res.json();
        alert(
          `Failed to add quiz: ${errorData.message || "Please try again."}`
        );
      }
    } catch (error) {
      console.error("Error submitting quiz data:", error);
      setLoading(false); // Stop loading in case of error
      alert("Error submitting quiz data. Please try again.");
    }
  };

  // Reset form state after successful submission
  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("Answer");
  };

  // Handle option changes dynamically
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated");
    router.push("/instructor/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Dashboard</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quiz Titles
        </label>
        <div className="flex items-center gap-2 mb-4">
          <select
            value={quizTitle} // The current state is used as the value for the dropdown
            onChange={(e) => setQuizTitle(e.target.value)} // Update state when selecting an existing title
            className="flex-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500  text-gray-600"
          >
            <option value="" disabled>
              Select a quiz title
            </option>
            {quizTitles.length > 0 ? (
              quizTitles.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))
            ) : (
              <option disabled>No quiz titles available</option>
            )}
          </select>
          <button
            type="button"
            onClick={() => setShowNewTitleInput(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add New Title
          </button>
        </div>

        {showNewTitleInput && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Quiz Title
            </label>
            <input
              type="text"
              placeholder="Enter new quiz title"
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2  focus:ring-blue-500 focus:border-blue-500  text-gray-600"
            />
            <button
              type="button"
              onClick={addQuizTitle}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Save Title
            </button>
          </div>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question
        </label>
        <input
          type="text"
          placeholder="Write the question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500  text-gray-600"
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options
        </label>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="w-full p-2 border rounded-lg mb-2 focus:ring-blue-500 focus:border-blue-500  text-gray-600"
          />
        ))}

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Answer
        </label>
        <select
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500  text-gray-600"
        >
          <option value="Answer" disabled>
            Select the correct answer
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading} // Disable the button when loading
        >
          {loading ? (
            <span className="animate-spin">Submitting...</span> // Add a loading spinner or text
          ) : (
            "Add Quiz"
          )}
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="mt-6 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
