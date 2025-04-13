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

// Axis configuration
const AXIS_CONFIG = {
  "Equity vs. Markets": {
    maxScore: 61,
    minScore: -61,
    leftLabel: "Equity",
    rightLabel: "Markets",
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
  // Initialize scores for each axis
  const rawScores = {};
  Object.keys(AXIS_CONFIG).forEach((axis) => {
    rawScores[axis] = 0;
  });

  // For debugging
  console.log("Questions:", questions.length);
  console.log("Answer keys:", Object.keys(answers).length);

  // Calculate raw scores by summing weighted answers
  questions.forEach((question) => {
    const answer = answers[question._id];

    // Skip if question wasn't answered
    if (answer === undefined) return;

    const axis = question.axis;

    // Skip if axis is not defined in our configuration
    if (!AXIS_CONFIG[axis]) {
      console.warn(`Unknown axis: ${axis}`);
      return;
    }

    // Add the weighted score to the corresponding axis
    const weightedScore = calculateAnswerScore(
      answer,
      question.weight_agree || question.weight || 1,
      question.weight_disagree || question.weight || 1,
      question.direction
    );

    // Add to the axis total
    rawScores[axis] = (rawScores[axis] || 0) + weightedScore;
  });

  // Normalize scores to 0-100 scale
  const normalizedScores = {};
  Object.keys(rawScores).forEach((axis) => {
    const config = AXIS_CONFIG[axis];
    if (!config) return;

    // Apply the normalization formula: ((score - min) / (max - min)) * 100
    // This converts the raw score to a percentage position between min and max
    const score = rawScores[axis];
    const min = config.minScore;
    const max = config.maxScore;

    // Special formula for Equity vs. Markets axis
    if (axis === "Equity vs. Markets") {
      // Apply the formula: EquityMarkets_score = ((user_score - min_score) / (max_score + min_score)) * 100
      let normalizedScore = ((score - min) / (max + min)) * 100;

      // Clamp between 0 and 100
      normalizedScore = Math.max(0, Math.min(100, normalizedScore));

      // Round to whole number
      normalizedScores[axis] = Math.round(normalizedScore);
    } else {
      // Standard formula for other axes: ((score - min) / (max - min)) * 100
      // Ensure the range is valid
      const range = max - min;
      if (range <= 0) {
        normalizedScores[axis] = 50; // Default to middle if range is invalid
      } else {
        let normalizedScore = ((score - min) / range) * 100;

        // Clamp between 0 and 100
        normalizedScore = Math.max(0, Math.min(100, normalizedScore));

        // Round to whole number
        normalizedScores[axis] = Math.round(normalizedScore);
      }
    }
  });

  return {
    rawScores,
    normalizedScores,
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

    // If score is exactly 50, it's perfectly centered
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

    // Calculate distance from center (50)
    const distanceFromCenter = Math.abs(score - 50);

    // Determine strength based on distance
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
  const { rawScores, normalizedScores } = calculateAxisScores(
    questions,
    answers
  );

  // Determine positions on each axis
  const axisPositions = determineAxisPositions(normalizedScores);

  // Determine strength of each position
  const positionStrengths = determinePositionStrengths(normalizedScores);

  // Build the final results object
  const results = {
    rawScores,
    normalizedScores,
    axisPositions,
    positionStrengths,
    axisResults: [],
  };

  // Format axis results for display
  Object.keys(AXIS_CONFIG).forEach((axis) => {
    results.axisResults.push({
      name: axis,
      score: normalizedScores[axis],
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
};
