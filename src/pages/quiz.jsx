import React, { useState } from "react";
import Layout from "../components/Layout";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  // Sample questions - in a real app, these would come from an API
  const questions = [
    {
      id: 1,
      text: "The government should prioritize economic growth over environmental protection.",
      category: "Economic",
    },
    {
      id: 2,
      text: "Healthcare should be provided as a public service to all citizens.",
      category: "Economic",
    },
    {
      id: 3,
      text: "International cooperation is more effective than national self-interest.",
      category: "Diplomatic",
    },
    {
      id: 4,
      text: "Individual freedom is more important than social equality.",
      category: "Civil",
    },
    {
      id: 5,
      text: "Traditional values should guide social policy.",
      category: "Societal",
    },
  ];

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value,
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // In a real app, you would send the answers to your backend
    console.log("Answers submitted:", answers);
    // Redirect to results page or show results
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Layout title="Political Survey Quiz - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary-maroon h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Category badge */}
              <div className="mb-4">
                <span className="inline-block bg-secondary-lightBlue text-white text-sm px-3 py-1 rounded-full">
                  {questions[currentQuestion].category}
                </span>
              </div>

              {/* Question */}
              <h2 className="text-2xl font-bold mb-8">
                {questions[currentQuestion].text}
              </h2>

              {/* Answer options */}
              <div className="space-y-4">
                {[-2, -1, 0, 1, 2].map((value) => (
                  <button
                    key={value}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 hover:border-primary-maroon ${
                      answers[questions[currentQuestion].id] === value
                        ? "bg-primary-maroon text-white border-primary-maroon"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                    onClick={() => handleAnswer(value)}
                  >
                    {value === -2 && "Strongly Disagree"}
                    {value === -1 && "Disagree"}
                    {value === 0 && "Neutral"}
                    {value === 1 && "Agree"}
                    {value === 2 && "Strongly Agree"}
                  </button>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded ${
                    currentQuestion === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-secondary-darkBlue text-white hover:bg-secondary-blue"
                  }`}
                >
                  <FaArrowLeft /> Previous
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="bg-primary-maroon hover:bg-primary-darkMaroon text-white px-6 py-2 rounded flex items-center gap-2"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={!answers[questions[currentQuestion].id]}
                    className={`flex items-center gap-2 px-4 py-2 rounded ${
                      !answers[questions[currentQuestion].id]
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-secondary-darkBlue text-white hover:bg-secondary-blue"
                    }`}
                  >
                    Next <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
