import mongoose from "mongoose";

// Define the Question schema
const QuestionSchema = new mongoose.Schema(
  {
    axis: {
      type: String,
      required: [true, "Axis is required"],
      enum: [
        "Equity vs. Free Market",
        "Libertarian vs. Authoritarian",
        "Progressive vs. Conservative",
        "Secular vs. Religious",
        "Globalism vs. Nationalism",
      ],
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    direction: {
      type: String,
      required: [true, "Direction is required"],
      enum: ["Left", "Right"],
    },
    weight: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    weight_agree: {
      type: Number,
      required: [true, "Weight for agree is required"],
      min: 1,
      max: 5,
      default: 1,
    },
    weight_disagree: {
      type: Number,
      required: [true, "Weight for disagree is required"],
      min: 1,
      max: 5,
      default: 1,
    },
    active: {
      type: Boolean,
      default: true,
    },
    includeInShortQuiz: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Use existing model if available, or create a new one
export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
