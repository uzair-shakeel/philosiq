import connectToDatabase from "../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Connect to the database
    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    // Get all query parameters except special ones
    const { category, ...filters } = req.query;

    // Build match conditions for multiple filters
    const matchConditions = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        matchConditions[`demographics.${key}`] = value;
      }
    });

    // If no filters or category is "all", show all data
    const showAllData =
      Object.keys(matchConditions).length === 0 || category === "all";

    let aggregationPipeline = [];

    // Add match stage only if we have filters
    if (!showAllData) {
      aggregationPipeline.push({
        $match: matchConditions,
      });
    }

    // Group by archetype and calculate counts
    aggregationPipeline.push(
      {
        $group: {
          _id: "$archetype",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      }
    );

    const archetypeDistribution = await mindmapCollection
      .aggregate(aggregationPipeline)
      .toArray();

    // Calculate total entries for the current filters
    const totalFilteredEntries = showAllData
      ? await mindmapCollection.countDocuments({})
      : await mindmapCollection.countDocuments(matchConditions);

    // Get total entries in the collection
    const totalEntries = await mindmapCollection.countDocuments({});

    if (totalEntries === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No MindMap data available yet. Please contribute data by taking the quiz.",
      });
    }

    // Convert counts to percentages
    const archetypePercentages = {};
    archetypeDistribution.forEach((item) => {
      if (item._id) {
        archetypePercentages[item._id] = +(
          (item.count / totalFilteredEntries) *
          100
        ).toFixed(1);
      }
    });

    // Calculate axis distribution for the filtered data
    let axisDistribution = {};

    // List of axes to aggregate
    const axes = [
      "Equity vs. Free Market",
      "Libertarian vs. Authoritarian",
      "Progressive vs. Conservative",
      "Secular vs. Religious",
      "Globalism vs. Nationalism",
    ];

    // For each axis, calculate distribution based on current filters
    for (const axis of axes) {
      const axisPipeline = [
        // Apply the same filters if any
        ...(showAllData ? [] : [{ $match: matchConditions }]),
        {
          $project: {
            axisScore: `$axisScores.${axis.replace(/ /g, "_")}`,
          },
        },
        {
          $match: {
            axisScore: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $lt: ["$axisScore", 50] },
                then: "left",
                else: "right",
              },
            },
            count: { $sum: 1 },
          },
        },
      ];

      const axisResults = await mindmapCollection
        .aggregate(axisPipeline)
        .toArray();

      const axisTotal = axisResults.reduce((sum, item) => sum + item.count, 0);

      if (axisTotal > 0) {
        const leftCount =
          axisResults.find((item) => item._id === "left")?.count || 0;
        const rightCount =
          axisResults.find((item) => item._id === "right")?.count || 0;

        axisDistribution[axis] = {
          left: ((leftCount / axisTotal) * 100).toFixed(2),
          right: ((rightCount / axisTotal) * 100).toFixed(2),
        };
      } else {
        axisDistribution[axis] = {
          left: "50.00",
          right: "50.00",
        };
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        archetypePercentages,
        axisDistribution,
        contributionCount: totalFilteredEntries,
        totalContributions: totalEntries,
      },
    });
  } catch (error) {
    console.error("Error in MindMap API:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch MindMap data",
      error: error.message,
    });
  }
}
