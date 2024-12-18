"use client";

const Score = () => {
  const score = JSON.parse(sessionStorage.getItem("score") || "0");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 px-6 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Score</h1>
        <p className="text-lg text-gray-600 mb-8">
          You scored <span className="font-semibold text-indigo-500">{score}</span> out of 5
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition duration-200"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Score;
