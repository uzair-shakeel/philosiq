import React, { useState } from "react";

/**
 * Debug component to display detailed calculations for each question
 */
export default function DebugResultsTable({ questions, answers, results }) {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showNormalization, setShowNormalization] = useState(false);
  const [showArchetype, setShowArchetype] = useState(false);

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

  // Archetype mapping
  const archetypeMap = {
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

  // Function to determine axis letter based on score
  const getAxisLetter = (axis, score, rawScore) => {
    // Handle axis aliases for consistent naming
    const canonicalAxis = axisAliases[axis] || axis;

    // Add special debug for equity axis
    if (axis === "Equity vs. Free Market" || axis === "Equality vs. Markets") {
      console.log(
        `DebugTable - Getting letter for ${axis} with score ${score}, rawScore ${rawScore}`,
        {
          canonicalName: canonicalAxis,
          usingRawScore: rawScore !== undefined,
          willReturn:
            rawScore !== undefined
              ? rawScore < 0
                ? "F"
                : "E"
              : score < 50
              ? "F"
              : "E",
        }
      );
    }

    // FIXED: Completely reversed the logic to match resultsCalculator.js
    // Now negative raw scores (left side on graph) map to RIGHT side letters
    // and positive raw scores (right side on graph) map to LEFT side letters
    const isRightSide = rawScore !== undefined ? rawScore < 0 : score < 50;

    // Use the score to determine if we're on right or left side
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
  };

  // Simple mapping for direction/side
  const getSide = (direction) => (direction === "Left" ? "Left" : "Right");

  // Convert numeric answer to text
  const answerToText = (value) => {
    const map = {
      "-2": "Strongly Disagree (-1.0)",
      "-1": "Disagree (-0.5)",
      0: "Neutral (0)",
      1: "Agree (+0.5)",
      2: "Strongly Agree (+1.0)",
    };
    return map[value?.toString()] || "Not answered";
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
  const rawNormalizedScores = {};
  const displayNormalizedScores = {};

  Object.keys(axisTotals).forEach((axis) => {
    if (!axisConfig[axis]) return;

    const A = axisTotals[axis] || 0; // Raw score
    const B = axisDisagreeWeights[axis] || 0; // Sum of disagree weights
    const C = axisAgreeWeights[axis] || 0; // Sum of agree weights

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

  return (
    <div className="my-8 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Debug Calculation Table</h2>

      {/* Axis Totals */}
      <div className="mb-6 bg-blue-50 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Axis Scores</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Object.keys(axisTotals).map((axis) => (
            <div key={axis} className="border rounded p-3 bg-white">
              <div className="font-medium">{axis}</div>
              <div className="text-xl font-bold">
                {axisTotals[axis].toFixed(2)} (Raw - A)
              </div>
              <div className="text-sm mt-1 flex justify-between">
                <span>B: {axisDisagreeWeights[axis]} (Disagree)</span>
                <span>C: {axisAgreeWeights[axis]} (Agree)</span>
              </div>
              <div className="text-sm mt-1">
                <span className="font-medium">
                  {displayNormalizedScores[axis]}%
                </span>{" "}
                (Normalized:{" "}
                {rawNormalizedScores[axis] !== undefined
                  ? rawNormalizedScores[axis].toFixed(1)
                  : "0"}
                %)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {questionsPerAxis[axis]} questions
              </div>
            </div>
          ))}
        </div>

        {/* Archetype Calculation */}
        <div className="mt-4">
          <button
            onClick={() => setShowArchetype(!showArchetype)}
            className="text-blue-600 hover:text-blue-800 underline text-sm mr-4"
          >
            {showArchetype ? "Hide" : "Show"} Archetype Calculation
          </button>

          <button
            onClick={() => setShowNormalization(!showNormalization)}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            {showNormalization ? "Hide" : "Show"} Normalization Formula
          </button>
        </div>

        {showArchetype && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h4 className="font-semibold mb-2">Archetype Calculation</h4>
            <p className="mb-2 text-sm">
              Each axis contributes one letter to the archetype code based on
              which side of the center (50%) the score falls:
            </p>

            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 mt-2 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Axis
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Score
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Letter
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.keys(axisConfig).map((axis) => {
                    const score = displayNormalizedScores[axis] || 50;
                    const letter = getAxisLetter(
                      axis,
                      score,
                      rawNormalizedScores[axis]
                    );
                    const meaning =
                      letter === "?"
                        ? "Unknown"
                        : {
                            E: "Equity",
                            F: "Free Market",
                            L: "Libertarian",
                            A: "Authoritarian",
                            P: "Progressive",
                            C: "Conservative",
                            S: "Secular",
                            R: "Religious",
                            G: "Globalist",
                            N: "Nationalist",
                          }[letter];

                    return (
                      <tr key={axis}>
                        <td className="px-4 py-2 text-sm">{axis}</td>
                        <td className="px-4 py-2 text-sm">{score}%</td>
                        <td className="px-4 py-2 text-sm font-bold">
                          {letter}
                        </td>
                        <td className="px-4 py-2 text-sm">{meaning}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Archetype Result */}
            {(() => {
              const code = Object.keys(axisConfig)
                .map((axis) =>
                  getAxisLetter(
                    axis,
                    displayNormalizedScores[axis] || 50,
                    rawNormalizedScores[axis]
                  )
                )
                .join("");

              const archetypeName = archetypeMap[code] || "Unknown Archetype";

              return (
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-lg font-bold mb-1">
                    Archetype Code:{" "}
                    <span className="text-primary-maroon">{code}</span>
                  </div>
                  <div className="text-lg font-bold">
                    Archetype Name:{" "}
                    <span className="text-primary-maroon">{archetypeName}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    This archetype is determined by combining the letters from
                    each axis. NOTE: We display OPPOSITE positions from the
                    visual bars to match the archetype code. Left side bars
                    (-100%) produce RIGHT side labels/letters and right side
                    bars (+100%) produce LEFT side labels/letters.
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {showNormalization && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h4 className="font-semibold mb-2">Normalization Formula</h4>
            <p className="mb-2 text-sm">
              The normalization formula converts the raw score to a percentage
              (-100% to 100%) position:
            </p>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-2">
              NormalizedScore = ((A - B) / (B + C)) * 100
            </div>
            <div className="text-sm mb-2">
              <ul className="list-disc pl-6">
                <li>A = Raw score (sum of all weighted answers)</li>
                <li>B = Sum of all disagree weights</li>
                <li>C = Sum of all agree weights</li>
                <li>
                  Max Score = Maximum possible score for this axis (from config)
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.keys(axisTotals).map((axis) => {
                const A = axisTotals[axis] || 0; // Raw user score
                const B = axisDisagreeWeights[axis] || 0;
                const C = axisAgreeWeights[axis] || 0;
                const maxScore = axisConfig[axis]?.max || 100;
                const rawScore = ((A - B) / (B + C)) * 100;

                // Calculate display score directly from user score (A) and max score
                const displayScore = ((A + maxScore) / (maxScore * 2)) * 100;

                return (
                  <div key={axis} className="mb-3">
                    <h5 className="font-medium">{axis}</h5>
                    <p className="text-xs mt-1 mb-1">
                      Raw user score (A): {A.toFixed(2)}
                    </p>
                    <p className="text-xs mb-1">Max score: {maxScore}</p>
                    <p className="text-xs mb-1">
                      Disagree weights (B): {B}, Agree weights (C): {C}
                    </p>
                    <div className="bg-gray-50 p-2 text-xs rounded">
                      <p>Raw normalized score formula:</p>
                      <pre className="bg-gray-100 p-1">
                        ((A - B) / (B + C)) * 100
                      </pre>
                      <p className="mt-1">
                        = (({A.toFixed(2)} - {B}) / ({B} + {C})) * 100
                      </p>
                      <p className="mt-1">
                        = ({(A - B).toFixed(2)} / {B + C}) * 100
                      </p>
                      <p className="mt-1">
                        = {isFinite(rawScore) ? rawScore.toFixed(2) : "N/A"}%
                        (Raw normalized score)
                      </p>

                      <p className="mt-3">
                        Display score formula (0-100 scale):
                      </p>
                      <pre className="bg-gray-100 p-1">
                        (User Score + Max Score) / (Max Score * 2) * 100
                      </pre>
                      <p className="mt-1">
                        = ({A.toFixed(2)} + {maxScore}) / ({maxScore} * 2) * 100
                      </p>
                      <p className="mt-1">
                        = {(A + maxScore).toFixed(2)} / {maxScore * 2} * 100
                      </p>
                      <p className="mt-1">
                        ={" "}
                        {isFinite(displayScore)
                          ? displayScore.toFixed(2)
                          : "N/A"}
                        % (Display score on 0-100 scale)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Questions Table */}
      <div className="border rounded-lg overflow-hidden shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Question
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Axis
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Direction
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Answer
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Agree Weight
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Disagree Weight
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Score
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question, index) => {
              const answer = answers[question._id];
              const isExpanded = expandedQuestion === question._id;
              const score = calculateQuestionScore(question, answer);
              const baseValue = getBaseValue(answer);

              return (
                <React.Fragment key={question._id || index}>
                  <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 text-sm">{question.question}</td>
                    <td className="px-4 py-3 text-sm">{question.axis}</td>
                    <td className="px-4 py-3 text-sm">{question.direction}</td>
                    <td className="px-4 py-3 text-sm">
                      {answerToText(answer)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {question.weight_agree || question.weight || 1}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {question.weight_disagree || question.weight || 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {typeof score === "number" ? score.toFixed(2) : score}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() =>
                          setExpandedQuestion(isExpanded ? null : question._id)
                        }
                        className="text-blue-500 hover:text-blue-700 underline"
                      >
                        {isExpanded ? "Hide" : "Show"}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-blue-50">
                      <td colSpan="8" className="px-4 py-3">
                        <div className="text-sm p-2">
                          <h4 className="font-semibold mb-2">
                            Calculation Details:
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Question ID: {question._id}</li>
                            <li>Base Answer Value: {baseValue}</li>
                            <li>
                              Applied Weight:{" "}
                              {baseValue > 0
                                ? `${
                                    question.weight_agree ||
                                    question.weight ||
                                    1
                                  } (Agree Weight)`
                                : baseValue < 0
                                ? `${
                                    question.weight_disagree ||
                                    question.weight ||
                                    1
                                  } (Disagree Weight)`
                                : "N/A (Neutral)"}
                            </li>
                            <li>
                              Initial Score:{" "}
                              {baseValue === 0
                                ? "0 (Neutral)"
                                : `${baseValue} × ${
                                    baseValue > 0
                                      ? question.weight_agree ||
                                        question.weight ||
                                        1
                                      : question.weight_disagree ||
                                        question.weight ||
                                        1
                                  } = ${
                                    baseValue *
                                    (baseValue > 0
                                      ? question.weight_agree ||
                                        question.weight ||
                                        1
                                      : question.weight_disagree ||
                                        question.weight ||
                                        1)
                                  }`}
                            </li>
                            {question.direction === "Left" &&
                              baseValue !== 0 && (
                                <li>
                                  Direction Adjustment:{" "}
                                  {baseValue *
                                    (baseValue > 0
                                      ? question.weight_agree ||
                                        question.weight ||
                                        1
                                      : question.weight_disagree ||
                                        question.weight ||
                                        1)}{" "}
                                  × -1 ={" "}
                                  {baseValue *
                                    (baseValue > 0
                                      ? question.weight_agree ||
                                        question.weight ||
                                        1
                                      : question.weight_disagree ||
                                        question.weight ||
                                        1) *
                                    -1}{" "}
                                  (Left-aligned question, flipping sign)
                                </li>
                              )}
                            <li className="font-medium">
                              Final Question Score:{" "}
                              {typeof score === "number"
                                ? score.toFixed(2)
                                : score}
                            </li>
                            <li>
                              Contributes to Axis: {question.axis} (Current
                              Total: {axisTotals[question.axis].toFixed(2)})
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          * Questions aligned with the "Left" side of each axis have their
          scores flipped to maintain consistent axis direction. Left is
          negative, Right is positive.
        </p>
      </div>
    </div>
  );
}
