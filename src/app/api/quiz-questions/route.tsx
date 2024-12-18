import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    console.log(title);
    
    if (!title) {
      return NextResponse.json({ error: "Quiz title is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Use find to get all documents matching the quizTitle
    const quizzes = await db.collection('quiz').find({ quizTitle: title }).toArray();

    if (quizzes.length === 0) {
      return NextResponse.json({ error: "No quizzes found for this title" }, { status: 404 });
    }

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
