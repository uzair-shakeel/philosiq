import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "../../components/AdminLayout";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaLock,
  FaUser,
} from "react-icons/fa";
import axios from "axios";

export default function AdminsManagement() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // Admin form
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    active: true,
  });

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Fetch admins
  const fetchAdmins = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would fetch from an API
      // const response = await axios.get("/api/admins");
      // setAdmins(response.data.admins);

      // Simulated data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAdmins([
        {
          _id: "1",
          name: "Admin User",
          email: "admin@philosiq.com",
          role: "admin",
          active: true,
          createdAt: new Date("2023-01-01"),
          lastLogin: new Date(),
        },
        {
          _id: "2",
          name: "John Smith",
          email: "john@example.com",
          role: "admin",
          active: true,
          createdAt: new Date("2023-03-15"),
          lastLogin: new Date("2023-08-10"),
        },
      ]);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Failed to load admins. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
      active: true,
    });
    setCurrentAdminId(null);
    setFormMode("add");
  };

  // Open form for adding
  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing
  const openEditForm = (admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "", // Don't show password
      role: admin.role,
      active: admin.active,
    });
    setCurrentAdminId(admin._id);
    setFormMode("edit");
    setShowForm(true);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (formMode === "add") {
        // Validate required fields
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error("All fields are required");
        }

        // In a real implementation, you would call an API
        // const response = await axios.post("/api/admins", formData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add to list with simulated ID
        const newAdmin = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date(),
          lastLogin: null,
        };

        setAdmins((prev) => [newAdmin, ...prev]);
        setSuccess("Admin created successfully");
      } else {
        // Validate required fields
        if (!formData.name || !formData.email) {
          throw new Error("Name and email are required");
        }

        // In a real implementation, you would call an API
        // const response = await axios.put(`/api/admins/${currentAdminId}`, formData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update in list
        setAdmins((prev) =>
          prev.map((admin) =>
            admin._id === currentAdminId ? { ...admin, ...formData } : admin
          )
        );
        setSuccess("Admin updated successfully");
      }

      // Close form and reset
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting admin:", error);
      setError(error.message || "Failed to save admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm admin deletion
  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteId(null);
  };

  // Delete admin
  const deleteAdmin = async () => {
    if (!deleteId) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // In a real implementation, you would call an API
      // await axios.delete(`/api/admins/${deleteId}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove from list
      setAdmins((prev) => prev.filter((admin) => admin._id !== deleteId));
      setSuccess("Admin deleted successfully");
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError("Failed to delete admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  // Render loading state
  if (isLoading && admins.length === 0) {
    return (
      <AdminLayout title="Manage Admins">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading administrators...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Admins">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          Manage Administrators
        </h1>
        <button
          onClick={openAddForm}
          className="bg-primary-maroon hover:bg-primary-darkMaroon text-white py-2 px-4 rounded-md inline-flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Admin
        </button>
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

      {/* Admin form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {formMode === "add"
              ? "Add New Administrator"
              : "Edit Administrator"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                    placeholder="Administrator name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                    placeholder="Administrator email"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password{" "}
                  {formMode === "add" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                    placeholder={
                      formMode === "edit"
                        ? "Leave blank to keep current"
                        : "Administrator password"
                    }
                    required={formMode === "add"}
                  />
                </div>
                {formMode === "edit" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to keep the current password
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                >
                  <option value="admin">Administrator</option>
                  <option value="super">Super Admin</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-maroon focus:ring-primary-maroon border-gray-300 rounded"
                />
                <label
                  htmlFor="active"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Active account
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-primary-maroon hover:bg-primary-darkMaroon text-white rounded-md ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting
                  ? "Saving..."
                  : formMode === "add"
                  ? "Add Admin"
                  : "Update Admin"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Administrator
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Login
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
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-maroon flex items-center justify-center text-white">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.role === "super"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {admin.role === "super"
                          ? "Super Admin"
                          : "Administrator"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.active ? (
                          <>
                            <FaCheck className="mr-1 mt-0.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <FaTimes className="mr-1 mt-0.5" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(admin.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(admin.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditForm(admin)}
                          className="text-secondary-darkBlue hover:text-secondary-blue"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(admin._id)}
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
                    No administrators found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this administrator? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteAdmin}
                disabled={isSubmitting}
                className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
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
        destination: "/auth/signin?callbackUrl=/admin/admins",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
