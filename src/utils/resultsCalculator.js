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

    // Convert to 0-100 scale for display purposes
    // 0 = -100%, 50 = 0%, 100 = 100%
    const displayScore = (normalizedRaw + 100) / 2;

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
 * @param {Object} normalizedScores - Object containing normalized scores for each axis
 * @returns {Object} - Object containing position labels for each axis
 */
function determineAxisPositions(normalizedScores) {
  const positions = {};

  Object.keys(normalizedScores).forEach((axis) => {
    const score = normalizedScores[axis];
    const config = AXIS_CONFIG[axis];

    if (!config) return;

    // If score is exactly 50, it's perfectly centered (0 on the -100 to 100 scale)
    if (score === 50) {
      positions[axis] = "Centered";
    } else if (score < 50) {
      positions[axis] = config.leftLabel;
    } else {
      positions[axis] = config.rightLabel;
    }
  });

  return positions;
}

/**
 * Calculate the strength of each position (weak, moderate, strong)
 *
 * @param {Object} normalizedScores - Object containing normalized scores for each axis
 * @returns {Object} - Object containing strength labels for each axis
 */
function determinePositionStrengths(normalizedScores) {
  const strengths = {};

  Object.keys(normalizedScores).forEach((axis) => {
    const score = normalizedScores[axis];

    // Calculate distance from center (50 on the 0-100 scale)
    const distanceFromCenter = Math.abs(score - 50);

    // Determine strength based on distance
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
  });

  return strengths;
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

  // Determine positions on each axis
  const axisPositions = determineAxisPositions(normalizedScores);

  // Determine strength of each position
  const positionStrengths = determinePositionStrengths(normalizedScores);

  // Build the final results object
  const results = {
    rawScores, // A
    disagreeWeights, // B
    agreeWeights, // C
    normalizedScores, // 0-100 scale for display
    rawNormalizedScores, // -100 to 100 scale (actual values)
    axisPositions,
    positionStrengths,
    axisResults: [],
  };

  // Format axis results for display
  Object.keys(AXIS_CONFIG).forEach((axis) => {
    // Include all axes in the results display
    results.axisResults.push({
      name: axis,
      score: normalizedScores[axis],
      rawScore: rawNormalizedScores[axis], // Add the raw score to the axis results
      userPosition: axisPositions[axis],
      positionStrength: positionStrengths[axis],
      leftLabel: AXIS_CONFIG[axis].leftLabel,
      rightLabel: AXIS_CONFIG[axis].rightLabel,
    });
  });

  return results;
}

export {
  calculateResults,
  calculateAxisScores,
  calculateAnswerScore,
  determineAxisPositions,
  ANSWER_VALUES,
  AXIS_CONFIG,
  AXIS_ALIASES,
};
