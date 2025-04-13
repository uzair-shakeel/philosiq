import mongoose from "mongoose";

const ShortQuizConfigSchema = new mongoose.Schema(
  {
    totalQuestions: {
      type: Number,
      required: [true, "Total questions is required"],
      min: [5, "Minimum 5 questions required"],
      max: [100, "Maximum 100 questions allowed"],
      default: 36,
    },
    questionsPerAxis: [
      {
        axis: String,
        count: Number,
      },
    ],
    selectedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Use existing model or create new one to prevent model overwrite error
export default mongoose.models.ShortQuizConfig ||
  mongoose.model("ShortQuizConfig", ShortQuizConfigSchema);
