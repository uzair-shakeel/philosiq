const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// MongoDB connection setup
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://uzair:uzair123@ac-gxnmdjp-shard-00-00.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-01.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-02.cpammnv.mongodb.net:27017/Philosiq?ssl=true&replicaSet=atlas-bfokwp-shard-0&authSource=admin&retryWrites=true&w=majority&appName=API";

// Define schemas directly
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const QuestionSchema = new mongoose.Schema(
  {
    axis: {
      type: String,
      required: [true, "Axis is required"],
      enum: [
        "Equality vs. Markets",
        "Democracy vs. Authority",
        "Progress vs. Tradition",
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
      required: [true, "Weight is required"],
      min: 1,
      max: 5,
      default: 1,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Define models
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);

async function seedDatabase() {
  try {
    // Connect to the database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for seeding.");

    // Create admin user if it doesn't exist
    const adminEmail = "admin@philosiq.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = await User.create({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin user created:", admin.email);
    } else {
      console.log("Admin user already exists.");
    }

    // Seed sample questions if there are none
    const questionCount = await Question.countDocuments();

    if (questionCount === 0) {
      const sampleQuestions = [
        {
          axis: "Equality vs. Markets",
          topic: "Wealth Redistribution",
          question:
            "The government should heavily tax the wealthy to fund social programs for the poor.",
          direction: "Left",
          weight: 3,
        },
        {
          axis: "Equality vs. Markets",
          topic: "Economic Freedom",
          question:
            "Free markets are the most efficient way to distribute resources and create prosperity.",
          direction: "Right",
          weight: 3,
        },
        {
          axis: "Democracy vs. Authority",
          topic: "Civil Liberties",
          question:
            "Individual freedom should be prioritized even if it reduces society's security.",
          direction: "Left",
          weight: 2,
        },
        {
          axis: "Democracy vs. Authority",
          topic: "Law Enforcement",
          question:
            "Strong government authority is necessary to maintain order and safety.",
          direction: "Right",
          weight: 2,
        },
        {
          axis: "Progress vs. Tradition",
          topic: "Social Change",
          question:
            "Society should embrace radical change when necessary to address systemic problems.",
          direction: "Left",
          weight: 3,
        },
        {
          axis: "Progress vs. Tradition",
          topic: "Cultural Values",
          question:
            "Traditional values and customs are important for maintaining social stability.",
          direction: "Right",
          weight: 3,
        },
        {
          axis: "Secular vs. Religious",
          topic: "Education",
          question:
            "Public education should be strictly secular and scientific.",
          direction: "Left",
          weight: 2,
        },
        {
          axis: "Secular vs. Religious",
          topic: "Morality",
          question:
            "Religious principles should guide government policies on moral issues.",
          direction: "Right",
          weight: 2,
        },
        {
          axis: "Globalism vs. Nationalism",
          topic: "International Cooperation",
          question:
            "Global challenges require countries to surrender some sovereignty to international institutions.",
          direction: "Left",
          weight: 3,
        },
        {
          axis: "Globalism vs. Nationalism",
          topic: "National Identity",
          question:
            "Preserving national sovereignty and identity should be a top priority.",
          direction: "Right",
          weight: 3,
        },
      ];

      await Question.insertMany(sampleQuestions);
      console.log(`${sampleQuestions.length} sample questions added.`);
    } else {
      console.log(`Database already has ${questionCount} questions.`);
    }

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
