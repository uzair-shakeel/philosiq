import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "../../../components/AdminLayout";
import axios from "axios";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
  FaTrash,
  FaSpinner,
  FaFilter,
  FaExclamationTriangle,
  FaRegEnvelopeOpen,
  FaCheck,
  FaChevronDown,
} from "react-icons/fa";
import Link from "next/link";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 10,
  });

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterMenu && !event.target.closest(".filter-menu-container")) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterMenu]);

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, [pagination.page, filter]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/contact?page=${pagination.page}&limit=${pagination.limit}`;
      if (filter !== "all") {
        url += `&status=${filter}`;
      }

      console.log("Fetching messages from:", url);
      const response = await axios.get(url);
      console.log("Messages API response:", response.data);

      if (response.data.success) {
        setMessages(response.data.messages);
        setPagination(response.data.pagination);
        console.log("Messages set in state:", response.data.messages.length);
      } else {
        throw new Error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // View a message
  const viewMessage = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/contact/${id}`);

      if (response.data.success) {
        setSelectedMessage(response.data.message);
        // Update the message in the list to show it as read
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, status: "read" } : msg))
        );
      } else {
        throw new Error("Failed to fetch message details");
      }
    } catch (error) {
      console.error("Error fetching message details:", error);
      setError("Failed to load message details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Mark as responded after Gmail opens
  const markAsResponded = async (id) => {
    try {
      const response = await axios.put(`/api/contact/${id}`, {
        status: "responded",
        response: "Responded via Gmail",
      });

      if (response.data.success) {
        // Update messages list
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === id ? { ...msg, status: "responded" } : msg
          )
        );

        // Update selected message if it's the current one
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage({
            ...selectedMessage,
            status: "responded",
            response: "Responded via Gmail",
            respondedAt: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error("Error marking message as responded:", error);
      setError("Failed to update message status. Please try again.");
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    try {
      const response = await axios.delete(`/api/contact/${id}`);

      if (response.data.success) {
        // Remove message from list
        setMessages((prev) => prev.filter((msg) => msg._id !== id));

        // If deleted message was selected, clear selection
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }

        // Clear delete confirmation
        setDeleteConfirm(null);
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      setError("Failed to delete message. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  // Change page
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "unread":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaEnvelope className="mr-1" /> Unread
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaRegEnvelopeOpen className="mr-1" /> Read
          </span>
        );
      case "responded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheck className="mr-1" /> Responded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout title="Contact Messages">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Contact Messages</h1>

        <div className="flex items-center">
          <div className="relative inline-block text-left filter-menu-container">
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <FaFilter className="mr-2" />
              Filter:{" "}
              {filter === "all"
                ? "All Messages"
                : filter === "unread"
                ? "Unread"
                : filter === "read"
                ? "Read"
                : "Responded"}
              <FaChevronDown className="ml-2" />
            </button>
            {showFilterMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10">
                <div className="py-1">
                  <button
                    className={`${
                      filter === "all"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                    onClick={() => {
                      setFilter("all");
                      setShowFilterMenu(false);
                      fetchMessages();
                    }}
                  >
                    All Messages
                  </button>
                  <button
                    className={`${
                      filter === "unread"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                    onClick={() => {
                      setFilter("unread");
                      setShowFilterMenu(false);
                      fetchMessages();
                    }}
                  >
                    Unread
                  </button>
                  <button
                    className={`${
                      filter === "read"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                    onClick={() => {
                      setFilter("read");
                      setShowFilterMenu(false);
                      fetchMessages();
                    }}
                  >
                    Read
                  </button>
                  <button
                    className={`${
                      filter === "responded"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                    onClick={() => {
                      setFilter("responded");
                      setShowFilterMenu(false);
                      fetchMessages();
                    }}
                  >
                    Responded
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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

      {/* Loading indicator */}
      {loading && !messages.length && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      )}

      {/* No messages */}
      {!loading && !messages.length && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-5xl text-gray-300 mb-4">
            <FaEnvelope className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Messages Found
          </h3>
          <p className="text-gray-500 mb-4">
            There are no contact messages to display.
          </p>
          <button
            onClick={() => {
              setFilter("all");
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-4 py-2 bg-primary-maroon hover:bg-primary-darkMaroon text-white rounded-md"
          >
            View All Messages
          </button>
        </div>
      )}

      {/* Messages list and details */}
      {messages.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-w-full">
          {/* Messages list */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
              <div className="border-b px-4 py-3 bg-gray-50">
                <h2 className="font-semibold text-gray-700">
                  Messages ({pagination.total})
                </h2>
              </div>
              <ul
                className="divide-y divide-gray-100 overflow-y-auto flex-grow"
                style={{ maxHeight: "calc(100vh - 240px)" }}
              >
                {messages.map((message) => (
                  <li
                    key={message._id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition duration-150 ${
                      selectedMessage && selectedMessage._id === message._id
                        ? "bg-gray-50 border-l-4 border-primary-maroon"
                        : ""
                    }`}
                    onClick={() => viewMessage(message._id)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3
                        className={`font-medium truncate ${
                          message.status === "unread" ? "font-bold" : ""
                        }`}
                      >
                        {message.status === "unread" && (
                          <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-2"></span>
                        )}
                        {message.name}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-1 truncate">
                      {message.email}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-700 truncate max-w-[70%]">
                        {message.subject}
                      </p>
                      {getStatusBadge(message.status)}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                  <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-3 py-1 rounded ${
                      pagination.page === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`px-3 py-1 rounded ${
                      pagination.page === pagination.pages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Message details */}
          <div className="lg:col-span-7 xl:col-span-8">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-md h-full flex flex-col overflow-hidden">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                  <h2 className="font-semibold text-lg truncate max-w-[70%]">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Open Gmail with pre-filled email
                        const subject = `Re: ${selectedMessage.subject}`;
                        const body = `\n\n\n-----Original Message-----\nFrom: ${selectedMessage.name} <${selectedMessage.email}>\nSubject: ${selectedMessage.subject}\n\n${selectedMessage.message}`;
                        const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${
                          selectedMessage.email
                        }&subject=${encodeURIComponent(
                          subject
                        )}&body=${encodeURIComponent(body)}`;
                        window.open(mailtoUrl, "_blank");

                        // Mark as responded
                        markAsResponded(selectedMessage._id);
                      }}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                      title="Reply via Gmail"
                    >
                      <FaReply />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(selectedMessage._id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div
                  className="p-6 flex-grow overflow-y-auto"
                  style={{ maxHeight: "calc(100vh - 240px)" }}
                >
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedMessage.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedMessage.email}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                        {formatDate(selectedMessage.createdAt)}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>

                  {selectedMessage.status === "responded" && (
                    <div className="mt-8">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Your Response
                      </h4>
                      <div className="bg-blue-50 rounded-lg p-4 mb-2">
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                          {selectedMessage.response}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic">
                        Responded on {formatDate(selectedMessage.respondedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center h-full flex flex-col justify-center items-center">
                <div className="text-5xl text-gray-300 mb-4">
                  <FaEnvelopeOpen className="mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Message Selected
                </h3>
                <p className="text-gray-500">
                  Select a message from the list to view its details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center text-red-500 mb-4">
                <FaExclamationTriangle className="text-xl mr-2" />
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              </div>
              <p className="mb-4">
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMessage(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
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
  //       destination: "/auth/signin?callbackUrl=/admin/contact",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
}
