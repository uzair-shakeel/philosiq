import React, { useState } from "react";

/**
 * Debug component to display detailed calculations for each question
 */
export default function DebugResultsTable({ questions, answers, results }) {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showNormalization, setShowNormalization] = useState(false);

  // Define axis aliases to handle different naming conventions
  const AXIS_ALIASES = {
    "Equality vs. Markets": "Equity vs. Markets",
  };

  // Return early if there's no data
  if (!questions || !answers || questions.length === 0) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        No question or answer data available for debugging
      </div>
    );
  }

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
    const canonicalAxis = AXIS_ALIASES[question.axis] || question.axis;

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
    "Equity vs. Markets": { min: -61, max: 61 },
    "Libertarian vs. Authoritarian": { min: -101, max: 101 },
    "Democracy vs. Authority": { min: -95, max: 95 },
    "Progressive vs. Conservative": { min: -103, max: 103 },
    "Progress vs. Tradition": { min: -98, max: 98 },
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

        <button
          onClick={() => setShowNormalization(!showNormalization)}
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          {showNormalization ? "Hide" : "Show"} Normalization Formula
        </button>

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
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.keys(axisTotals).map((axis) => {
                const A = axisTotals[axis] || 0;
                const B = axisDisagreeWeights[axis] || 0;
                const C = axisAgreeWeights[axis] || 0;
                const rawScore = ((A - B) / (B + C)) * 100;
                const displayScore = (rawScore + 100) / 2;

                return (
                  <div key={axis} className="mb-3">
                    <h5 className="font-medium">{axis}</h5>
                    <p className="text-xs mt-1 mb-1">
                      Raw score (A): {A.toFixed(2)}
                    </p>
                    <p className="text-xs mb-1">
                      Disagree weights (B): {B}, Agree weights (C): {C}
                    </p>
                    <div className="bg-gray-50 p-2 text-xs rounded">
                      <p>Formula calculation:</p>
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
                      <p className="mt-1">
                        Displayed as:{" "}
                        {isFinite(displayScore) ? Math.round(displayScore) : 50}
                        % (0-100 scale)
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
