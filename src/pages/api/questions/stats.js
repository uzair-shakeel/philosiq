import connectToDatabase from "../../../lib/mongodb";
import Question from "../../../models/Question";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Connect to the database
  await connectToDatabase();

  const { method } = req;

  // Check user authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (method === "GET") {
    try {
      // Get total question count
      const totalQuestions = await Question.countDocuments();

      // Get counts by axis
      const axisCounts = await Question.aggregate([
        { $group: { _id: "$axis", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      // Get counts by direction
      const directionCounts = await Question.aggregate([
        { $group: { _id: "$direction", count: { $sum: 1 } } },
      ]);

      // Get counts by weight
      const weightCounts = await Question.aggregate([
        { $group: { _id: "$weight", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      // Get top topics
      const topTopics = await Question.aggregate([
        { $group: { _id: "$topic", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      // Get questions created in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentQuestions = await Question.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalQuestions,
          axisCounts,
          directionCounts,
          weightCounts,
          topTopics,
          recentQuestions,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
