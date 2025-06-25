import { connectToDatabase } from "../../../../utils/db";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      // Connect to database
      const { db } = await connectToDatabase();

      // Convert string ID to ObjectId
      const userId = new ObjectId(decoded.userId);

      // Check if user exists
      const user = await db.collection("users").findOne({ _id: userId });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      // Get the quiz result ID from the URL
      const { id } = req.query;
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid quiz result ID",
        });
      }

      // Convert the result ID to ObjectId
      const resultId = new ObjectId(id);

      // Fetch the specific quiz result
      const result = await db.collection("quiz_results").findOne({
        _id: resultId,
        userId, // Ensure the result belongs to the authenticated user
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Quiz result not found",
        });
      }

      console.log(
        "Retrieved quiz result from database:",
        JSON.stringify({
          _id: result._id.toString(),
          archetype: result.archetype,
          hasSecondaryArchetypes:
            !!result.secondaryArchetypes &&
            Array.isArray(result.secondaryArchetypes) &&
            result.secondaryArchetypes.length > 0,
          secondaryArchetypesCount: result.secondaryArchetypes
            ? result.secondaryArchetypes.length
            : 0,
          hasAxisBreakdown:
            !!result.axisBreakdown &&
            Array.isArray(result.axisBreakdown) &&
            result.axisBreakdown.length > 0,
          axisBreakdownCount: result.axisBreakdown
            ? result.axisBreakdown.length
            : 0,
        })
      );

      // Transform the result to include string _id for easier frontend handling
      const transformedResult = {
        ...result,
        _id: result._id.toString(),
        userId: result.userId.toString(),
      };

      return res.status(200).json({
        success: true,
        message: "Quiz result retrieved successfully",
        result: transformedResult,
      });
    } catch (error) {
      console.error("Error fetching quiz result:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch quiz result" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      // Connect to database
      const { db } = await connectToDatabase();

      // Convert string ID to ObjectId
      const userId = new ObjectId(decoded.userId);

      // Check if user exists
      const user = await db.collection("users").findOne({ _id: userId });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      // Get the quiz result ID from the URL
      const { id } = req.query;
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid quiz result ID",
        });
      }

      // Convert the result ID to ObjectId
      const resultId = new ObjectId(id);

      // Delete the quiz result if it belongs to the user
      const deleteResult = await db.collection("quiz_results").deleteOne({
        _id: resultId,
        userId,
      });

      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Quiz result not found or not authorized to delete",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Quiz result deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting quiz result:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete quiz result" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
