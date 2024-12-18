import mongoose, { Schema, Document } from "mongoose";

// Define the Quiz interface extending mongoose Document to get type safety
interface Quiz extends Document {
  quizTitle: string;
  question: string;
  options: string[];
  answer: string;
}

// Define the schema for the quiz data
const quizSchema = new Schema<Quiz>({
  quizTitle: {
    type: String,
    required: true,
    trim: true, // Trimming leading/trailing whitespace
  },
  question: {
    type: String,
    required: true,
    trim: true, // Trimming leading/trailing whitespace
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (v: string[]) {
        return v.length === 4; // Ensure there are exactly 4 options
      },
      message: "Options must contain exactly 4 values", // Custom error message
    },
  },
  answer: {
    type: String,
    required: true,
    trim: true, // Trimming leading/trailing whitespace
  },
});

// Create the Mongoose model based on the schema
const QuizModel = mongoose.models.Quiz || mongoose.model<Quiz>("Quiz", quizSchema);

export default QuizModel;
