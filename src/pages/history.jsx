import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import {
  FaSpinner,
  FaChevronRight,
  FaCalendarAlt,
  FaClipboardList,
  FaExclamationCircle,
} from "react-icons/fa";

export default function QuizHistory() {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/quiz/results", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch quiz history: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      setQuizResults(data.results);
    } catch (err) {
      console.error("Error fetching quiz history:", err);
      setError(err.message || "Failed to load quiz history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout title="Quiz History - PhilosiQ">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
          <div className="container-custom">
            <div className="flex items-center justify-center min-h-[400px]">
              <FaSpinner className="animate-spin text-4xl text-primary-maroon" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Quiz History - PhilosiQ">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
          <div className="container-custom">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <FaExclamationCircle className="text-red-400 text-xl mr-3" />
                <div>
                  <h3 className="text-red-800 font-medium">
                    Error Loading History
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Quiz History - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Your Quiz History
          </h1>

          {quizResults.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaClipboardList className="text-4xl text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                No Quiz Results Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Take a quiz to start building your history!
              </p>
              <button
                onClick={() => router.push("/quiz")}
                className="bg-primary-maroon text-white px-6 py-3 rounded-full hover:bg-primary-darkMaroon transition-colors"
              >
                Take Quiz Now
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {quizResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {result.archetype?.name || "Quiz Result"}
                      </h2>
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2" />
                        {formatDate(result.timestamp)}
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {result.quizType === "short" ? "Short Quiz" : "Full Quiz"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(result.axisScores || {}).map(
                      ([axis, score]) => (
                        <div key={axis}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{axis}</span>
                            <span className="font-medium">{score}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-maroon rounded-full"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => {
                      // Store this result in session storage
                      sessionStorage.setItem(
                        "quizResults",
                        JSON.stringify(result)
                      );
                      router.push("/results");
                    }}
                    className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    View Full Results <FaChevronRight className="ml-2" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
