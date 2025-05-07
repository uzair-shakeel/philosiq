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

    // Get the filter category from the query
    const { category, value } = req.query;

    // Validate parameters
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required",
      });
    }

    // Handle the special "all" category which doesn't filter by demographics
    if (category === "all") {
      // For "all" category, just count all archetypes without demographic filtering
      const aggregationPipeline = [
        {
          $group: {
            _id: "$archetype",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ];

      const archetypeDistribution = await mindmapCollection
        .aggregate(aggregationPipeline)
        .toArray();

      const totalEntries = await mindmapCollection.countDocuments({});

      if (totalEntries === 0) {
        return res.status(404).json({
          success: false,
          message:
            "No MindMap data available yet. Please contribute data by taking the quiz.",
        });
      }

      // Convert counts to percentages for all archetypes
      const archetypePercentages = {};
      archetypeDistribution.forEach((item) => {
        if (item._id) {
          // Make sure archetype is valid
          archetypePercentages[item._id] = +(
            (item.count / totalEntries) *
            100
          ).toFixed(1);
        }
      });

      // Calculate global axis distribution
      let axisDistribution = {};

      // List of axes to aggregate
      const axes = [
        "Equity vs. Free Market",
        "Libertarian vs. Authoritarian",
        "Progressive vs. Conservative",
        "Secular vs. Religious",
        "Globalism vs. Nationalism",
      ];

      // For each axis, calculate global left/right distribution
      for (const axis of axes) {
        const axisPipeline = [
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

        const axisTotal = axisResults.reduce(
          (sum, item) => sum + item.count,
          0
        );

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
          availableOptions: [], // No options for "all"
          contributionCount: totalEntries,
          totalContributions: totalEntries,
        },
      });
    }

    // Map category parameter to the actual field in the database
    const categoryField = `demographics.${category}`;

    let aggregationPipeline = [];

    if (value) {
      // Filter by specific demographic value (e.g., education=High School)
      aggregationPipeline.push({
        $match: { [categoryField]: value },
      });
    }

    // Group by archetype and calculate the counts
    aggregationPipeline.push({
      $group: {
        _id: "$archetype",
        count: { $sum: 1 },
      },
    });

    // Sort by count in descending order
    aggregationPipeline.push({
      $sort: { count: -1 },
    });

    // Execute aggregation
    const archetypeDistribution = await mindmapCollection
      .aggregate(aggregationPipeline)
      .toArray();

    // Calculate total records for this filter
    let totalCount;
    if (value) {
      totalCount = await mindmapCollection.countDocuments({
        [categoryField]: value,
      });
    } else {
      // Count all entries that have this category field defined
      totalCount = await mindmapCollection.countDocuments({
        [categoryField]: { $exists: true },
      });
    }

    // Convert counts to percentages
    const archetypePercentages = {};
    archetypeDistribution.forEach((item) => {
      archetypePercentages[item._id] = +(
        (item.count / totalCount) *
        100
      ).toFixed(1);
    });

    // Get axis distribution data
    let axisDistribution = {};

    // List of axes to aggregate
    const axes = [
      "Equity vs. Free Market",
      "Libertarian vs. Authoritarian",
      "Progressive vs. Conservative",
      "Secular vs. Religious",
      "Globalism vs. Nationalism",
    ];

    // For each axis, calculate the left/right distribution
    for (const axis of axes) {
      // Pipeline for this specific axis
      let axisPipeline = [];

      if (value) {
        // Filter by demographic value if provided
        axisPipeline.push({
          $match: { [categoryField]: value },
        });
      }

      // Flatten the axisScores to work with
      axisPipeline.push({
        $project: {
          axisScore: `$axisScores.${axis.replace(/ /g, "_")}`,
        },
      });

      // Remove entries without scores for this axis
      axisPipeline.push({
        $match: {
          axisScore: { $exists: true, $ne: null },
        },
      });

      // Count entries in left vs right categories
      axisPipeline.push({
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
      });

      // Execute axis aggregation
      const axisResults = await mindmapCollection
        .aggregate(axisPipeline)
        .toArray();

      // Calculate total for this axis
      const axisTotal = axisResults.reduce((sum, item) => sum + item.count, 0);

      // Format the results
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
        // Default to 50/50 if no data
        axisDistribution[axis] = {
          left: "50.00",
          right: "50.00",
        };
      }
    }

    // Get available values for the requested category
    const availableOptions = await mindmapCollection.distinct(categoryField);

    // Check if we have any data in the mindmap collection
    const totalEntries = await mindmapCollection.countDocuments({});

    if (totalEntries === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No MindMap data available yet. Please contribute data by taking the quiz.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        archetypePercentages,
        axisDistribution,
        availableOptions: availableOptions.filter(Boolean).sort(), // Remove empty values and sort
        contributionCount: totalCount,
        totalContributions: totalEntries, // Add total count regardless of filter
      },
    });
  } catch (error) {
    console.error("Error fetching mindmap data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mindmap data",
    });
  }
}
