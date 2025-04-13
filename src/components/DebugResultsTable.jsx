import React, { useState } from "react";

/**
 * Debug component to display detailed calculations for each question
 */
export default function DebugResultsTable({ questions, answers }) {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showNormalization, setShowNormalization] = useState(false);

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
    if (!questionsByAxis[question.axis]) {
      questionsByAxis[question.axis] = [];
    }
    questionsByAxis[question.axis].push(question);
  });

  // Calculate total score for each axis
  const axisTotals = {};
  Object.keys(questionsByAxis).forEach((axis) => {
    axisTotals[axis] = questionsByAxis[axis].reduce((total, question) => {
      const score = calculateQuestionScore(question, answers[question._id]);
      return typeof score === "number" ? total + score : total;
    }, 0);
  });

  // Axis configuration with min/max values
  const axisConfig = {
    "Equity vs. Markets": { min: -61, max: 61 },
    "Libertarian vs. Authoritarian": { min: -101, max: 101 },
    "Progressive vs. Conservative": { min: -103, max: 103 },
    "Secular vs. Religious": { min: -72, max: 72 },
    "Globalism vs. Nationalism": { min: -86, max: 86 },
  };

  // Calculate normalized scores (0-100%)
  const normalizedScores = {};
  Object.keys(axisTotals).forEach((axis) => {
    if (!axisConfig[axis]) return;

    const rawScore = axisTotals[axis];
    const min = axisConfig[axis].min;
    const max = axisConfig[axis].max;
    const range = max - min;

    if (range <= 0) {
      normalizedScores[axis] = 50;
    } else {
      // Apply the formula: EquityMarkets_score = ((user_score - min_score) / (max_score - min_score)) * 100
      const normalized = ((rawScore - min) / range) * 100;
      normalizedScores[axis] = Math.round(
        Math.max(0, Math.min(100, normalized))
      );
    }
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
                {axisTotals[axis].toFixed(2)} (Raw)
              </div>
              <div className="text-sm mt-1">
                <span className="font-medium">{normalizedScores[axis]}%</span>{" "}
                (Normalized)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {questionsPerAxis[axis]} questions
              </div>
            </div>
          ))}
        </div>

        {/* <button
          onClick={() => setShowNormalization(!showNormalization)}
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          {showNormalization ? "Hide" : "Show"} Normalization Formula
        </button> */}

        {showNormalization && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h4 className="font-semibold mb-2">Normalization Formula</h4>
            <p className="mb-2 text-sm">
              Each axis has a theoretical min and max score. The normalization
              formula converts the raw score to a percentage (0-100) position
              between these values:
            </p>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-2">
              NormalizedScore = ((RawScore - MinScore) / (MaxScore - MinScore))
              * 100
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.keys(axisTotals).map((axis) => {
                const raw = axisTotals[axis];
                const min = axisConfig[axis].min;
                const max = axisConfig[axis].max;
                const range = max - min;
                const normalized = ((raw - min) / range) * 100;

                return (
                  <div key={axis} className="mb-3">
                    <h5 className="font-medium">{axis}</h5>
                    <p className="text-xs mt-1 mb-1">Raw score: {raw}</p>
                    <p className="text-xs mb-1">
                      Range: {min} to {max}
                    </p>
                    {axis === "Equity vs. Markets" ? (
                      <div className="bg-gray-50 p-2 text-xs rounded">
                        <p>Special formula for Equity vs Markets:</p>
                        <pre className="bg-gray-100 p-1">
                          ((RawScore - MinScore) / (MaxScore + MinScore)) * 100
                        </pre>
                        <p className="mt-1">
                          = (({raw} - {min}) / ({max} + {min})) * 100
                        </p>
                        <p className="mt-1">
                          = ({raw - min} / {max + min}) * 100
                        </p>
                        <p className="mt-1">
                          = {(((raw - min) / (max + min)) * 100).toFixed(2)}% ≈{" "}
                          {Math.round(((raw - min) / (max + min)) * 100)}%
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-2 text-xs rounded">
                        <p>Standard formula:</p>
                        <pre className="bg-gray-100 p-1">
                          ((RawScore - MinScore) / (MaxScore - MinScore)) * 100
                        </pre>
                        <p className="mt-1">
                          = (({raw} - {min}) / ({max} - {min})) * 100
                        </p>
                        <p className="mt-1">
                          = ({raw - min} / {range}) * 100
                        </p>
                        <p className="mt-1">
                          = {(((raw - min) / range) * 100).toFixed(2)}% ≈{" "}
                          {Math.round(((raw - min) / range) * 100)}%
                        </p>
                      </div>
                    )}
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
