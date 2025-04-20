const mongoose = require("mongoose");

// MongoDB connection setup
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://uzair:uzair123@ac-gxnmdjp-shard-00-00.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-01.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-02.cpammnv.mongodb.net:27017/Philosiq?ssl=true&replicaSet=atlas-bfokwp-shard-0&authSource=admin&retryWrites=true&w=majority&appName=API";

// Define Question schema directly (same as in seed-cjs.js)
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
      min: 1,
      max: 5,
      default: 1,
    },
    weight_disagree: {
      type: Number,
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

// Define Question model
const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);

async function migrateAxesNames() {
  try {
    // Connect to the database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for axis name migration.");

    // Define mappings for old to new axis names
    const axisNameMappings = {
      "Equality vs. Markets": "Equity vs. Free Market",
      "Democracy vs. Authority": "Libertarian vs. Authoritarian",
      "Progress vs. Tradition": "Progressive vs. Conservative",
    };

    // Update counts for tracking progress
    let totalUpdated = 0;

    // Update questions with old axis names
    for (const [oldName, newName] of Object.entries(axisNameMappings)) {
      const result = await Question.updateMany(
        { axis: oldName },
        { $set: { axis: newName } }
      );

      console.log(
        `Updated ${result.modifiedCount} questions from "${oldName}" to "${newName}"`
      );
      totalUpdated += result.modifiedCount;
    }

    console.log(
      `Migration completed. Total questions updated: ${totalUpdated}`
    );
  } catch (error) {
    console.error("Error during axis name migration:", error);
  } finally {
    process.exit(0);
  }
}

// Run the migration function
migrateAxesNames();
