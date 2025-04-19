import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "../../components/AdminLayout";
import Link from "next/link";
import {
  FaQuestionCircle,
  FaChartBar,
  FaPlus,
  FaList,
  FaEdit,
  FaClock,
} from "react-icons/fa";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    axisCounts: [],
    directionCounts: [],
    weightCounts: [],
    topTopics: [],
    recentQuestions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/questions/stats");
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          throw new Error("Failed to fetch stats");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format date for readability
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-maroon hover:bg-primary-darkMaroon text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaQuestionCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Questions
              </p>
              <p className="text-2xl font-bold">{stats.totalQuestions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaChartBar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Question Axes</p>
              <p className="text-2xl font-bold">{stats.axisCounts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <FaClock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Recent Activity
              </p>
              <p className="text-2xl font-bold">
                {stats.recentQuestions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FaList size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Topics</p>
              <p className="text-2xl font-bold">{stats.topTopics.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/questions/new"
          className="bg-primary-maroon hover:bg-primary-darkMaroon text-white rounded-lg shadow p-6 flex items-center transition-colors"
        >
          <FaPlus size={24} className="mr-4" />
          <div>
            <h3 className="font-bold text-lg">Add New Question</h3>
            <p className="text-sm opacity-90">Create a new quiz question</p>
          </div>
        </Link>

        <Link
          href="/admin/questions"
          className="bg-secondary-darkBlue hover:bg-secondary-blue text-white rounded-lg shadow p-6 flex items-center transition-colors"
        >
          <FaList size={24} className="mr-4" />
          <div>
            <h3 className="font-bold text-lg">View All Questions</h3>
            <p className="text-sm opacity-90">Manage existing questions</p>
          </div>
        </Link>

        <Link
          href="/admin/stats"
          className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow p-6 flex items-center transition-colors"
        >
          <FaChartBar size={24} className="mr-4" />
          <div>
            <h3 className="font-bold text-lg">View Statistics</h3>
            <p className="text-sm opacity-90">Analyze quiz performance</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Questions */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4">
            <h2 className="font-bold text-lg">Recently Added Questions</h2>
          </div>
          <div className="p-6">
            {stats.recentQuestions.length > 0 ? (
              <div className="space-y-4">
                {stats.recentQuestions.map((day, index) => (
                  <div
                    key={index}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="text-sm text-gray-500 mb-2">{day._id}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        {day.count} questions
                      </span>
                      <Link
                        href={`/admin/questions?date=${day._id}`}
                        className="text-primary-maroon hover:underline flex items-center text-sm font-medium"
                      >
                        <FaEdit className="mr-1" size={14} /> View/Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent questions found
              </p>
            )}
          </div>
        </div>

        {/* Top Topics */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4">
            <h2 className="font-bold text-lg">Top Topics</h2>
          </div>
          <div className="p-6">
            {stats.topTopics.length > 0 ? (
              <div className="space-y-4">
                {stats.topTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="ml-3 font-medium">{topic._id}</span>
                    </div>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {topic.count} question{topic.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No topics found</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // if (!session || session.user.role !== "admin") {
  //   return {
  //     redirect: {
  //       destination: "/auth/signin?callbackUrl=/admin",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
}
