import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Choose Your Role</h1>
      <div className="flex space-x-4">
        <Link href="/instructor/login">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            Instructor
          </button>
        </Link>
        <Link href="/student/start-page">
          <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none">
            Student
          </button>
        </Link>
      </div>
    </div>
  );
}
