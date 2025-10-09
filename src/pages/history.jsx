import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaCalendarAlt,
  FaArrowRight,
  FaSpinner,
  FaHistory,
  FaTrash,
} from "react-icons/fa";

// Custom Modal Component
function CustomModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  isConfirm = false,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end gap-3">
          {isConfirm && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white ${
              isConfirm
                ? "bg-red-600 hover:bg-red-800"
                : "bg-primary-maroon hover:bg-primary-darkMaroon"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      // Store current URL for return after login
      if (typeof window !== "undefined") {
        const currentUrl = window.location.pathname + window.location.search;
        localStorage.setItem("returnUrl", currentUrl);
      }
      router.push("/login?redirect=history");
      return;
    }

    // Fetch quiz history
    fetchQuizHistory(token);
  }, [router]);

  const fetchQuizHistory = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("/api/quiz/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.results)) {
        // Sort results by date (newest first)
        const sortedResults = data.results.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setQuizHistory(sortedResults);
      } else {
        setQuizHistory([]);
      }
    } catch (error) {
      console.error("Error fetching quiz history:", error);
      setError("Failed to load your quiz history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResult = (resultId) => {
    setModal({
      isOpen: true,
      type: "confirm",
      message:
        "Are you sure you want to delete this quiz result? This action cannot be undone.",
      onConfirm: () => confirmDelete(resultId),
    });
  };

  const confirmDelete = async (resultId) => {
    setModal({ isOpen: false });
    setDeletingId(resultId);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setModal({
          isOpen: true,
          type: "error",
          message: "You must be logged in to delete a result.",
        });
        setDeletingId(null);
        return;
      }
      const response = await fetch(`/api/quiz/result/${resultId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setQuizHistory((prev) => prev.filter((r) => r._id !== resultId));
        setModal({
          isOpen: true,
          type: "success",
          message: "Quiz result deleted successfully.",
        });
      } else {
        setModal({
          isOpen: true,
          type: "error",
          message: data.message || "Failed to delete quiz result.",
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        message: "Failed to delete quiz result. Please try again later.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get background color based on archetype name
  const getArchetypeColor = (archetypeName) => {
    // Extract first word of archetype name for color assignment
    const firstWord =
      archetypeName.split(" ")[1]?.toLowerCase() || archetypeName.toLowerCase();

    const colorMap = {
      utopian: "bg-blue-100 border-blue-300",
      reformer: "bg-green-100 border-green-300",
      prophet: "bg-purple-100 border-purple-300",
      firebrand: "bg-red-100 border-red-300",
      philosopher: "bg-indigo-100 border-indigo-300",
      localist: "bg-yellow-100 border-yellow-300",
      missionary: "bg-teal-100 border-teal-300",
      guardian: "bg-orange-100 border-orange-300",
      technocrat: "bg-blue-100 border-blue-300",
      enforcer: "bg-gray-100 border-gray-300",
      zealot: "bg-red-100 border-red-300",
      purist: "bg-purple-100 border-purple-300",
      commander: "bg-blue-100 border-blue-300",
      steward: "bg-green-100 border-green-300",
      shepherd: "bg-teal-100 border-teal-300",
      priest: "bg-indigo-100 border-indigo-300",
      futurist: "bg-cyan-100 border-cyan-300",
      maverick: "bg-amber-100 border-amber-300",
      evangelist: "bg-pink-100 border-pink-300",
      dissenter: "bg-rose-100 border-rose-300",
      globalist: "bg-sky-100 border-sky-300",
      patriot: "bg-red-100 border-red-300",
      industrialist: "bg-yellow-100 border-yellow-300",
      traditionalist: "bg-blue-100 border-blue-300",
      overlord: "bg-gray-100 border-gray-300",
      corporatist: "bg-blue-100 border-blue-300",
      moralizer: "bg-purple-100 border-purple-300",
      builder: "bg-amber-100 border-amber-300",
      executive: "bg-gray-100 border-gray-300",
      ironhand: "bg-red-100 border-red-300",
      regent: "bg-indigo-100 border-indigo-300",
      crusader: "bg-red-100 border-red-300",
    };

    return colorMap[firstWord] || "bg-gray-100 border-gray-300";
  };

  return (
    <Layout title="Your Quiz History - Philosiq">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Your Quiz History</h1>
            <p className="text-lg text-gray-600">
              Review your previous political archetype quiz results
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-maroon mb-4" />
              <p className="text-lg">Loading your quiz history...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
              <button
                onClick={() =>
                  fetchQuizHistory(localStorage.getItem("authToken"))
                }
                className="mt-2 text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && quizHistory.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <FaHistory className="mx-auto text-5xl text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Quiz Results Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't saved any quiz results yet. Take a quiz to get
                started!
              </p>
              <Link
                href="/quiz"
                className="bg-primary-maroon text-white px-6 py-3 rounded-full inline-flex items-center"
              >
                Take Quiz Now <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}

          {/* Quiz History List */}
          {!loading && !error && quizHistory.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizHistory.map((result, index) => (
                <div
                  key={index}
                  className={`rounded-lg shadow-md border overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 ${getArchetypeColor(
                    result.archetype.name
                  )}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">
                        {result.archetype.name}
                      </h3>
                      <span className="bg-white px-3 py-1 rounded-full text-xs font-medium border border-gray-200 shadow-sm">
                        {result.quizType === "full"
                          ? "Full Quiz"
                          : "Short Quiz"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.archetype.traits.map((trait, i) => (
                        <span
                          key={i}
                          className="bg-white px-2 py-1 rounded-full text-xs font-medium shadow-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <FaCalendarAlt className="mr-2" />
                      {formatDate(result.createdAt)}
                    </div>

                    {/* Show if Impact Answers are available */}
                    {result.impactAnswers && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          ⚡ Balance Board Available
                        </span>
                      </div>
                    )}

                    <Link
                      href={`/history/${result._id}`}
                      className="bg-white text-primary-maroon border border-primary-maroon px-4 py-2 rounded-full inline-flex items-center text-sm font-medium hover:bg-primary-maroon hover:text-white transition-colors"
                    >
                      View Full Results <FaArrowRight className="ml-2" />
                    </Link>
                    <button
                      onClick={() => handleDeleteResult(result._id)}
                      disabled={deletingId === result._id}
                      className="ml-2 bg-red-600 text-white px-4 py-2 rounded-full inline-flex items-center text-sm font-medium hover:bg-red-800 transition-colors disabled:bg-gray-400"
                    >
                      {deletingId === result._id ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />{" "}
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FaTrash className="mr-2" /> Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Take New Quiz Button */}
          {!loading && quizHistory.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/quiz"
                className="bg-primary-maroon text-white px-6 py-3 rounded-full inline-flex items-center"
              >
                Take Another Quiz <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}

          {/* Custom Modal for confirmation, success, and error */}
          <CustomModal
            isOpen={modal.isOpen}
            title={
              modal.type === "confirm"
                ? "Confirm Delete"
                : modal.type === "success"
                ? "Deleted"
                : "Error"
            }
            message={modal.message}
            onConfirm={() => {
              if (modal.type === "confirm") {
                modal.onConfirm && modal.onConfirm();
              } else {
                setModal({ isOpen: false });
              }
            }}
            onCancel={() => setModal({ isOpen: false })}
            confirmText={modal.type === "confirm" ? "Delete" : "OK"}
            cancelText="Cancel"
            isConfirm={modal.type === "confirm"}
          />
        </div>
      </div>
    </Layout>
  );
}
