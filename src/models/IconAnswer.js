import mongoose from "mongoose";
import "./Icon";
import "./Question";

// Define the IconAnswer schema for answers given by/for icons
const IconAnswerSchema = new mongoose.Schema(
  {
    icon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Icon",
      required: [true, "Icon is required"],
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      enum: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
    },
    // Numerical value for calculations (-2 to 2)
    answerValue: {
      type: Number,
      required: [true, "Answer value is required"],
      min: -2,
      max: 2,
    },
    // Sources to back up the answer
    sources: [{
      title: {
        type: String,
        required: true,
        trim: true,
      },
      url: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      type: {
        type: String,
        enum: ["article", "book", "speech", "interview", "video", "document", "other"],
        default: "article",
      },
    }],
    // Additional context or reasoning
    reasoning: {
      type: String,
      trim: true,
    },
    submittedBy: {
      type: String,
      required: [true, "Submitter is required"],
    },
    submittedByUsername: {
      type: String,
      trim: true,
    },
    submittedAnonymously: {
      type: Boolean,
      default: false,
    },
    // Voting system
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    netVotes: {
      type: Number,
      default: 0,
    },
    // Whether this is the currently accepted answer for this question
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one accepted answer per question per icon
IconAnswerSchema.index({ icon: 1, question: 1, isAccepted: 1 });
IconAnswerSchema.index({ icon: 1, question: 1 });
IconAnswerSchema.index({ submittedBy: 1 });
IconAnswerSchema.index({ netVotes: -1 });

// Pre-save middleware to calculate net votes
IconAnswerSchema.pre('save', function(next) {
  this.netVotes = this.upvotes - this.downvotes;
  next();
});

export default mongoose.models.IconAnswer || mongoose.model("IconAnswer", IconAnswerSchema);
