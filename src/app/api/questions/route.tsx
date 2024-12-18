import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    const quizData = await req.json();

    const { quizTitle, question, options, answer } = quizData;

    // Validate required fields
    if (!quizTitle || !question || !options || !answer) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Validate that options array contains exactly 4 options
    if (options.length !== 4) {
      return NextResponse.json(
        { error: "Options must contain exactly 4 values." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Insert the new quiz into the QuizTitle collection
    const result = await db.collection("quiz").insertOne({
      quizTitle,
      question,
      options,
      answer,
    });

    // If insertion is successful, return the inserted data
    if (result.acknowledged) {
      const insertedQuiz = { quizTitle, question, options, answer, _id: result.insertedId };
      return NextResponse.json(
        { message: "Quiz added successfully", newQuizData: insertedQuiz },
        { status: 201 }
      );
    }

    // If insertion fails, return an error
    return NextResponse.json(
      { error: "Failed to add quiz data" },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error adding quiz data:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Error adding quiz data" },
      { status: 500 }
    );
  }
}
