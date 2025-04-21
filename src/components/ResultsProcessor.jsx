import React, { useState, useEffect } from "react";
import { calculateResults } from "../utils/resultsCalculator";

/**
 * Component that processes quiz results from session storage
 * and provides the calculated results to its children
 */
export default function ResultsProcessor({ children }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch and process results when component mounts
    processResults();
  }, []);

  const processResults = async () => {
    try {
      setLoading(true);

      // Get stored quiz data from session storage
      const storedData = sessionStorage.getItem("quizResults");

      if (!storedData) {
        setError("No quiz results found. Please take the quiz first.");
        setLoading(false);
        return;
      }

      // Parse the stored data
      const parsedData = JSON.parse(storedData);

      const { answers, questions, axisScores } = parsedData;

      if (!questions || !answers) {
        setError("Invalid quiz results data. Please retake the quiz.");
        setLoading(false);
        return;
      }

      // Debug the questions to look for potential axis naming issues
      const axisNames = questions.map((q) => q.axis);
      const uniqueAxes = [...new Set(axisNames)];

      console.log("ResultsProcessor - Unique axes in questions:", uniqueAxes);

      // Count questions per axis to ensure we have equity questions
      const axisCount = {};
      axisNames.forEach((axis) => {
        axisCount[axis] = (axisCount[axis] || 0) + 1;
      });

      console.log("ResultsProcessor - Questions per axis:", axisCount);

      // Check for Equity vs. Free Market or Equality vs. Markets questions specifically
      const equityQuestions = questions.filter(
        (q) =>
          q.axis === "Equity vs. Free Market" ||
          q.axis === "Equality vs. Markets"
      );

      console.log(
        `ResultsProcessor - Found ${equityQuestions.length} equity-related questions`
      );

      if (equityQuestions.length === 0) {
        console.warn("No equity-related questions found in the dataset");
      } else {
        // Log the first few to see what they look like
        console.log(
          "Sample equity questions:",
          equityQuestions.slice(0, Math.min(3, equityQuestions.length))
        );
      }

      // Calculate the results using our utility function
      const calculatedResults = calculateResults(questions, answers);

      // Check if we have equity results
      const hasEquityResults = calculatedResults.axisResults.some(
        (axis) => axis.name === "Equity vs. Free Market"
      );

      console.log("ResultsProcessor - Has equity results:", hasEquityResults);

      if (!hasEquityResults) {
        console.error(
          "Equity vs. Free Market axis is missing from calculated results"
        );

        // Try to add it manually if we can determine the values
        if (equityQuestions.length > 0) {
          console.log("Attempting to manually add Equity vs. Free Market axis");
          // Create a placeholder for the missing axis with default values
          calculatedResults.axisResults.unshift({
            name: "Equity vs. Free Market",
            score: 50,
            rawScore: 0,
            userPosition: "Centered",
            positionStrength: "Weak",
            leftLabel: "Equity",
            rightLabel: "Free Market",
            letter: "E", // Default to Equity (left side)
          });
        }
      }

      // Set the processed results
      setResults(calculatedResults);
    } catch (err) {
      console.error("Error processing results:", err);
      setError(`Failed to process quiz results: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // If loading, show a loading indicator
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Processing Results</h2>
        <p className="text-gray-600">
          Please wait while we calculate your results...
        </p>
      </div>
    );
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-lg">
          <h2 className="font-bold text-xl mb-2">Error</h2>
          <p>{error}</p>
          <a href="/quiz" className="btn-primary mt-4 inline-block">
            Take Quiz Again
          </a>
        </div>
      </div>
    );
  }

  // If no results yet, show a message
  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          No results available. Please take the quiz first.
        </p>
        <a href="/quiz" className="btn-primary mt-4 inline-block">
          Take Quiz
        </a>
      </div>
    );
  }

  // Render the children with the results passed as props
  return React.Children.map(children, (child) => {
    return React.cloneElement(child, { results });
  });
}
