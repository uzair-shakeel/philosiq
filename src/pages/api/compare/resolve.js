import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { code } = req.query;
    if (!code || typeof code !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Code is required" });
    }

    const { db } = await connectToDatabase();

    const record = await db.collection("compare_codes").findOne({ code });
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Code not found" });
    }

    const result = await db
      .collection("quiz_results")
      .findOne({ _id: record.resultId });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Result not found" });
    }

    const transformed = {
      _id: result._id.toString(),
      userId: result.userId.toString(),
      archetype: result.archetype,
      axisBreakdown: result.axisBreakdown,
      answerBreakdown: result.answerBreakdown || [],
      createdAt: result.createdAt,
      quizType: result.quizType,
    };

    return res.status(200).json({ success: true, result: transformed });
  } catch (error) {
    console.error("Error resolving compare code:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to resolve code" });
  }
}
