import mongoose from "mongoose";

// Define the Icon schema for famous people profiles
const IconSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    wikipediaTitle: {
      type: String,
      required: [true, "Wikipedia title is required"],
      unique: true,
      trim: true,
    },
    wikipediaPageId: {
      type: Number,
      required: [true, "Wikipedia page ID is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      required: [true, "Occupation is required"],
      trim: true,
    },
    birthDate: {
      type: String,
    },
    deathDate: {
      type: String,
    },
    nationality: {
      type: String,
    },
    // Character type classification
    characterType: {
      type: String,
      enum: ["real", "fictional"],
      default: "real",
    },
    isFictional: {
      type: Boolean,
      default: false,
    },
    // Source media for fictional characters
    sourceMedia: {
      type: String,
      trim: true,
    },
    // Political compass scores (calculated from answers)
    scores: {
      equityVsFreeMarket: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
      libertarianVsAuthoritarian: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
      progressiveVsConservative: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
      secularVsReligious: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
      globalismVsNationalism: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
    },
    createdBy: {
      type: String,
      required: [true, "Creator is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalAnswers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
IconSchema.index({ name: "text", description: "text", occupation: "text" });
IconSchema.index({ wikipediaPageId: 1 });
IconSchema.index({ createdBy: 1 });

export default mongoose.models.Icon || mongoose.model("Icon", IconSchema);
