import bcrypt from "bcryptjs";
import connectToDatabase from "./index";
import User from "../../models/User";
import Question from "../../models/Question";

async function seedDatabase() {
  try {
    // Connect to the database
    await connectToDatabase();
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
