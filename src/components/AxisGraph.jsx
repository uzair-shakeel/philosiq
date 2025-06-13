import React, { useEffect, useState } from "react";

/**
 * Component to display a visual representation of a political axis
 * with the user's position marked
 */
export default function AxisGraph({
  name,
  score = 50,
  rawScore = 0, // This is the -100 to 100 score
  leftLabel,
  updatePercents,
  rightLabel,
  key,
  questions,
  answers,
  positionStrength,
  userPosition,
  className = "",
  onLetterDetermined, // New callback for returning the axis letter
  onAxisDataUpdate, // New callback for returning axis breakdown data
}) {
  // Return early if there's no data
  if (!questions || !answers || questions.length === 0) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        No question or answer data available for debugging
      </div>
    );
  }

  // Create axis aliases to handle alternative names
  const axisAliases = {
    "Equality vs. Markets": "Equity vs. Free Market",
  };

  // Handle the canonical name for axes with aliases
  const canonicalName =
    name === "Equality vs. Markets" ? "Equity vs. Free Market" : name;

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

  // Calculate the axis-specific percentages
  const axisSpecificPercentages = axisPercentages[canonicalName] || {
    left: "50.00",
    right: "50.00",
  };
  const leftPercent = axisSpecificPercentages.left;
  const rightPercent = axisSpecificPercentages.right;

  // Function to determine axis letter based on percentages
  const getDominantAxisLetter = React.useMemo(() => {
    // Convert percentages to numbers for comparison
    const leftPercentNum = parseFloat(leftPercent);
    const rightPercentNum = parseFloat(rightPercent);

    // Determine if we're on the right side (right percentage is higher)
    // This matches the logic in resultsCalculator.js where negative raw scores
    // correspond to right-side letters and positive raw scores to left-side letters
    const isRightSide = rightPercentNum >= leftPercentNum;

    // If left side has higher percentage, return left-side letter
    // Otherwise return right-side letter
    if (!isRightSide) {
      switch (canonicalName) {
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
      switch (canonicalName) {
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
  }, [leftPercent, rightPercent, canonicalName]);

  // Count questions per axis
  const questionsPerAxis = {};
  Object.keys(questionsByAxis).forEach((axis) => {
    questionsPerAxis[axis] = questionsByAxis[axis].length;
  });

  // Handle potentially invalid score values
  const validScore = typeof score === "number" && !isNaN(score) ? score : 50;
  const validRawScore =
    typeof rawScore === "number" && !isNaN(rawScore) ? rawScore : 0;

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
      leftSideColor = "bg-teal-500"; // Teal for left (Libertarian)
      rightSideColor = "bg-orange-500"; // Orange for right (Authoritarian)
      break;
    case "Progressive vs. Conservative":
      leftSideColor = "bg-sky-500"; // Sky for left (Progressive)
      rightSideColor = "bg-red-400"; // Red for right (Conservative)
      break;
    case "Secular vs. Religious":
      leftSideColor = "bg-yellow-400"; // Yellow for left (Secular)
      rightSideColor = "bg-purple-500"; // Purple for right (Religious)
      break;
    case "Globalism vs. Nationalism":
      leftSideColor = "bg-lime-500"; // Lime for left (Globalism)
      rightSideColor = "bg-rose-500"; // Rose for right (Nationalism)
      break;
    default:
      // Default colors
      leftSideColor = "bg-blue-600";
      rightSideColor = "bg-green-600";
  }

  // Calculate the strength based on percentage
  const getStrengthFromPercentage = (percent) => {
    const distanceFromCenter = Math.abs(percent - 50);

    if (distanceFromCenter <= 9) {
      return "Leaning";
    } else if (distanceFromCenter <= 19) {
      return "Inclined";
    } else if (distanceFromCenter <= 29) {
      return "Committed";
    } else {
      return "Extreme";
    }
  };

  // Calculate strength based on actual percentages
  const leftPercentNum = parseFloat(leftPercent);
  const rightPercentNum = parseFloat(rightPercent);

  // Determine which side is dominant and calculate its strength
  const isDominantLeft = leftPercentNum > rightPercentNum;
  const dominantPercent = isDominantLeft ? leftPercentNum : rightPercentNum;
  const strengthLabel = getStrengthFromPercentage(dominantPercent);

  useEffect(() => {
    const leftPercent = axisSpecificPercentages.left;
    const rightPercent = axisSpecificPercentages.right;

    // Only update when the percentages actually change
    updatePercents(name, { leftPercent, rightPercent });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, axisSpecificPercentages.left, axisSpecificPercentages.right]);

  // Send the letter to the parent component if callback provided
  useEffect(() => {
    if (onLetterDetermined) {
      onLetterDetermined(canonicalName, getDominantAxisLetter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalName, getDominantAxisLetter]);

  // Send the axis breakdown data to the parent component if callback provided
  useEffect(() => {
    if (onAxisDataUpdate) {
      const axisData = {
        name: canonicalName,
        score: parseFloat(leftPercent),
        rawScore: validRawScore,
        leftLabel: safeLeftLabel,
        rightLabel: safeRightLabel,
        userPosition: isDominantLeft ? safeLeftLabel : safeRightLabel,
        positionStrength: strengthLabel,
        leftPercent: parseFloat(leftPercent),
        rightPercent: parseFloat(rightPercent),
      };
      onAxisDataUpdate(canonicalName, axisData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalName, leftPercent, rightPercent, strengthLabel]);

  // Use the supplied position parameter for the current axis
  // Instead of using displayNormalizedScores, use the actual score directly
  const currentAxisScore = parseFloat(leftPercent);

  // Special handling to ensure the marker is visible at edges
  let markerVisiblePosition = currentAxisScore;
  if (markerVisiblePosition <= 1) markerVisiblePosition = 1;
  if (markerVisiblePosition >= 99) markerVisiblePosition = 99;

  return (
    <div className={`mb-8 axis-graph ${className || ""}`}>
      {/* Axis Title */}
      <h3 className="text-lg font-semibold mb-1">{canonicalName}</h3>

      {/* Axis Labels */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium">
          <span
            className={`px-2 py-0.5 rounded-full text-white ${leftSideColor}`}
          >
            {safeLeftLabel} {isDominantLeft && `(${strengthLabel})`}
          </span>
        </div>
        <div className="text-xs font-medium">
          <span
            className={`px-2 py-0.5 rounded-full text-white ${rightSideColor}`}
          >
            {safeRightLabel} {!isDominantLeft && `(${strengthLabel})`}
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
            {leftPercent}% {isDominantLeft && `(${getDominantAxisLetter})`}
          </span>
        </div>

        {/* Right side bar with percentage always visible */}
        <div
          className={`h-full ${rightSideColor} absolute right-0 z-10 flex items-center justify-center`}
          style={{ width: `${rightPercent}%` }}
        >
          {/* Always show percentage */}
          <span className="text-white font-bold text-center px-2 z-20">
            {rightPercent}% {!isDominantLeft && `(${getDominantAxisLetter})`}
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
          strengthLabel
        )}
      </div>
    </div>
  );
}

/**
 * Helper function to generate a description of the user's position on the axis
 */
function getPositionDescription(axis, score, strength) {
  // Define axis aliases
  const AXIS_ALIASES = {
    "Equality vs. Markets": "Equity vs. Free Market",
  };

  // Use canonical axis name if an alias exists
  const canonicalAxis = AXIS_ALIASES[axis] || axis;

// Get the appropriate side label based on the score
let sideLabel;
if (canonicalAxis === "Equity vs. Free Market") {
  sideLabel = score < 50 ? "Free Market" : "Equity"; // ✅ FIXED
} else if (canonicalAxis === "Libertarian vs. Authoritarian") {
  sideLabel = score < 50 ? "Authoritarian" : "Libertarian"; // ✅ FIXED
} else if (canonicalAxis === "Progressive vs. Conservative") {
  sideLabel = score < 50 ? "Progressive" : "Conservative";
} else if (canonicalAxis === "Secular vs. Religious") {
  sideLabel = score < 50 ? "Secular" : "Religious";
} else if (canonicalAxis === "Globalism vs. Nationalism") {
  sideLabel = score < 50 ? "Globalist" : "Nationalist";
} else {
  return "Your position on this axis reflects a balance between the opposing viewpoints.";
}

  // Map the strength to the new categories
  let strengthCategory;
  if (!strength) {
    strengthCategory = "Leaning"; // Default
  } else if (strength === "Leaning") {
    strengthCategory = "Leaning";
  } else if (strength === "Inclined") {
    strengthCategory = "Inclined";
  } else if (strength === "Committed") {
    strengthCategory = "Committed";
  } else if (strength === "Extreme") {
    strengthCategory = "Extreme";
  } else {
    // For backward compatibility with old strength values
    if (strength.toLowerCase() === "weak") {
      strengthCategory = "Leaning";
    } else if (strength.toLowerCase() === "moderate") {
      strengthCategory = "Inclined";
    } else if (strength.toLowerCase() === "strong") {
      strengthCategory = "Committed";
    } else {
      strengthCategory = "Leaning"; // Default fallback
    }
  }

  // Comprehensive descriptions for each position and strength level
const descriptions = 
{
  "Equity": {
    Leaning:
      "You believe fairness requires awareness of social barriers. Some targeted support can help everyone start with a more equal chance.",
    Inclined:
      "You see equal opportunity as a shared responsibility. Structural disadvantages must be addressed to create real fairness.",
    Committed:
      "You believe justice means actively reducing inequality. Policies should rebalance outcomes, not just access.",
    Extreme:
      "You think the system must be restructured to ensure collective well-being and shared ownership of economic outcomes.",
  },

  "Free Market": {
    Leaning:
      "You believe voluntary exchange and competition usually produce the best results. Light regulation can help, but markets should lead.",
    Inclined:
      "You think economic freedom drives innovation and growth. Government should interfere as little as possible.",
    Committed:
      "You believe low taxes and limited rules let people and businesses thrive. Personal responsibility should guide outcomes.",
    Extreme:
      "You believe markets are the most moral and efficient system. The role of government should be almost nonexistent.",
  },

  "Libertarian": {
    Leaning:
      "You prefer personal choice over government direction. People should be free unless their actions harm others.",
    Inclined:
      "You believe individual rights should outweigh most collective rules. Freedom is the default, not the exception.",
    Committed:
      "You think government should exist only to protect basic rights. People should shape their lives without interference.",
    Extreme:
      "You want a society where almost all authority is voluntary. Freedom and consent replace law and control.",
  },

  "Authoritarian": {
    Leaning:
      "You think strong rules can help maintain order. Some freedoms may be limited to preserve social stability.",
    Inclined:
      "You believe unity and discipline are key to a strong society. Leadership should guide people more than public debate.",
    Committed:
      "You support concentrated power to protect values and enforce order. Stability outweighs personal autonomy.",
    Extreme:
      "You believe authority should shape all aspects of society. Obedience, tradition, and control create lasting strength.",
  },

  "Progressive": {
    Leaning:
      "You believe change is often needed to address unfair systems. Progress can come through thoughtful reform.",
    Inclined:
      "You support efforts to fix outdated norms. Innovation and inclusion are key to solving today’s challenges.",
    Committed:
      "You believe society must evolve quickly to reflect modern values. Deep reform is often necessary.",
    Extreme:
      "You think current systems are broken and must be replaced. Transformation is essential for real justice.",
  },

  "Conservative": {
    Leaning:
      "You think change should be careful and slow. Traditions often hold wisdom that keeps society grounded.",
    Inclined:
      "You value stability and heritage. Sudden shifts can cause more harm than good.",
    Committed:
      "You believe lasting institutions and moral order protect society. Cultural continuity matters more than novelty.",
    Extreme:
      "You think modern values have weakened society. A return to traditional roles and norms is needed.",
  },

  "Secular": {
    Leaning:
      "You think public decisions should rely on shared reason, not religious beliefs. Religion belongs in private life.",
    Inclined:
      "You believe society works best when policy is shaped by universal values rather than spiritual teachings.",
    Committed:
      "You see separating religion from law as essential to fairness. Institutions should be neutral and inclusive.",
    Extreme:
      "You believe public life should be entirely secular. Religion has no role in shaping rules or decisions.",
  },

  "Religious": {
    Leaning:
      "You see faith as a moral compass. Religious values can offer helpful guidance to society.",
    Inclined:
      "You believe spiritual principles support ethical living. Public life benefits from faith-based values.",
    Committed:
      "You think faith should inform how people live, lead, and govern. It brings order and meaning.",
    Extreme:
      "You believe religion should guide law and culture. Society thrives when grounded in divine truth.",
  },

  "Globalist": {
    Leaning:
      "You believe people everywhere share common challenges. Cooperation across borders can be helpful.",
    Inclined:
      "You support working with others to improve life beyond national boundaries. Shared progress is possible.",
    Committed:
      "You think global connection matters more than national competition. We are part of a larger world.",
    Extreme:
      "You believe humanity should unite across borders. National identity matters less than shared human values.",
  },

  "Nationalist": {
    Leaning:
      "You believe your country’s needs should come first, but recognize the value of some outside partnerships.",
    Inclined:
      "You think protecting national culture and sovereignty is key. Global ties should not weaken self-rule.",
    Committed:
      "You prioritize your country’s identity and traditions. Independence is more important than global approval.",
    Extreme:
      "You believe national strength and self-reliance should come before all else. Foreign influence should be resisted.",
  }
};

  // Return the appropriate description or a default message if not found
  return (
    descriptions[sideLabel]?.[strengthCategory] ||
    "Your position on this axis reflects a balance between the opposing viewpoints."
  );
}
