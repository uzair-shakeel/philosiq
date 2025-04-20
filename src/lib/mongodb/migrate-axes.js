import connectToDatabase from "./index";
import Question from "../../models/Question";

async function migrateAxesNames() {
  try {
    // Connect to the database
    await connectToDatabase();
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
