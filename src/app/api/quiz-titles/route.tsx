import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';

interface Quiz {
    title: string;
    created_at: Date;
  }

export async function POST(req: Request) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: 'Quiz title is required' }, { status: 400 });
    }

    if (body.title.length < 3) {
      return NextResponse.json({ error: 'Quiz title must be at least 3 characters long' }, { status: 400 });
    }

    const result = await db.collection('QuizTitle').insertOne({
      title: body.title,
      created_at: new Date(),
    });

    if (result.acknowledged) {
      return NextResponse.json({ message: 'Quiz title added successfully', newQuizTitle: body.title }, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add quiz title' }, { status: 500 });
} catch (error) {
    // Check if error is an instance of Error
    if (error instanceof Error) {
      console.error('Error adding quiz title:', error.message);
      return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
    }
    console.error('Unknown error occurred');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
      const { db } = await connectToDatabase();
      const quizTitles = await db.collection('QuizTitle').find().toArray();
  
      if (quizTitles.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
  
      // Return only the titles in the response
      const titles = quizTitles.map((quiz:Quiz) => quiz.title);
      return NextResponse.json(titles, { status: 200 });
    } catch (error) {
      console.error('Error fetching quiz titles:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
