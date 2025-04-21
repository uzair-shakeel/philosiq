/**
 * resultsCalculator.js
 * Contains all logic for calculating political compass scores based on quiz answers
 */

// Answer value mapping - Updated to match the values in quiz.jsx
const ANSWER_VALUES = {
  "-2": -1, // Strongly Disagree
  "-1": -0.5, // Disagree
  0: 0, // Neutral
  1: 0.5, // Agree
  2: 1, // Strongly Agree
};

// Define axis name aliases to handle different naming conventions
const AXIS_ALIASES = {
  "Equality vs. Markets": "Equity vs. Free Market",
};

// Axis configuration
const AXIS_CONFIG = {
  "Equity vs. Free Market": {
    maxScore: 61,
    minScore: -61,
    leftLabel: "Equity",
    rightLabel: "Free Market",
  },
  "Libertarian vs. Authoritarian": {
    maxScore: 101,
    minScore: -101,
    leftLabel: "Libertarian",
    rightLabel: "Authoritarian",
  },
  "Progressive vs. Conservative": {
    maxScore: 103,
    minScore: -103,
    leftLabel: "Progressive",
    rightLabel: "Conservative",
  },
  "Secular vs. Religious": {
    maxScore: 72,
    minScore: -72,
    leftLabel: "Secular",
    rightLabel: "Religious",
  },
  "Globalism vs. Nationalism": {
    maxScore: 86,
    minScore: -86,
    leftLabel: "Globalism",
    rightLabel: "Nationalism",
  },
};

// Archetype mapping for all possible combinations
const ARCHETYPE_MAP = {
  ELPSG: "The Utopian",
  ELPSN: "The Reformer",
  ELPRG: "The Prophet",
  ELPRN: "The Firebrand",
  ELCSG: "The Philosopher",
  ELCSN: "The Localist",
  ELCRG: "The Missionary",
  ELCRN: "The Guardian",
  EAPSG: "The Technocrat",
  EAPSN: "The Enforcer",
  EAPRG: "The Zealot",
  EAPRN: "The Purist",
  EACSG: "The Commander",
  EACSN: "The Steward",
  EACRG: "The Shepherd",
  EACRN: "The High Priest",
  FLPSG: "The Futurist",
  FLPSN: "The Maverick",
  FLPRG: "The Evangelist",
  FLPRN: "The Dissident",
  FLCSG: "The Globalist",
  FLCSN: "The Patriot",
  FLCRG: "The Traditionalist",
  FLCRN: "The Traditionalist",
  FAPSG: "The Overlord",
  FAPSN: "The Corporatist",
  FAPRG: "The Moralizer",
  FAPRN: "The Builder",
  FACSG: "The Executive",
  FACSN: "The Iconoclast",
  FACRG: "The Traditionalist",
  FACRN: "The Crusader",
};

/**
 * Calculate the weighted score for a single answer
 *
 * @param {number} answerValue - The numeric value of the selected answer (-2 to 2)
 * @param {number} agreeWeight - Weight to apply if answer is positive
 * @param {number} disagreeWeight - Weight to apply if answer is negative
 * @param {string} questionDirection - Whether this question is aligned with "Left" or "Right" side
 * @returns {number} - The calculated weighted score
 */
function calculateAnswerScore(
  answerValue,
  agreeWeight,
  disagreeWeight,
  questionDirection
) {
  // Get the base value for this answer
  const baseValue = ANSWER_VALUES[answerValue.toString()];

  if (baseValue === undefined) {
    console.error("Invalid answer value:", answerValue);
    return 0;
  }

  // Determine which weight to apply
  let appliedWeight;
  if (baseValue > 0) {
    // For positive answers (agree/strongly agree), use agree weight
    appliedWeight = agreeWeight;
  } else if (baseValue < 0) {
    // For negative answers (disagree/strongly disagree), use disagree weight
    appliedWeight = disagreeWeight;
  } else {
    // For neutral answers, no weight applies
    return 0;
  }

  // Calculate the weighted score
  let weightedScore = baseValue * appliedWeight;

  // FIXED: Left direction should be negative, Right direction should be positive
  // If question is aligned with Left, multiply by -1 (this makes Left negative)
  if (questionDirection === "Left") {
    weightedScore *= -1;
  }
  // Right-aligned questions stay positive

  return weightedScore;
}

/**
 * Calculate axis scores based on a set of questions and answers
 *
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - Object mapping question IDs to answer values
 * @returns {Object} - Object containing raw scores and normalized scores (0-100) for each axis
 */
function calculateAxisScores(questions, answers) {
  // Initialize scores and weights for each axis
  const rawScores = {}; // A - Total score
  const disagreeWeights = {}; // B - Sum of disagree weights
  const agreeWeights = {}; // C - Sum of agree weights

  Object.keys(AXIS_CONFIG).forEach((axis) => {
    rawScores[axis] = 0;
    disagreeWeights[axis] = 0;
    agreeWeights[axis] = 0;
  });

  // Calculate raw scores and collect weights
  questions.forEach((question) => {
    const answer = answers[question._id];

    // Skip if question wasn't answered
    if (answer === undefined) return;

    // Handle axis aliases - map alternative axis names to the canonical name
    const canonicalAxis = AXIS_ALIASES[question.axis] || question.axis;

    // Skip if axis is not defined in our configuration
    if (!AXIS_CONFIG[canonicalAxis]) {
      console.warn(`Unknown axis: ${question.axis} (${canonicalAxis})`);
      return;
    }

    // Get weights for this question
    const agreeWeight = question.weight_agree || question.weight || 1;
    const disagreeWeight = question.weight_disagree || question.weight || 1;

    // Add the weights to our totals
    agreeWeights[canonicalAxis] += agreeWeight;
    disagreeWeights[canonicalAxis] += disagreeWeight;

    // Add the weighted score to the corresponding axis
    const weightedScore = calculateAnswerScore(
      answer,
      agreeWeight,
      disagreeWeight,
      question.direction
    );

    // Add to the axis total
    rawScores[canonicalAxis] = (rawScores[canonicalAxis] || 0) + weightedScore;
  });

  // Calculate raw normalized scores (-100 to 100 scale)
  const rawNormalizedScores = {};

  // Normalize scores to 0-100 scale for display
  const normalizedScores = {};

  Object.keys(rawScores).forEach((axis) => {
    const config = AXIS_CONFIG[axis];
    if (!config) return;

    // Get values for formula components
    const A = rawScores[axis] || 0; // User's raw score
    const B = disagreeWeights[axis] || 0; // Sum of disagree weights
    const C = agreeWeights[axis] || 0; // Sum of agree weights
    const maxScore = config.maxScore || 100; // Get max score from config

    // Apply the formula: (A-B)/(B+C) to get a value between -1 and 1
    // Then multiply by 100 to get percentage between -100% and 100%
    // Handle division by zero by defaulting to 0
    const denominator = B + C;
    let normalizedRaw = denominator === 0 ? 0 : ((A - B) / denominator) * 100;

    // Ensure the score is a finite number between -100 and 100
    normalizedRaw = isFinite(normalizedRaw)
      ? Math.max(-100, Math.min(100, normalizedRaw))
      : 0;

    // Store raw normalized score (-100 to 100)
    rawNormalizedScores[axis] = normalizedRaw;

    // NEW FORMULA: Convert to 0-100 scale using (User Score + Max Score) / (Max Score * 2) * 100
    const displayScore = ((A + maxScore) / (maxScore * 2)) * 100;

    // Round to whole number
    normalizedScores[axis] = Math.round(displayScore);
  });

  // Return all the values for debugging
  return {
    rawScores, // A
    disagreeWeights, // B
    agreeWeights, // C
    rawNormalizedScores, // -100 to 100 scale (actual values)
    normalizedScores, // 0-100 scale for display
  };
}

/**
 * Determines the user's position (left or right) on each axis
 *
 * @param {Object} normalizedScores - Object containing normalized scores for each axis (0-100)
 * @param {Object} rawNormalizedScores - Object containing raw normalized scores (-100 to 100)
 * @returns {Object} - Object containing position labels for each axis
 */
function determineAxisPositions(normalizedScores, rawNormalizedScores = {}) {
  console.log("normalizedScores", normalizedScores);
  console.log("rawNormalizedScores", rawNormalizedScores);
  const positions = {};

  Object.keys(normalizedScores).forEach((axis) => {
    // Handle aliases to ensure consistent axis naming
    const canonicalAxis = AXIS_ALIASES[axis] || axis;
    const config = AXIS_CONFIG[canonicalAxis];

    if (!config) {
      console.warn(
        `No config found for axis: ${axis} (canonical: ${canonicalAxis})`
      );
      return;
    }

    // FIXED: Completely flip the logic for position determination
    // Now negative raw scores (left side on graph) map to RIGHT side positions
    // and positive raw scores (right side on graph) map to LEFT side positions
    const rawScore = rawNormalizedScores[axis];
    const displayScore = normalizedScores[axis];

    if (rawScore !== undefined) {
      // If raw score is exactly 0, it's perfectly centered
      if (rawScore === 0) {
        positions[axis] = "Centered";
      } else if (rawScore < 0) {
        // Negative raw score = RIGHT label instead of LEFT
        positions[axis] = config.rightLabel;
      } else {
        // Positive raw score = LEFT label instead of RIGHT
        positions[axis] = config.leftLabel;
      }
    } else {
      // Fallback to using normalized scores if raw not available
      if (displayScore === 50) {
        positions[axis] = "Centered";
      } else if (displayScore < 50) {
        // Value < 50 = RIGHT label
        positions[axis] = config.rightLabel;
      } else {
        // Value > 50 = LEFT label
        positions[axis] = config.leftLabel;
      }
    }
  });

  return positions;
}

/**
 * Calculate the strength of each position (weak, moderate, strong)
 *
 * @param {Object} normalizedScores - Object containing normalized scores for each axis (0-100)
 * @param {Object} rawNormalizedScores - Object containing raw normalized scores (-100 to 100)
 * @returns {Object} - Object containing strength labels for each axis
 */
function determinePositionStrengths(
  normalizedScores,
  rawNormalizedScores = {}
) {
  const strengths = {};

  Object.keys(normalizedScores).forEach((axis) => {
    // Handle aliases for consistent axis naming
    const canonicalAxis = AXIS_ALIASES[axis] || axis;

    // FIXED: Use raw score if available to determine strength
    // This aligns with the visual representation
    const rawScore = rawNormalizedScores[axis];
    const displayScore = normalizedScores[axis];

    if (rawScore !== undefined) {
      // Calculate absolute distance from center on -100 to 100 scale
      const absRawDistance = Math.abs(rawScore);

      // Determine strength based on absolute distance from 0
      // For -100 to 100 scale:
      // 0-30 = Weak
      // 30-70 = Moderate
      // 70-100 = Strong
      if (absRawDistance < 30) {
        strengths[axis] = "Weak";
      } else if (absRawDistance < 70) {
        strengths[axis] = "Moderate";
      } else {
        strengths[axis] = "Strong";
      }
    } else {
      // Fallback to using normalized scores if raw not available
      // Calculate distance from center (50 on the 0-100 scale)
      const distanceFromCenter = Math.abs(displayScore - 50);

      // For 0-100 scale:
      // 0-15 from center (35-65) = Weak
      // 15-35 from center (15-35 or 65-85) = Moderate
      // 35+ from center (0-15 or 85-100) = Strong
      if (distanceFromCenter < 15) {
        strengths[axis] = "Weak";
      } else if (distanceFromCenter < 35) {
        strengths[axis] = "Moderate";
      } else {
        strengths[axis] = "Strong";
      }
    }
  });

  return strengths;
}

/**
 * Determines the letter code for each axis based on the user's score
 *
 * @param {string} axis - The name of the axis
 * @param {number} score - The user's score on this axis (0-100 scale)
 * @param {number} rawScore - The user's raw score on this axis (-100 to 100 scale) - optional
 * @returns {string} - A single-letter code representing the user's position
 */
function determineAxisLetter(axis, score, rawScore) {
  // Handle aliases to ensure consistent axis naming
  const canonicalAxis = AXIS_ALIASES[axis] || axis;

  // FIXED: Completely reversed the logic
  // Now negative raw scores (left side on graph) map to RIGHT side letters
  // and positive raw scores (right side on graph) map to LEFT side letters
  // This aligns with the visual display in AxisGraph
  const isRightSide = rawScore !== undefined ? rawScore < 0 : score < 50;

  // Use the raw score to determine if we're on right or left side
  if (isRightSide) {
    switch (canonicalAxis) {
      case "Equity vs. Free Market":
        return "F"; // Free Market
      case "Libertarian vs. Authoritarian":
        return "A"; // Authoritarian
      case "Progressive vs. Conservative":
        return "C"; // Conservative
      case "Secular vs. Religious":
        return "R"; // Religious
      case "Globalism vs. Nationalism":
        return "N"; // Nationalism
      default:
        return "?";
    }
  } else {
    switch (canonicalAxis) {
      case "Equity vs. Free Market":
        return "E"; // Equity
      case "Libertarian vs. Authoritarian":
        return "L"; // Libertarian
      case "Progressive vs. Conservative":
        return "P"; // Progressive
      case "Secular vs. Religious":
        return "S"; // Secular
      case "Globalism vs. Nationalism":
        return "G"; // Globalism
      default:
        return "?";
    }
  }
}

/**
 * Generates an archetype code based on the user's scores across all axes
 *
 * @param {Object} normalizedScores - Object containing normalized scores for each axis (0-100 scale)
 * @param {Object} rawNormalizedScores - Object containing raw normalized scores (-100 to 100 scale)
 * @returns {Object} - Object containing the archetype code and name
 */
function determineArchetype(normalizedScores, rawNormalizedScores = {}) {
  // Generate the archetype code by combining letters from each axis
  const code = Object.keys(AXIS_CONFIG)
    .map((axis) => {
      const score = normalizedScores[axis] || 50;
      const rawScore = rawNormalizedScores[axis]; // Use raw score if available
      return determineAxisLetter(axis, score, rawScore);
    })
    .join("");

  // Look up the archetype name
  const archetypeName = ARCHETYPE_MAP[code] || "Unknown Archetype";

  return {
    code,
    name: archetypeName,
  };
}

/**
 * Main function to calculate complete quiz results
 *
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - Object mapping question IDs to answer values
 * @returns {Object} - Complete results object
 */
function calculateResults(questions, answers) {
  // Calculate scores
  const {
    rawScores,
    disagreeWeights,
    agreeWeights,
    rawNormalizedScores,
    normalizedScores,
  } = calculateAxisScores(questions, answers);

  // Check if there are any scores for the old name "Equality vs. Markets"
  // If so, copy them to "Equity vs. Free Market" to ensure consistency
  if (
    rawNormalizedScores["Equality vs. Markets"] !== undefined &&
    rawNormalizedScores["Equity vs. Free Market"] === undefined
  ) {
    rawNormalizedScores["Equity vs. Free Market"] =
      rawNormalizedScores["Equality vs. Markets"];
    normalizedScores["Equity vs. Free Market"] =
      normalizedScores["Equality vs. Markets"];
    rawScores["Equity vs. Free Market"] = rawScores["Equality vs. Markets"];
    disagreeWeights["Equity vs. Free Market"] =
      disagreeWeights["Equality vs. Markets"];
    agreeWeights["Equity vs. Free Market"] =
      agreeWeights["Equality vs. Markets"];
    console.log(
      "Copied 'Equality vs. Markets' scores to 'Equity vs. Free Market'"
    );
  }

  // Debugging raw data
  console.log("Raw Normalized Scores:", rawNormalizedScores);
  console.log("Normalized Scores:", normalizedScores);

  // Determine positions on each axis
  const axisPositions = determineAxisPositions(
    normalizedScores,
    rawNormalizedScores
  );

  // Determine strength of each position
  const positionStrengths = determinePositionStrengths(
    normalizedScores,
    rawNormalizedScores
  );

  // Determine archetype
  const archetype = determineArchetype(normalizedScores, rawNormalizedScores);

  // Build the final results object
  const results = {
    rawScores, // A
    disagreeWeights, // B
    agreeWeights, // C
    normalizedScores, // 0-100 scale for display
    rawNormalizedScores, // -100 to 100 scale (actual values)
    axisPositions,
    positionStrengths,
    archetype, // Add archetype info
    axisResults: [],
  };

  // Format axis results for display
  Object.keys(AXIS_CONFIG).forEach((axis) => {
    // Special handling for the problematic axis
    const isEquityAxis = axis === "Equity vs. Free Market";
    const oldAxisName = "Equality vs. Markets";

    // We will prioritize the canonical name but fall back to the alias if needed
    let useScore = normalizedScores[axis];
    let useRawScore = rawNormalizedScores[axis];

    // If we're dealing with the equity axis and its scores are undefined, try the old name
    if (isEquityAxis && (useScore === undefined || useRawScore === undefined)) {
      useScore = normalizedScores[oldAxisName];
      useRawScore = rawNormalizedScores[oldAxisName];
      console.log(`Using old axis name (${oldAxisName}) scores for ${axis}:`, {
        useScore,
        useRawScore,
      });
    }

    // Final fallback values if still undefined
    useScore = useScore !== undefined ? useScore : 50;
    useRawScore = useRawScore !== undefined ? useRawScore : 0;

    // Ensure the axis properties exist
    const config = AXIS_CONFIG[axis];
    if (!config) {
      console.error(`Missing configuration for axis: ${axis}`);
      return; // Skip this axis
    }

    // Get position and strength
    const userPosition = axisPositions[axis] || config.leftLabel;
    const positionStrength = positionStrengths[axis] || "Weak";

    // Add extra debug for Secular vs. Religious
    if (axis === "Secular vs. Religious") {
      console.log(`${axis} axis debug:`, {
        useScore,
        useRawScore,
        userPosition,
        positionStrength,
        letter: determineAxisLetter(axis, useScore, useRawScore),
        calculation: {
          isRightSide: useRawScore > 0,
          absDistance: Math.abs(useRawScore),
          strengthThreshold:
            Math.abs(useRawScore) < 30
              ? "Weak"
              : Math.abs(useRawScore) < 70
              ? "Moderate"
              : "Strong",
        },
      });
    }

    // Include this axis in the results display
    results.axisResults.push({
      name: axis,
      score: useScore,
      rawScore: useRawScore,
      userPosition: userPosition,
      positionStrength: positionStrength,
      leftLabel: config.leftLabel,
      rightLabel: config.rightLabel,
      letter: determineAxisLetter(axis, useScore, useRawScore),
    });
  });

  // Debug output for axis results
  console.log(
    "Final Axis Results:",
    results.axisResults.map((a) => ({
      name: a.name,
      rawScore: a.rawScore,
      score: a.score,
      userPosition: a.userPosition,
      positionStrength: a.positionStrength,
    }))
  );

  return results;
}

export {
  calculateResults,
  calculateAxisScores,
  calculateAnswerScore,
  determineAxisPositions,
  determineAxisLetter,
  determineArchetype,
  ANSWER_VALUES,
  AXIS_CONFIG,
  AXIS_ALIASES,
  ARCHETYPE_MAP,
};
