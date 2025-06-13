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
      sideLabel = score < 50 ? "Equity" : "Free Market";
  } else if (canonicalAxis === "Libertarian vs. Authoritarian") {
    sideLabel = score < 50 ? "Libertarian" : "Authoritarian";
  } else if (canonicalAxis === "Progressive vs. Conservative") {
    sideLabel = score < 50 ? "Conservative" : "Progressive";
  } else if (canonicalAxis === "Secular vs. Religious") {
    sideLabel = score < 50 ? "Religious" : "Secular";
  } else if (canonicalAxis === "Globalism vs. Nationalism") {
    sideLabel = score < 50 ? "Nationalist" : "Globalist";
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
const descriptions = {
  "Equity": {
    Leaning:
      "You believe fairness means supporting those who face structural disadvantages. You value equal access to opportunity, even if it requires government help.",
    Inclined:
      "You support programs that reduce inequality, like healthcare and education access. You think the market alone can't guarantee a fair outcome.",
    Committed:
      "You see economic justice as essential and favor policies like wealth redistribution and strong labor protections to level the playing field.",
    Extreme:
      "You believe the system needs fundamental change to ensure shared wealth and dignity. Markets should serve society, not dominate it.",
  },

  "Free Market": {
    Leaning:
      "You generally favor market-based solutions to social and economic challenges, viewing private enterprise as a key engine of innovation and individual empowerment. While you acknowledge the need for some regulation to ensure fair play, you believe that competition and consumer choice usually lead to better outcomes than centralized planning.",
    Inclined:
      "You support minimal government interference in the economy and trust the market to reward effort and efficiency more than regulation does.",
    Committed:
      "You believe free markets work best with limited taxes and regulation. Government should stay out of business unless absolutely necessary.",
    Extreme:
      "You see voluntary exchange as the ideal system and believe the state should play a minimal role in the economy, if any at all.",
  },

  "Libertarian": {
    Leaning:
      "You believe people should generally be free to make their own choices without government interference, except for basic safety or rights.",
    Inclined:
      "You support strong personal freedoms and minimal state involvement in private matters, favoring individual responsibility over control.",
    Committed:
      "You think government should only handle essential functions like defense and leave most decisions to individuals and communities.",
    Extreme:
      "You favor a society with almost no government power, trusting voluntary cooperation and personal freedom to guide social order.",
  },

  "Authoritarian": {
    Leaning:
      "You think a bit more order and control helps society function better, even if it limits some freedoms.",
    Inclined:
      "You support strong leadership and rules to maintain order, tradition, and national unity in a changing world.",
    Committed:
      "You believe centralized authority is necessary to enforce values and protect the nation from instability or division.",
    Extreme:
      "You favor a powerful state that prioritizes unity, discipline, and moral order, even if it reduces individual rights.",
  },

  "Progressive": {
    Leaning:
      "You lean toward change and reform, believing society should evolve to address inequality and outdated systems.",
    Inclined:
      "You support inclusive policies and new ideas that promote fairness and adapt to modern challenges.",
    Committed:
      "You believe progress is vital and that institutions must be reformed to reflect values like justice and sustainability.",
    Extreme:
      "You seek major transformation to replace unjust systems with new, equitable structures that better serve everyone.",
  },

  "Conservative": {
    Leaning:
      "You prefer gradual change and believe tradition offers valuable guidance in keeping society stable and functional.",
    Inclined:
      "You support preserving cultural values and established systems, trusting that slow change is better than sudden shifts.",
    Committed:
      "You believe in upholding tradition, order, and long-standing institutions to protect society from decline or chaos.",
    Extreme:
      "You favor returning to traditional norms and social structures, rejecting modern trends that undermine cultural stability.",
  },

  "Secular": {
    Leaning:
      "You value keeping religion separate from public life, believing policy should be based on reason and shared values.",
    Inclined:
      "You believe laws should reflect universal principles, not religious doctrine, and that government should stay neutral.",
    Committed:
      "You see secularism as key to fairness, and think religion should not influence law, education, or public policy.",
    Extreme:
      "You support removing religious influence from all public institutions, favoring a society grounded in reason and science.",
  },

  "Religious": {
    Leaning:
      "You see religious values as a helpful moral guide and believe they can positively shape public life and ethics.",
    Inclined:
      "You support the presence of religious influence in society and policy, believing faith helps build moral order.",
    Committed:
      "You believe faith should inform public decisions and culture, offering structure and values for the common good.",
    Extreme:
      "You support a society where religion plays a central role in law and governance, guiding both public and private life.",
  },

  "Globalist": {
    Leaning:
      "You support global cooperation to solve shared problems and see international partnerships as generally positive.",
    Inclined:
      "You value cross-border collaboration and believe global institutions help promote peace, trade, and shared progress.",
    Committed:
      "You support global governance and cooperation over national competition, seeing yourself as part of a wider world.",
    Extreme:
      "You believe national borders should matter less and support building a unified global society with shared values.",
  },

  "Nationalist": {
    Leaning:
      "You believe your country’s interests should come first, but still see value in respectful global cooperation.",
    Inclined:
      "You support protecting your nation’s culture, economy, and sovereignty, even if that limits global involvement.",
    Committed:
      "You prioritize national identity and self-rule, favoring policies that reduce foreign influence and preserve traditions.",
    Extreme:
      "You favor a nation that is fully self-reliant, culturally strong, and free from global entanglements or outside control.",
  },
};

  // Return the appropriate description or a default message if not found
  return (
    descriptions[sideLabel]?.[strengthCategory] ||
    "Your position on this axis reflects a balance between the opposing viewpoints."
  );
}
