import React, { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import AdminLayout from "../../components/AdminLayout";
import { FaUser, FaEnvelope, FaLock, FaSave } from "react-icons/fa";
import axios from "axios";

export default function AdminProfile() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data when session is available
  useEffect(() => {
    if (session?.user) {
      setProfileData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords if the user is trying to change their password
    if (profileData.newPassword) {
      if (profileData.newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      if (profileData.newPassword !== profileData.confirmPassword) {
        setError("Passwords don't match");
        setIsLoading(false);
        return;
      }

      if (!profileData.currentPassword) {
        setError("Current password is required to change password");
        setIsLoading(false);
        return;
      }
    }

    // Prepare request payload
    const payload = {
      name: profileData.name,
      email: profileData.email,
    };

    if (profileData.newPassword) {
      payload.currentPassword = profileData.currentPassword;
      payload.newPassword = profileData.newPassword;
    }

    console.log("Sending profile update with payload:", payload);

    try {
      // Call the API endpoint to update profile
      const response = await axios.put("/api/admin/profile", payload);
      console.log("Profile update response:", response.data);

      if (response.data.success) {
        setSuccess(response.data.message || "Profile updated successfully");

        // Update the session with new user info
        await update({
          ...session,
          user: {
            ...session.user,
            name: profileData.name,
            email: profileData.email,
          },
        });

        // Clear password fields
        setProfileData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Admin Profile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      {/* Success message */}
      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 break-words"
          role="alert"
        >
          <p>{success}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 break-words"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>

              <h3 className="font-medium text-gray-700 mt-6 pt-4 border-t">
                Change Password (optional)
              </h3>

              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={profileData.currentPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                    placeholder="Current password"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                    placeholder="New password"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Passwords must be at least 6 characters long
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-primary-maroon hover:bg-primary-darkMaroon text-white rounded-md flex items-center ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <FaSave className="mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Account Info Sidebar */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-6 flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-primary-maroon flex items-center justify-center text-white text-3xl font-bold mb-3">
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <h3 className="text-lg font-semibold">{session?.user?.name}</h3>
              <p className="text-gray-500">{session?.user?.email}</p>
              <div className="mt-2">
                <span className="bg-secondary-darkBlue text-white text-xs px-2 py-1 rounded-full">
                  {session?.user?.role || "Admin"}
                </span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="text-sm">
              <p className="flex justify-between mb-2">
                <span className="text-gray-500">Account Created</span>
                <span className="font-medium">Jan 1, 2023</span>
              </p>
              <p className="flex justify-between mb-2">
                <span className="text-gray-500">Last Login</span>
                <span className="font-medium">Today</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin/profile",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
