import mongoose, { Schema, Document } from "mongoose";

// Define the Quiz interface extending mongoose Document to get type safety
interface Quiz extends Document {
  quizTitle: string;
  question: string;
  options: string[];
  answer: string;
}


const quizSchema = new Schema<Quiz>({
  quizTitle: {
    type: String,
    required: true,
    trim: true, 
  },
  question: {
    type: String,
    required: true,
    trim: true, 
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (v: string[]) {
        return v.length === 4; 
      },
      message: "Options must contain exactly 4 values", 
    },
  },
  answer: {
    type: String,
    required: true,
    trim: true, 
  },
});


const QuizModel = mongoose.models.Quiz || mongoose.model<Quiz>("Quiz", quizSchema);

export default QuizModel;
