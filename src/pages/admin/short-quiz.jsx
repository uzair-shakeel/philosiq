import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  FaCheck,
  FaFilter,
  FaSearch,
  FaTimes,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";

export default function ShortQuizManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAxis, setFilterAxis] = useState("all");
  const [shortQuizConfig, setShortQuizConfig] = useState({
    totalQuestions: 30,
    questionsPerAxis: {},
  });
  const [changes, setChanges] = useState(false);

  // Load all questions and config
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // Get all questions
        const response = await axios.get("/api/questions?limit=1000"); // Increased limit to get all questions
        // Get current short quiz config
        const configResponse = await axios.get("/api/config/short-quiz");

        if (response.data.success) {
          const fetchedQuestions = response.data.questions || [];

          // Map the selected questions from config to the questions array
          if (configResponse.data.success && configResponse.data.config) {
            const selectedIds =
              configResponse.data.config.selectedQuestions || [];
            // Mark questions that are included in the short quiz
            const questionsWithSelection = fetchedQuestions.map((q) => ({
              ...q,
              includeInShortQuiz: selectedIds.includes(q._id),
            }));
            setQuestions(questionsWithSelection);
            setFilteredQuestions(questionsWithSelection);
          } else {
            setQuestions(fetchedQuestions);
            setFilteredQuestions(fetchedQuestions);
          }
        }

        if (configResponse.data.success) {
          setShortQuizConfig(
            configResponse.data.config || {
              totalQuestions: 30,
              questionsPerAxis: {},
            }
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(
          "Failed to load questions or configuration. Please refresh the page and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Filter questions when search or filter changes
  useEffect(() => {
    let result = [...questions];

    // Apply axis filter
    if (filterAxis !== "all") {
      result = result.filter((q) => q.axis === filterAxis);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (q) =>
          q.question.toLowerCase().includes(term) ||
          q.topic.toLowerCase().includes(term)
      );
    }

    setFilteredQuestions(result);
  }, [questions, searchTerm, filterAxis]);

  // Get all unique axes from questions
  const axes = [...new Set(questions.map((q) => q.axis))].sort();

  // Count questions by axis
  const questionCountByAxis = {};
  questions.forEach((q) => {
    questionCountByAxis[q.axis] = (questionCountByAxis[q.axis] || 0) + 1;
  });

  // Count selected questions by axis
  const selectedCountByAxis = {};
  questions.forEach((q) => {
    if (q.includeInShortQuiz) {
      selectedCountByAxis[q.axis] = (selectedCountByAxis[q.axis] || 0) + 1;
    }
  });

  // Total selected questions
  const totalSelected = questions.filter((q) => q.includeInShortQuiz).length;

  // Calculate ideal distribution
  const calculateIdealDistribution = () => {
    const idealDistribution = [];
    const axesArray = [...axes];

    if (axesArray.length === 0) return [];

    // Calculate based on equal distribution among axes
    const baseQuestionsPerAxis = Math.floor(
      shortQuizConfig.totalQuestions / axesArray.length
    );
    let remainder = shortQuizConfig.totalQuestions % axesArray.length;

    axesArray.forEach((axis) => {
      idealDistribution.push({
        axis: axis,
        count: baseQuestionsPerAxis + (remainder > 0 ? 1 : 0),
      });
      if (remainder > 0) remainder--;
    });

    return idealDistribution;
  };

  const idealDistribution = calculateIdealDistribution();

  // Helper to get count for a specific axis
  const getIdealCountForAxis = (axis) => {
    const entry = idealDistribution.find((item) => item.axis === axis);
    return entry ? entry.count : 0;
  };

  // Toggle a question for inclusion in short quiz
  const toggleQuestion = (questionId) => {
    const updatedQuestions = questions.map((q) => {
      if (q._id === questionId) {
        return { ...q, includeInShortQuiz: !q.includeInShortQuiz };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    setChanges(true);
  };

  // Bulk selection/deselection by axis
  const selectAllInAxis = (axis, select = true) => {
    const updatedQuestions = questions.map((q) => {
      if (q.axis === axis) {
        return { ...q, includeInShortQuiz: select };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    setChanges(true);
  };

  // Auto-select based on ideal distribution
  const autoSelectQuestions = () => {
    // First reset all selections
    const resetQuestions = questions.map((q) => ({
      ...q,
      includeInShortQuiz: false,
    }));

    // Group questions by axis
    const questionsByAxis = {};
    resetQuestions.forEach((q) => {
      if (!questionsByAxis[q.axis]) {
        questionsByAxis[q.axis] = [];
      }
      questionsByAxis[q.axis].push(q);
    });

    // Auto-select based on ideal distribution
    const autoSelectedQuestions = [...resetQuestions];

    // Process each axis
    idealDistribution.forEach((axisItem) => {
      const axis = axisItem.axis;
      const targetCount = axisItem.count;

      const axisQuestions = questionsByAxis[axis] || [];
      const shuffled = [...axisQuestions].sort(() => 0.5 - Math.random());
      const toSelect = Math.min(targetCount, shuffled.length);

      // Mark selected questions
      shuffled.slice(0, toSelect).forEach((selectedQ) => {
        const index = autoSelectedQuestions.findIndex(
          (q) => q._id === selectedQ._id
        );
        if (index !== -1) {
          autoSelectedQuestions[index].includeInShortQuiz = true;
        }
      });
    });

    setQuestions(autoSelectedQuestions);
    setChanges(true);
  };

  // Save changes
  const saveChanges = async () => {
    try {
      setSaving(true);

      // Get all questions marked for short quiz
      const shortQuizQuestions = questions
        .filter((q) => q.includeInShortQuiz)
        .map((q) => q._id);

      

      // Save configuration
      const configResponse = await axios.post("/api/config/short-quiz", {
        totalQuestions: shortQuizConfig.totalQuestions,
        questionsPerAxis: idealDistribution,
        selectedQuestions: shortQuizQuestions,
      });

      if (!configResponse.data.success) {
        throw new Error(
          configResponse.data.message || "Failed to save configuration"
        );
      }

      // Update individual questions
      const batchResponse = await axios.post("/api/questions/update-batch", {
        updates: questions.map((q) => ({
          id: q._id,
          update: { includeInShortQuiz: !!q.includeInShortQuiz },
        })),
      });

      if (!batchResponse.data.success) {
        throw new Error(
          batchResponse.data.message || "Failed to update questions"
        );
      }

      setChanges(false);
      alert("Short quiz configuration saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      alert(`Error saving changes: ${errorMessage}. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Short Quiz Manager">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Short Quiz Configuration</h1>
          <p className="text-gray-600 mb-4">
            Select which questions to include in the short quiz and set the
            total question count.
          </p>

          {/* Configuration Panel */}
          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Questions for Short Quiz
                </label>
                <div className="flex items-center">
                  {/* <input
                    type="number"
                    min="5"
                    max="100"
                    value={shortQuizConfig.totalQuestions}
                    onChange={(e) => {
                      setShortQuizConfig({
                        ...shortQuizConfig,
                        totalQuestions: Math.max(
                          5,
                          Math.min(100, parseInt(e.target.value) || 30)
                        ),
                      });
                      setChanges(true);
                    }}
                    className="w-24 border-gray-300 rounded-md shadow-sm focus:border-primary-maroon focus:ring-primary-maroon"
                  /> */}
                  <span className="ml-2 text-gray-500 text-sm">
                    {totalSelected} of {shortQuizConfig.totalQuestions} selected
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={autoSelectQuestions}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-blue hover:bg-secondary-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-blue"
                  >
                    Auto-Select Questions
                  </button>

                  <button
                    onClick={saveChanges}
                    disabled={!changes || saving}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-maroon ${
                      !changes || saving
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-maroon hover:bg-primary-darkMaroon"
                    }`}
                  >
                    {saving ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Axis Distribution */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Questions by Axis
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {axes.map((axis) => (
                  <div key={axis} className="border rounded p-3 bg-white">
                    <div className="text-sm font-medium">{axis}</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xl font-bold">
                        {selectedCountByAxis[axis] || 0}
                        <span className="text-gray-400 text-sm">
                          /{getIdealCountForAxis(axis)}
                        </span>
                      </div>
                      {/* <div className="flex space-x-1">
                        <button
                          onClick={() => selectAllInAxis(axis, true)}
                          className="p-1 text-xs text-green-700 hover:bg-green-100 rounded"
                          title="Select all in this axis"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => selectAllInAxis(axis, false)}
                          className="p-1 text-xs text-red-700 hover:bg-red-100 rounded"
                          title="Deselect all in this axis"
                        >
                          <FaTimes />
                        </button>
                      </div> */}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {questionCountByAxis[axis] || 0} total questions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:border-primary-maroon focus:ring-primary-maroon"
                />
              </div>
            </div>

            <div className="w-full md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={filterAxis}
                  onChange={(e) => setFilterAxis(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:border-primary-maroon focus:ring-primary-maroon"
                >
                  <option value="all">All Axes</option>
                  {axes.map((axis) => (
                    <option key={axis} value={axis}>
                      {axis} ({questionCountByAxis[axis] || 0})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Questions List */}
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-maroon mx-auto mb-4" />
              <p className="text-gray-600">Loading questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No questions found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Include
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Question
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Axis
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Direction
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Topic
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuestions.map((question) => (
                    <tr
                      key={question._id}
                      className={
                        question.includeInShortQuiz ? "bg-green-50" : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={!!question.includeInShortQuiz}
                            onChange={() => toggleQuestion(question._id)}
                            className="h-4 w-4 text-primary-maroon focus:ring-primary-maroon border-gray-300 rounded"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {question.question}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {question.axis}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            question.direction === "Left"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {question.direction}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {question.topic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const { getSession } = await import("next-auth/react");
  const session = await getSession(context);
  

  // if (!session || session.user.role !== "admin") {
  //   return {
  //     redirect: {
  //       destination: "/auth/signin?callbackUrl=/admin/short-quiz",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
}
