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
      "You believe fairness requires addressing structural barriers that prevent equal access. Government support is sometimes necessary to help level the playing field and ensure everyone starts from a fair position.",
    Inclined:
      "You support social programs aimed at reducing inequality in areas like healthcare, housing, and education. You believe markets alone can’t correct deeply rooted disadvantages or provide equal outcomes.",
    Committed:
      "You view economic justice as a moral obligation and support progressive taxation, wealth redistribution, and labor protections to reduce inequality and give everyone a fair shot.",
    Extreme:
      "You believe the system is fundamentally unjust and should be reshaped to ensure dignity, shared prosperity, and equal access to resources—placing social well-being above private profit.",
  },

  "Free Market": {
    Leaning:
      "You trust private enterprise and competition to solve social problems more efficiently than government. While some regulation is necessary, markets generally produce better results through choice and innovation.",
    Inclined:
      "You believe minimal government intervention leads to stronger economic growth. Individuals and businesses, not regulators, should drive innovation, reward merit, and determine value.",
    Committed:
      "You believe in low taxes, limited regulation, and strong property rights. Government should only intervene when absolutely necessary, as free markets best allocate resources and encourage progress.",
    Extreme:
      "You see voluntary exchange and free enterprise as morally and practically superior. The government should play almost no role in economic life, letting markets operate with full freedom.",
  },

  "Libertarian": {
    Leaning:
      "You believe individuals should have wide latitude in personal and economic decisions. Government should step in only when needed to protect rights or prevent direct harm.",
    Inclined:
      "You support strong civil liberties and limited government. Freedom of speech, privacy, and lifestyle choices should be prioritized over laws that impose collective control.",
    Committed:
      "You think government should be restricted to core functions like defense and courts. Outside of that, people and communities should handle most decisions independently.",
    Extreme:
      "You believe in radically minimizing government power, trusting free individuals and voluntary cooperation to uphold social order and meet community needs without coercion.",
  },

  "Authoritarian": {
    Leaning:
      "You believe a structured society benefits from clear rules and leadership, even if some freedoms must yield to order and collective stability.",
    Inclined:
      "You support strong institutions and firm leadership to uphold national unity, social discipline, and a shared sense of identity in uncertain times.",
    Committed:
      "You believe centralized authority is necessary to defend national values and ensure cohesion. Freedoms may be limited to avoid division or moral decay.",
    Extreme:
      "You favor a powerful, directive state that enforces discipline, order, and tradition. Individual freedoms are secondary to unity and national strength.",
  },

  "Progressive": {
    Leaning:
      "You believe society should evolve to address injustice and inequality. Change may be gradual, but it’s necessary to adapt outdated systems to modern values.",
    Inclined:
      "You support reforms that promote inclusion, fairness, and innovation. You value policies that address systemic barriers and reflect social progress.",
    Committed:
      "You see progress as essential and believe institutions should be redesigned to reflect modern ideals like sustainability, justice, and equity.",
    Extreme:
      "You believe real change requires dismantling systems built on injustice. You favor bold transformation to create a new, fairer social foundation.",
  },

  "Conservative": {
    Leaning:
      "You believe tradition and stability are important foundations of society. While change may be needed, it should be approached cautiously and with respect for the past.",
    Inclined:
      "You value cultural continuity and established institutions. You believe slow, thoughtful reform is preferable to disruptive or trendy shifts.",
    Committed:
      "You see tradition, order, and moral values as essential to preserving what works in society. You resist changes that could weaken social cohesion.",
    Extreme:
      "You believe society has drifted too far from its roots. You support a return to traditional norms, roles, and values that promote strength and discipline.",
  },

  "Secular": {
    Leaning:
      "You think religion should guide private life but stay out of public policy. You prefer decisions based on shared logic, not spiritual doctrine.",
    Inclined:
      "You support keeping religion and state separate. Public laws and institutions should reflect universal principles, not religious beliefs.",
    Committed:
      "You see secularism as essential to fairness in diverse societies. Religion should not shape law, education, or government decisions.",
    Extreme:
      "You believe public life should be entirely free of religious influence. Society should be based on reason, science, and secular ethics.",
  },

  "Religious": {
    Leaning:
      "You believe faith offers valuable moral guidance, and religion can have a positive influence on culture and community values.",
    Inclined:
      "You support the presence of religious principles in public life. Faith-based values help promote ethical standards and social harmony.",
    Committed:
      "You believe religious teachings provide the best foundation for laws, education, and governance. Faith enriches both public and private life.",
    Extreme:
      "You favor a society where religion actively shapes law and culture. Faith should be central to how a nation defines morality and order.",
  },

  "Globalist": {
    Leaning:
      "You support international cooperation on shared challenges. You believe global partnerships help address issues like climate, trade, and peace.",
    Inclined:
      "You favor strong ties between nations. You see institutions like the UN or WTO as valuable tools for promoting progress and mutual benefit.",
    Committed:
      "You identify more with global citizenship than national borders. International collaboration should take priority over nationalist competition.",
    Extreme:
      "You support building a unified global society with shared governance and identity. National borders should give way to human unity and cooperation.",
  },

  "Nationalist": {
    Leaning:
      "You believe a nation should focus on its own people first while still cooperating with others when mutual interests align.",
    Inclined:
      "You value sovereignty and self-determination. National identity and cultural preservation should come before international commitments.",
    Committed:
      "You support putting national interests above global agendas. The government should protect borders, culture, and traditional values from outside influence.",
    Extreme:
      "You believe in full national independence. Foreign entanglements should be avoided, and your country should be fully self-reliant and proud.",
  }
};

  // Return the appropriate description or a default message if not found
  return (
    descriptions[sideLabel]?.[strengthCategory] ||
    "Your position on this axis reflects a balance between the opposing viewpoints."
  );
}
