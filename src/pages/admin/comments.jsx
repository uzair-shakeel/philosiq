import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "../../components/AdminLayout";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaFlag,
  FaReply,
  FaChevronRight,
  FaChevronLeft,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";

export default function CommentsManagement() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reply modal
  const [replyToId, setReplyToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load comments on component mount and page change
  useEffect(() => {
    fetchComments(pagination.page);
  }, [pagination.page]);

  // Fetch comments
  const fetchComments = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would fetch from an API
      // const response = await axios.get(`/api/comments?page=${page}&limit=${pagination.limit}`);
      // setComments(response.data.comments);
      // setPagination(response.data.pagination);

      // Simulated data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockComments = [
        {
          _id: "1",
          user: {
            name: "John Doe",
            email: "john@example.com",
          },
          comment:
            "This quiz helped me understand my political views better. I never realized I leaned so libertarian!",
          createdAt: new Date("2023-06-15"),
          status: "approved",
          archetype: "The Patriot",
          flagged: false,
          replied: true,
        },
        {
          _id: "2",
          user: {
            name: "Jane Smith",
            email: "jane@example.com",
          },
          comment:
            "I'm not sure if the questions were biased, but I got results that seemed a bit off to me.",
          createdAt: new Date("2023-06-20"),
          status: "pending",
          archetype: "The Reformer",
          flagged: true,
          replied: false,
        },
        {
          _id: "3",
          user: {
            name: "Mike Johnson",
            email: "mike@example.com",
          },
          comment:
            "Great website! I've shared it with all my politically-minded friends.",
          createdAt: new Date("2023-06-25"),
          status: "approved",
          archetype: "The Guardian",
          flagged: false,
          replied: false,
        },
        {
          _id: "4",
          user: {
            name: "Sarah Williams",
            email: "sarah@example.com",
          },
          comment:
            "This is offensive content that should be removed immediately!",
          createdAt: new Date("2023-06-30"),
          status: "rejected",
          archetype: "The Zealot",
          flagged: true,
          replied: true,
        },
      ];

      setComments(mockComments);
      setPagination({
        page,
        limit: 10,
        total: 20, // Mock total
        pages: 2, // Mock pages
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Handle page change
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Confirm deletion
  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteId(null);
  };

  // Delete comment
  const deleteComment = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    setError("");
    setSuccess("");

    try {
      // In a real implementation, you would call an API
      // await axios.delete(`/api/comments/${deleteId}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove from list
      setComments((prev) => prev.filter((comment) => comment._id !== deleteId));
      setSuccess("Comment deleted successfully");
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  // Open reply modal
  const openReplyModal = (id) => {
    setReplyToId(id);
    setReplyText("");
  };

  // Close reply modal
  const closeReplyModal = () => {
    setReplyToId(null);
    setReplyText("");
  };

  // Submit reply
  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // In a real implementation, you would call an API
      // await axios.post(`/api/comments/${replyToId}/reply`, { text: replyText });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update in list
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === replyToId ? { ...comment, replied: true } : comment
        )
      );

      setSuccess("Reply sent successfully");
      closeReplyModal();
    } catch (error) {
      console.error("Error sending reply:", error);
      setError("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update comment status
  const updateCommentStatus = async (id, status) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // In a real implementation, you would call an API
      // await axios.put(`/api/comments/${id}/status`, { status });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update in list
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === id ? { ...comment, status } : comment
        )
      );

      setSuccess(
        `Comment ${
          status === "approved" ? "approved" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating comment status:", error);
      setError("Failed to update comment status");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchComments(1);
    // In a real implementation, you would include search term in API call
  };

  // Filtered comments based on search term
  const filteredComments = searchTerm
    ? comments.filter(
        (comment) =>
          comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comment.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : comments;

  // Render loading state
  if (isLoading && comments.length === 0) {
    return (
      <AdminLayout title="Comment Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading comments...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Comment Management">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          Manage User Comments
        </h1>
      </div>

      {/* Messages */}
      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          role="alert"
        >
          <p>{success}</p>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search comments, users, or emails"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-secondary-darkBlue hover:bg-secondary-blue text-white rounded-md"
          >
            Search
          </button>
        </form>
      </div>

      {/* Comments table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Comment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Archetype
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
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
              {filteredComments.length > 0 ? (
                filteredComments.map((comment) => (
                  <tr
                    key={comment._id}
                    className={`hover:bg-gray-50 ${
                      comment.flagged ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {comment.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {comment.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs break-words">
                        {comment.comment}
                        {comment.flagged && (
                          <span className="ml-2 text-red-500 inline-flex items-center">
                            <FaFlag className="mr-1" /> Flagged
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {comment.archetype}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          comment.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : comment.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {comment.status === "approved" ? (
                          <>
                            <FaCheck className="mr-1 mt-0.5" />
                            Approved
                          </>
                        ) : comment.status === "rejected" ? (
                          <>
                            <FaTimes className="mr-1 mt-0.5" />
                            Rejected
                          </>
                        ) : (
                          <>Pending</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {comment.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateCommentStatus(comment._id, "approved")
                              }
                              disabled={isSubmitting}
                              className="text-green-600 hover:text-green-800"
                              title="Approve"
                            >
                              <FaCheck size={18} />
                            </button>
                            <button
                              onClick={() =>
                                updateCommentStatus(comment._id, "rejected")
                              }
                              disabled={isSubmitting}
                              className="text-red-600 hover:text-red-800"
                              title="Reject"
                            >
                              <FaTimes size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openReplyModal(comment._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Reply"
                        >
                          <FaReply size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(comment._id)}
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
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No comments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing page {pagination.page} of {pagination.pages}
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

            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  i + 1 === pagination.page
                    ? "bg-primary-maroon text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

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
              Are you sure you want to delete this comment? This action cannot
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
                onClick={deleteComment}
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

      {/* Reply modal */}
      {replyToId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Reply to Comment</h3>
            <form onSubmit={submitReply}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                rows="4"
                placeholder="Type your reply here..."
                required
              ></textarea>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={closeReplyModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !replyText.trim()}
                  className={`px-4 py-2 bg-primary-maroon hover:bg-primary-darkMaroon text-white rounded-md ${
                    isSubmitting || !replyText.trim()
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // if (!session || session.user.role !== "admin") {
  //   return {
  //     redirect: {
  //       destination: "/auth/signin?callbackUrl=/admin/comments",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
}
