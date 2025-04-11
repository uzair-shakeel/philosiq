import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "../../../components/AdminLayout";
import Link from "next/link";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";

export default function QuestionsIndex() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  // Filters
  const [filters, setFilters] = useState({
    axis: "",
    topic: "",
    direction: "",
    active: "",
  });

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load initial data based on URL params
  useEffect(() => {
    const page = parseInt(router.query.page) || 1;
    const initialFilters = {
      axis: router.query.axis || "",
      topic: router.query.topic || "",
      direction: router.query.direction || "",
      active: router.query.active || "",
    };

    setFilters(initialFilters);
    fetchQuestions(page, initialFilters);
  }, [router.query]);

  // Fetch questions with pagination and filters
  const fetchQuestions = async (page = 1, currentFilters = filters) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", pagination.limit);

      if (currentFilters.axis) params.append("axis", currentFilters.axis);
      if (currentFilters.topic) params.append("topic", currentFilters.topic);
      if (currentFilters.direction)
        params.append("direction", currentFilters.direction);
      if (currentFilters.active) params.append("active", currentFilters.active);

      const response = await axios.get(`/api/questions?${params.toString()}`);

      if (response.data.success) {
        setQuestions(response.data.questions || []);
        // If pagination data is available in the response, use it, otherwise use default
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        throw new Error("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    const queryParams = { ...filters, page: 1 };

    // Remove empty filters
    Object.keys(queryParams).forEach((key) => {
      if (!queryParams[key]) delete queryParams[key];
    });

    router.push({
      pathname: "/admin/questions",
      query: queryParams,
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      axis: "",
      topic: "",
      direction: "",
      active: "",
    });

    router.push("/admin/questions");
  };

  // Handle page change
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;

    const queryParams = { ...router.query, page: newPage };
    router.push({
      pathname: "/admin/questions",
      query: queryParams,
    });
  };

  // Delete a question
  const deleteQuestion = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      const response = await axios.delete(`/api/questions/${deleteId}`);

      if (response.data.success) {
        // Remove the question from the list
        setQuestions(questions.filter((q) => q._id !== deleteId));

        // Update pagination if needed
        if (questions.length === 1 && pagination.page > 1) {
          changePage(pagination.page - 1);
        } else {
          // Just refresh the current page
          fetchQuestions(pagination.page);
        }

        setDeleteId(null);
      } else {
        throw new Error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      setError("Failed to delete question. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteId(null);
  };

  // Render loading state
  if (isLoading && !questions.length) {
    return (
      <AdminLayout title="Questions">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading questions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Questions">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          Manage Quiz Questions
        </h1>
        <Link
          href="/admin/questions/new"
          className="bg-primary-maroon hover:bg-primary-darkMaroon text-white py-2 px-4 rounded-md inline-flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Question
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <FaFilter className="text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Filter Questions</h2>
        </div>

        <form onSubmit={applyFilters}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label
                htmlFor="axis"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Axis
              </label>
              <select
                id="axis"
                name="axis"
                value={filters.axis}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon"
              >
                <option value="">All Axes</option>
                <option value="Equality vs. Markets">
                  Equality vs. Markets
                </option>
                <option value="Democracy vs. Authority">
                  Democracy vs. Authority
                </option>
                <option value="Progress vs. Tradition">
                  Progress vs. Tradition
                </option>
                <option value="Secular vs. Religious">
                  Secular vs. Religious
                </option>
                <option value="Globalism vs. Nationalism">
                  Globalism vs. Nationalism
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Topic
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={filters.topic}
                  onChange={handleFilterChange}
                  placeholder="Search by topic"
                  className="w-full rounded-md border border-gray-300 p-2 pl-9 focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="direction"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Direction
              </label>
              <select
                id="direction"
                name="direction"
                value={filters.direction}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon"
              >
                <option value="">All Directions</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="active"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="active"
                name="active"
                value={filters.active}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Reset Filters
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-secondary-darkBlue hover:bg-secondary-blue text-white rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Questions table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Topic
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
                  Weight
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.length > 0 ? (
                questions.map((question) => (
                  <tr key={question._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-normal max-w-xs">
                      <div className="text-sm font-medium text-gray-900">
                        {question.question}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {question.axis}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {question.topic}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          question.direction === "Left"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {question.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {question.weight}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          question.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {question.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/questions/${question._id}`}
                          className="text-secondary-darkBlue hover:text-secondary-blue"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(question._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No questions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> questions
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded-md ${
                pagination.page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              <FaChevronLeft size={14} />
            </button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pagination.pages ||
                  Math.abs(page - pagination.page) <= 1
              )
              .reduce((acc, page, i, arr) => {
                if (i > 0 && arr[i - 1] !== page - 1) {
                  acc.push("...");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={index}
                    onClick={() => changePage(page)}
                    className={`px-3 py-1 rounded-md ${
                      page === pagination.page
                        ? "bg-primary-maroon text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="px-1">
                    {page}
                  </span>
                )
              )}

            <button
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`px-3 py-1 rounded-md ${
                pagination.page === pagination.pages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteQuestion}
                disabled={isDeleting}
                className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md ${
                  isDeleting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin/questions",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
