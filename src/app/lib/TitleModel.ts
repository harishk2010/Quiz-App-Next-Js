import mongoose, { Schema, Document } from "mongoose";


export interface IQuizTitle extends Document {
  title: string;
  description?: string;
  created_at: Date;
}


const QuizTitleSchema = new Schema<IQuizTitle>({
  title: { type: String, required: true, unique: true }, 
  description: { type: String, required: false }, 
  created_at: { type: Date, default: Date.now }, 
});


const QuizTitleModel = mongoose.model<IQuizTitle>("QuizTitle", QuizTitleSchema);

export default QuizTitleModel;
