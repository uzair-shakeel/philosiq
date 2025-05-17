import connectToDatabase from "../../../lib/mongodb";
import mongoose from "mongoose";

// Define the axes and their positions in the archetype code
const AXIS_POSITIONS = {
  Economic: { position: 0, letters: ["E", "F"] },
  Authority: { position: 1, letters: ["L", "A"] },
  Social: { position: 2, letters: ["P", "C"] },
  Religious: { position: 3, letters: ["S", "R"] },
  National: { position: 4, letters: ["G", "N"] },
};

// Map archetype names to their codes
const ARCHETYPE_MAP = [
  { code: "ELPSG", label: "The Utopian" },
  { code: "ELPSN", label: "The Reformer" },
  { code: "ELPRG", label: "The Prophet" },
  { code: "ELPRN", label: "The Firebrand" },
  { code: "ELCSG", label: "The Philosopher" },
  { code: "ELCSN", label: "The Localist" },
  { code: "ELCRG", label: "The Missionary" },
  { code: "ELCRN", label: "The Guardian" },
  { code: "EAPSG", label: "The Technocrat" },
  { code: "EAPSN", label: "The Enforcer" },
  { code: "EAPRG", label: "The Zealot" },
  { code: "EAPRN", label: "The Purist" },
  { code: "EACSG", label: "The Commander" },
  { code: "EACSN", label: "The Steward" },
  { code: "EACRG", label: "The Shepherd" },
  { code: "EACRN", label: "The High Priest" },
  { code: "FLPSG", label: "The Futurist" },
  { code: "FLPSN", label: "The Maverick" },
  { code: "FLPRG", label: "The Evangelist" },
  { code: "FLPRN", label: "The Dissenter" },
  { code: "FLCSG", label: "The Globalist" },
  { code: "FLCSN", label: "The Patriot" },
  { code: "FLCRG", label: "The Industrialist" },
  { code: "FLCRN", label: "The Traditionalist" },
  { code: "FAPSG", label: "The Overlord" },
  { code: "FAPSN", label: "The Corporatist" },
  { code: "FAPRG", label: "The Moralizer" },
  { code: "FAPRN", label: "The Builder" },
  { code: "FACSG", label: "The Executive" },
  { code: "FACSN", label: "The Ironhand" },
  { code: "FACRG", label: "The Regent" },
  { code: "FACRN", label: "The Crusader" },
];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    // Get all query parameters except special ones
    const { category, ...filters } = req.query;

    // Build match conditions for multiple filters
    const matchConditions = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        // Handle location-based filters separately
        if (["city", "state", "country"].includes(key)) {
          matchConditions[`demographics.${key}`] = value;
        } else {
          matchConditions[`demographics.${key}`] = value;
        }
      }
    });

    // If no filters or category is "all", show all data
    const showAllData =
      Object.keys(matchConditions).length === 0 || category === "all";

    // Get all entries that match the filters
    const entries = await mindmapCollection
      .find(showAllData ? {} : matchConditions)
      .toArray();

    const totalEntries = entries.length;

    if (totalEntries === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No MindMap data available yet. Please contribute data by taking the quiz.",
      });
    }

    // Initialize counters for each axis letter
    const axisLetterCounts = {
      Economic: { E: 0, F: 0 },
      Authority: { L: 0, A: 0 },
      Social: { P: 0, C: 0 },
      Religious: { S: 0, R: 0 },
      National: { G: 0, N: 0 },
    };

    // Count archetype occurrences
    const archetypeCounts = {};

    // Process each entry
    entries.forEach((entry) => {
      const archetype = entry.archetype;

      // Count archetype occurrences
      archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;

      // Find the archetype code
      const archetypeInfo = ARCHETYPE_MAP.find((a) => a.label === archetype);
      if (archetypeInfo) {
        const code = archetypeInfo.code;

        // Count letters for each axis
        axisLetterCounts.Economic[code[0]]++;
        axisLetterCounts.Authority[code[1]]++;
        axisLetterCounts.Social[code[2]]++;
        axisLetterCounts.Religious[code[3]]++;
        axisLetterCounts.National[code[4]]++;
      }
    });

    // Calculate archetype percentages
    const archetypePercentages = {};
    Object.entries(archetypeCounts).forEach(([archetype, count]) => {
      archetypePercentages[archetype] = +((count / totalEntries) * 100).toFixed(
        1
      );
    });

    // Calculate axis distribution percentages
    const axisDistribution = {
      Economic: {
        E: ((axisLetterCounts.Economic.E / totalEntries) * 100).toFixed(1),
        F: ((axisLetterCounts.Economic.F / totalEntries) * 100).toFixed(1),
      },
      Authority: {
        L: ((axisLetterCounts.Authority.L / totalEntries) * 100).toFixed(1),
        A: ((axisLetterCounts.Authority.A / totalEntries) * 100).toFixed(1),
      },
      Social: {
        P: ((axisLetterCounts.Social.P / totalEntries) * 100).toFixed(1),
        C: ((axisLetterCounts.Social.C / totalEntries) * 100).toFixed(1),
      },
      Religious: {
        S: ((axisLetterCounts.Religious.S / totalEntries) * 100).toFixed(1),
        R: ((axisLetterCounts.Religious.R / totalEntries) * 100).toFixed(1),
      },
      National: {
        G: ((axisLetterCounts.National.G / totalEntries) * 100).toFixed(1),
        N: ((axisLetterCounts.National.N / totalEntries) * 100).toFixed(1),
      },
    };

    // Collect available location options for filters
    const availableLocations = {
      cities: [
        ...new Set(
          entries.map((entry) => entry.demographics?.city).filter(Boolean)
        ),
      ],
      states: [
        ...new Set(
          entries.map((entry) => entry.demographics?.state).filter(Boolean)
        ),
      ],
      countries: [
        ...new Set(
          entries.map((entry) => entry.demographics?.country).filter(Boolean)
        ),
      ],
    };

    console.log("Letter counts:", axisLetterCounts);
    console.log("Axis distribution calculated:", axisDistribution);

    return res.status(200).json({
      success: true,
      data: {
        archetypePercentages,
        axisDistribution,
        contributionCount: totalEntries,
        totalContributions: totalEntries,
        availableLocations,
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
