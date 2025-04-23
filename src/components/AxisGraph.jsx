import React, { useEffect } from "react";

/**
 * Component to display a visual representation of a political axis
 * with the user's position marked
 */
export default function AxisGraph({
  name,
  score = 50,
  rawScore = 0, // This is the -100 to 100 score
  leftLabel,
  rightLabel,
  questions,
  answers,
  positionStrength,
  userPosition,
  className = "",
  onLetterDetermined, // New callback for returning the axis letter
}) {
  // Create axis aliases to handle alternative names
  const axisAliases = {
    "Equality vs. Markets": "Equity vs. Free Market",
  };

  // Return early if there's no data
  if (!questions || !answers || questions.length === 0) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        No question or answer data available for debugging
      </div>
    );
  }

  // Function to determine axis letter based on percentages
  const getDominantAxisLetter = (axis, leftPercent, rightPercent) => {
    // Convert percentages to numbers for comparison
    const leftPercentNum = parseFloat(leftPercent);
    const rightPercentNum = parseFloat(rightPercent);

    // Handle axis aliases for consistent naming
    const canonicalAxis = axisAliases[axis] || axis;

    // If left side has higher percentage, return first letter of left-side label
    // Otherwise return first letter of right-side label
    if (leftPercentNum > rightPercentNum) {
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
    } else {
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
    }
  };

  // Calculate the base value of the answer
  const getBaseValue = (answerValue) => {
    const baseValues = {
      "-2": -1,
      "-1": -0.5,
      0: 0,
      1: 0.5,
      2: 1,
    };
    return baseValues[answerValue?.toString()] || 0;
  };

  // Calculate the weighted score for a single answer
  const calculateQuestionScore = (question, answerValue) => {
    if (answerValue === undefined) return "Not answered";

    const baseValue = getBaseValue(answerValue);
    if (baseValue === 0) return "0 (Neutral)";

    // Determine which weight to apply
    let appliedWeight;
    if (baseValue > 0) {
      // For positive answers (agree/strongly agree), use agree weight
      appliedWeight = question.weight_agree || question.weight || 1;
    } else {
      // For negative answers (disagree/strongly disagree), use disagree weight
      appliedWeight = question.weight_disagree || question.weight || 1;
    }

    // Calculate the weighted score
    let weightedScore = baseValue * appliedWeight;

    // If the question is aligned with the "Left" side, multiply by -1
    // This is because Left should be negative and Right should be positive
    if (question.direction === "Left") {
      weightedScore *= -1;
    }

    return weightedScore;
  };

  // Group questions by axis
  const questionsByAxis = {};
  questions.forEach((question) => {
    // Use canonical axis name (through alias mapping if needed)
    const canonicalAxis = axisAliases[question.axis] || question.axis;

    if (!questionsByAxis[canonicalAxis]) {
      questionsByAxis[canonicalAxis] = [];
    }
    questionsByAxis[canonicalAxis].push(question);
  });

  // Calculate total score for each axis
  const axisTotals = {};
  const axisAgreeWeights = {};
  const axisDisagreeWeights = {};

  Object.keys(questionsByAxis).forEach((axis) => {
    axisTotals[axis] = questionsByAxis[axis].reduce((total, question) => {
      const score = calculateQuestionScore(question, answers[question._id]);
      return typeof score === "number" ? total + score : total;
    }, 0);

    // Calculate agree weights (C) and disagree weights (B) for each axis
    let totalAgreeWeight = 0;
    let totalDisagreeWeight = 0;

    questionsByAxis[axis].forEach((question) => {
      totalAgreeWeight += question.weight_agree || question.weight || 1;
      totalDisagreeWeight += question.weight_disagree || question.weight || 1;
    });

    axisAgreeWeights[axis] = totalAgreeWeight;
    axisDisagreeWeights[axis] = totalDisagreeWeight;
  });

  // Axis configuration with min/max values
  const axisConfig = {
    "Equity vs. Free Market": { min: -61, max: 61 },
    "Libertarian vs. Authoritarian": { min: -101, max: 101 },
    "Progressive vs. Conservative": { min: -103, max: 103 },
    "Secular vs. Religious": { min: -72, max: 72 },
    "Globalism vs. Nationalism": { min: -86, max: 86 },
  };

  // Calculate normalized scores using new formula (-100 to 100%)
  const axisPercentages = {};
  const rawNormalizedScores = {};
  const displayNormalizedScores = {};
  const dominantAxisLetters = {}; // Store the dominant letter for each axis

  Object.keys(axisTotals).forEach((axis) => {
    if (!axisConfig[axis]) return;

    const A = axisTotals[axis] || 0; // Raw score
    const B = axisDisagreeWeights[axis] || 0; // Sum of disagree weights
    const C = axisAgreeWeights[axis] || 0; // Sum of agree weights

    // Calculate display scores for this axis
    const displayScore = (A / C) * 50 + 50;

    // Store percentages for each axis
    const leftPercentage = displayScore.toFixed(2);
    const rightPercentage = (100 - displayScore).toFixed(2);

    axisPercentages[axis] = {
      left: leftPercentage,
      right: rightPercentage,
    };

    // Determine dominant letter for this axis
    dominantAxisLetters[axis] = getDominantAxisLetter(
      axis,
      leftPercentage,
      rightPercentage
    );

    // Apply the formula: (A-B)/(B+C)*100 to get a percentage between -100% and 100%
    // Handle division by zero by defaulting to 0
    const denominator = B + C;
    const normalizedRaw = denominator === 0 ? 0 : ((A - B) / denominator) * 100;

    // Ensure we have a finite number
    rawNormalizedScores[axis] = isFinite(normalizedRaw)
      ? Math.max(-100, Math.min(100, normalizedRaw))
      : 0;

    // Convert to 0-100 scale for display
    displayNormalizedScores[axis] = Math.round(
      (rawNormalizedScores[axis] + 100) / 2
    );
  });

  // Count questions per axis
  const questionsPerAxis = {};
  Object.keys(questionsByAxis).forEach((axis) => {
    questionsPerAxis[axis] = questionsByAxis[axis].length;
  });

  // Handle potentially invalid score values
  const validScore = typeof score === "number" && !isNaN(score) ? score : 50;
  const validRawScore =
    typeof rawScore === "number" && !isNaN(rawScore) ? rawScore : 0;

  // Handle the canonical name for axes with aliases
  const canonicalName =
    name === "Equality vs. Markets" ? "Equity vs. Free Market" : name;

  // Make sure we have valid labels
  const safeLeftLabel = leftLabel || "Left";
  const safeRightLabel = rightLabel || "Right";
  const safeUserPosition = userPosition || "Centered";
  const safePositionStrength = positionStrength || "Weak";

  // Assign axis-specific colors based on position and the examples shown
  let leftSideColor = "bg-blue-600";
  let rightSideColor = "bg-green-600";

  // Determine colors based on axis
  switch (canonicalName) {
    case "Equity vs. Free Market":
      leftSideColor = "bg-blue-600"; // Blue for left (Equity)
      rightSideColor = "bg-green-600"; // Green for right (Free Market)
      break;
    case "Libertarian vs. Authoritarian":
      leftSideColor = "bg-blue-500"; // Blue for left (Libertarian)
      rightSideColor = "bg-orange-500"; // Orange for right (Authoritarian)
      break;
    case "Progressive vs. Conservative":
      leftSideColor = "bg-green-500"; // Green for left (Progressive)
      rightSideColor = "bg-blue-400"; // Blue for right (Conservative)
      break;
    case "Secular vs. Religious":
      leftSideColor = "bg-yellow-400"; // Yellow for left (Secular)
      rightSideColor = "bg-purple-500"; // Purple for right (Religious)
      break;
    case "Globalism vs. Nationalism":
      leftSideColor = "bg-teal-500"; // Teal for left (Globalism)
      rightSideColor = "bg-green-500"; // Green for right (Nationalism)
      break;
    default:
      // Default colors
      leftSideColor = "bg-blue-600";
      rightSideColor = "bg-green-600";
  }

  // Get the axis-specific percentages
  const axisSpecificPercentages = axisPercentages[canonicalName] || {
    left: "50.00",
    right: "50.00",
  };
  const leftPercent = axisSpecificPercentages.left;
  const rightPercent = axisSpecificPercentages.right;

  // Get the dominant letter for this axis
  const axisDominantLetter = dominantAxisLetters[canonicalName] || "?";

  // Send the letter to the parent component if callback provided
  useEffect(() => {
    if (onLetterDetermined && axisDominantLetter) {
      onLetterDetermined(canonicalName, axisDominantLetter);
    }
  }, [canonicalName, axisDominantLetter, onLetterDetermined]);

  // Use the supplied position parameter for the current axis
  // Instead of using displayNormalizedScores, use the actual score directly
  const currentAxisScore = parseFloat(leftPercent);

  // Special handling to ensure the marker is visible at edges
  let markerVisiblePosition = currentAxisScore;
  if (markerVisiblePosition <= 1) markerVisiblePosition = 1;
  if (markerVisiblePosition >= 99) markerVisiblePosition = 99;

  return (
    <div className={`mb-8 ${className}`}>
      {/* Axis Title */}
      <h3 className="text-lg font-semibold mb-1">{canonicalName}</h3>

      {/* Axis Labels */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium">
          <span
            className={`px-2 py-0.5 rounded-full text-white ${leftSideColor}`}
          >
            {safeLeftLabel}
          </span>
        </div>
        <div className="text-xs font-medium">
          <span
            className={`px-2 py-0.5 rounded-full text-white ${rightSideColor}`}
          >
            {safeRightLabel} {positionStrength && `(${positionStrength})`}
          </span>
        </div>
      </div>

      {/* Axis bar - enhanced design with both sides colored */}
      <div className="relative h-10 rounded-full overflow-hidden mt-1 border border-gray-200">
        {/* Left side bar with percentage always visible */}
        <div
          className={`h-full ${leftSideColor} absolute left-0 z-10 flex items-center justify-center`}
          style={{ width: `${leftPercent}%` }}
        >
          {/* Always show percentage */}
          <span className="text-white font-bold text-center px-2 z-20">
            {leftPercent}%{" "}
            {parseFloat(leftPercent) > parseFloat(rightPercent) &&
              `(${axisDominantLetter})`}
          </span>
        </div>

        {/* Right side bar with percentage always visible */}
        <div
          className={`h-full ${rightSideColor} absolute right-0 z-10 flex items-center justify-center`}
          style={{ width: `${rightPercent}%` }}
        >
          {/* Always show percentage */}
          <span className="text-white font-bold text-center px-2 z-20">
            {rightPercent}%{" "}
            {parseFloat(rightPercent) >= parseFloat(leftPercent) &&
              `(${axisDominantLetter})`}
          </span>
        </div>

        {/* Marker for user's position */}
        <div
          className="absolute top-0 bottom-0 w-1 h-full bg-white border border-black z-30 transform -translate-x-1/2"
          style={{ left: `${markerVisiblePosition}%` }}
        ></div>
      </div>

      {/* Axis scale indicators */}
      {/* <div className="flex justify-between mt-1 text-xs text-gray-700">
        <div>-100%</div>
        <div>0%</div>
        <div>+100%</div>
      </div> */}

      {/* Position description */}
      <div className="mt-2 text-sm text-gray-700">
        {getPositionDescription(
          canonicalName,
          markerVisiblePosition,
          safePositionStrength
        )}
      </div>
    </div>
  );
}

/**
 * Helper function to generate a description of the user's position on the axis
 */
function getPositionDescription(axis, score, strength) {
  const position = score < 50 ? "left" : "right";
  const intensity = strength?.toLowerCase() || "moderate";

  // Define axis aliases
  const AXIS_ALIASES = {
    "Equality vs. Markets": "Equity vs. Free Market",
  };

  // Use canonical axis name if an alias exists
  const canonicalAxis = AXIS_ALIASES[axis] || axis;

  const descriptions = {
    "Equity vs. Free Market": {
      left: {
        weak: "You have a slight preference for economic equality and redistributive policies, but you also see value in market mechanisms.",
        moderate:
          "You believe economic equality is important and favor policies that reduce wealth disparities through government intervention.",
        strong:
          "You strongly favor economic equality and robust government intervention to ensure fair distribution of resources.",
      },
      right: {
        weak: "You have a slight preference for free markets, while recognizing the need for some economic regulations.",
        moderate:
          "You favor market-based solutions and believe economic freedom leads to greater innovation and prosperity.",
        strong:
          "You strongly support free markets with minimal government intervention and believe market forces should determine economic outcomes.",
      },
    },
    "Libertarian vs. Authoritarian": {
      left: {
        weak: "You generally favor individual liberties with limited government authority, but recognize the need for some regulations.",
        moderate:
          "You value individual freedoms and prefer a government with limited powers over personal matters.",
        strong:
          "You strongly prioritize individual liberties and believe government authority should be highly restricted.",
      },
      right: {
        weak: "You believe in balanced governance with some authority, while still respecting individual rights.",
        moderate:
          "You favor stronger governmental authority to maintain order and implement effective policies.",
        strong:
          "You strongly believe in the necessity of centralized authority to ensure order, security, and effective governance.",
      },
    },
    "Progressive vs. Conservative": {
      left: {
        weak: "You generally favor gradual social change while respecting some traditional values.",
        moderate:
          "You embrace social progress and are open to reforming institutions to better serve evolving societal needs.",
        strong:
          "You strongly advocate for social change and believe in continuously reforming institutions to address injustices.",
      },
      right: {
        weak: "You value some traditional practices while being open to moderate social changes.",
        moderate:
          "You value traditional institutions and believe in preserving established social structures and practices.",
        strong:
          "You strongly prioritize traditional values and believe in preserving established institutions against rapid change.",
      },
    },
    "Secular vs. Religious": {
      left: {
        weak: "You generally favor secular reasoning in governance while respecting religious beliefs in society.",
        moderate:
          "You believe public policy should be guided by secular reasoning, separate from religious doctrine.",
        strong:
          "You strongly advocate for secular governance and clear separation between religious institutions and state functions.",
      },
      right: {
        weak: "You recognize the value of religious perspectives in public life, while supporting basic separation of church and state.",
        moderate:
          "You believe religious values and traditions should inform public policy and social norms.",
        strong:
          "You strongly believe religious principles should guide governance and play a central role in public life.",
      },
    },
    "Globalism vs. Nationalism": {
      left: {
        weak: "You generally support international cooperation while maintaining important national interests.",
        moderate:
          "You value international institutions and favor cooperation between nations on global challenges.",
        strong:
          "You strongly prioritize global solutions and believe nations should increasingly integrate into international frameworks.",
      },
      right: {
        weak: "You believe in protecting national interests while engaging in beneficial international cooperation.",
        moderate:
          "You prioritize national sovereignty and believe countries should put their citizens' interests first.",
        strong:
          "You strongly believe in national independence and prioritizing citizens' interests over international obligations.",
      },
    },
  };

  // Return appropriate description or a default message if not found
  return (
    descriptions[canonicalAxis]?.[position]?.[intensity] ||
    "Your position on this axis reflects a balance between the opposing viewpoints."
  );
}
