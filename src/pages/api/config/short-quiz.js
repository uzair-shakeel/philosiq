import dbConnect from "../../../lib/mongodb";
import ShortQuizConfig from "../../../models/ShortQuizConfig";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

/**
 * API endpoint for getting and updating short quiz configuration
 */
export default async function handler(req, res) {
  try {
    // Get user session for authentication
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated
    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await dbConnect();

    // GET request - retrieve current config
    if (req.method === "GET") {
      try {
        // Find the current config (there should only be one)
        let config = await ShortQuizConfig.findOne();

        // If no config exists yet, create default
        if (!config) {
          config = await ShortQuizConfig.create({
            totalQuestions: 36,
            questionsPerAxis: [],
            selectedQuestions: [],
          });
        }

        return res.status(200).json({
          success: true,
          config,
        });
      } catch (error) {
        console.error("Error retrieving short quiz configuration:", error);
        return res.status(500).json({
          success: false,
          message: "Error retrieving short quiz configuration",
          error: error.message,
        });
      }
    }

    // POST request - update config
    if (req.method === "POST") {
      try {
        // Validate user is admin
        if (session.user.role !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Unauthorized. Admin rights required.",
          });
        }

        // Log request body for debugging
        console.log(
          "Short quiz config update request:",
          JSON.stringify(req.body, null, 2)
        );

        const { totalQuestions, questionsPerAxis, selectedQuestions } =
          req.body;

        // Validate the input data
        if (!Array.isArray(selectedQuestions)) {
          return res.status(400).json({
            success: false,
            message: "selectedQuestions must be an array of question IDs",
          });
        }

        // Validate questionsPerAxis is an array
        if (questionsPerAxis && !Array.isArray(questionsPerAxis)) {
          return res.status(400).json({
            success: false,
            message: "questionsPerAxis must be an array of axis configurations",
          });
        }

        // Update or create config
        const config = await ShortQuizConfig.findOneAndUpdate(
          {}, // Empty filter to get first document
          {
            totalQuestions: totalQuestions || 36,
            questionsPerAxis: questionsPerAxis || [],
            selectedQuestions: selectedQuestions || [],
            lastUpdated: new Date(),
          },
          { upsert: true, new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Short quiz configuration updated",
          config,
        });
      } catch (error) {
        console.error("Error updating short quiz configuration:", error);
        return res.status(500).json({
          success: false,
          message: "Error updating short quiz configuration",
          error: error.message,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
      }
    }

    // Handle unsupported methods
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  } catch (outerError) {
    console.error("Unhandled error in short-quiz API:", outerError);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: outerError.message,
      stack:
        process.env.NODE_ENV === "development" ? outerError.stack : undefined,
    });
  }
}
