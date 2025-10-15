import mongoose from "mongoose";

// Define the IconVote schema for tracking user votes on icon answers
const IconVoteSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "User is required"],
    },
    iconAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IconAnswer",
      required: [true, "Icon answer is required"],
    },
    voteType: {
      type: String,
      required: [true, "Vote type is required"],
      enum: ["upvote", "downvote"],
    },
    // Optional counter evidence when the vote is a downvote
    counterEvidence: {
      title: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
    },
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
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one vote per user per answer
IconVoteSchema.index({ user: 1, iconAnswer: 1 }, { unique: true });
IconVoteSchema.index({ iconAnswer: 1 });
IconVoteSchema.index({ user: 1 });
IconVoteSchema.index({ icon: 1, question: 1 });

export default mongoose.models.IconVote || mongoose.model("IconVote", IconVoteSchema);
