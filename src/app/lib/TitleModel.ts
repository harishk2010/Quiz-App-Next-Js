import mongoose, { Schema, Document } from "mongoose";

// Interface to define the structure of a quiz title document
export interface IQuizTitle extends Document {
  title: string;
  description?: string;
  created_at: Date;
}

// Define the QuizTitle Schema
const QuizTitleSchema = new Schema<IQuizTitle>({
  title: { type: String, required: true, unique: true }, // Title of the quiz
  description: { type: String, required: false }, // Optional description of the quiz
  created_at: { type: Date, default: Date.now }, // Timestamp when the quiz was created
});

// Create the Mongoose model
const QuizTitleModel = mongoose.model<IQuizTitle>("QuizTitle", QuizTitleSchema);

export default QuizTitleModel;
