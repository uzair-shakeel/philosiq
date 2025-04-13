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
      console.log("Parsed quiz data:", parsedData);

      const { answers, questions, axisScores } = parsedData;

      if (!questions || !answers) {
        setError("Invalid quiz results data. Please retake the quiz.");
        setLoading(false);
        return;
      }

      console.log("Calculating results with:", {
        questionCount: questions.length,
        answerCount: Object.keys(answers).length,
        answerValues: Object.values(answers).slice(0, 5), // Show first 5 answers for debugging
      });

      // Verify that we have the correct data structure for questions
      const sampleQuestion = questions[0];
      if (sampleQuestion) {
        console.log("Sample question:", {
          id: sampleQuestion._id,
          axis: sampleQuestion.axis,
          direction: sampleQuestion.direction,
          weight: sampleQuestion.weight,
          weight_agree: sampleQuestion.weight_agree,
          weight_disagree: sampleQuestion.weight_disagree,
        });
      }

      // Calculate the results using our utility function
      const calculatedResults = calculateResults(questions, answers);
      console.log("Calculated results:", calculatedResults);

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
