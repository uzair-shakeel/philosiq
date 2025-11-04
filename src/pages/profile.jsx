import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaCrown,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaSync,
  FaSignOutAlt,
  FaHistory,
  FaUsers,
} from "react-icons/fa";
import SmallLoader from "../components/SmallLoader";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [user, setUser] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data from localStorage (your custom auth system)
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const usernameLS = localStorage.getItem("username") || "";

    if (!authToken || !userEmail) {
      console.log("Profile page - No auth token found, redirecting to login");
      // Store current URL for return after login
      if (typeof window !== "undefined") {
        const currentUrl = window.location.pathname + window.location.search;
        localStorage.setItem("returnUrl", currentUrl);
      }
      router.push("/login?redirect=profile");
      return;
    }

    const userData = {
      name: userName || "",
      email: userEmail || "",
      username: usernameLS,
    };

    setUser(userData);
    setProfileData((prev) => ({
      ...prev,
      name: userData.name,
      username: userData.username,
      email: userData.email,
    }));

    // Load subscription details
    loadSubscriptionDetails(userData.email);
  }, [router]);

  // Handle Stripe checkout return
  useEffect(() => {
    const { upgrade, session_id } = router.query;

    if (upgrade === "success" && session_id) {
      setSuccess(
        "Payment successful! Your Philosiq+ subscription is now active."
      );

      // Call confirm-session API like the results page does
      const confirmSession = async () => {
        try {
          await fetch(
            `/api/stripe/confirm-session?session_id=${encodeURIComponent(
              session_id
            )}`
          );

          // Reload subscription details after confirmation
          if (user?.email) {
            await loadSubscriptionDetails(user.email);
          }
        } catch (error) {
          console.error("Failed to confirm session:", error);
          setError(
            "Payment received but subscription activation failed. Please contact support."
          );
        }
      };

      confirmSession();

      // Clear the URL parameters
      router.replace("/profile", undefined, { shallow: true });
    } else if (upgrade === "success") {
      setSuccess(
        "Payment successful! Your Philosiq+ subscription is now active."
      );
      // Wait a moment for webhook to process, then reload subscription details
      setTimeout(() => {
        if (user?.email) {
          loadSubscriptionDetails(user.email);
        }
      }, 2000);
      // Clear the URL parameter
      router.replace("/profile", undefined, { shallow: true });
    } else if (upgrade === "cancel") {
      setError("Payment was cancelled. You can try again anytime.");
      // Clear the URL parameter
      router.replace("/profile", undefined, { shallow: true });
    }
  }, [router.query, user?.email]);

  // Load subscription details
  const loadSubscriptionDetails = async (email) => {
    if (!email) return;

    try {
      setLoadingSubscription(true);
      const response = await fetch(
        `/api/user/subscription-details?email=${encodeURIComponent(email)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSubscriptionDetails(data);
      }
    } catch (error) {
      console.error("Failed to load subscription details:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

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

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }

      // Prepare request payload
      const payload = {
        name: profileData.name,
        username: profileData.username,
        email: profileData.email,
      };

      if (profileData.newPassword) {
        payload.currentPassword = profileData.currentPassword;
        payload.newPassword = profileData.newPassword;
      }

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully");

        // Update local storage with new user info
        if (profileData.name) {
          localStorage.setItem("userName", profileData.name);
        }
        if (profileData.email) {
          localStorage.setItem("userEmail", profileData.email);
        }
        if (profileData.username !== undefined) {
          localStorage.setItem("username", profileData.username || "");
        }

        // Update local user state
        setUser((prev) => ({
          ...prev,
          name: profileData.name,
          email: profileData.email,
        }));

        // Clear password fields
        setProfileData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeToPlus = async () => {
    if (!user?.email) {
      setError("User email not found");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          successUrl: `${window.location.origin}/profile?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/profile?upgrade=cancel`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setError(error.message || "Failed to start checkout process");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    if (!user?.email) return;

    setLoadingSubscription(true);
    try {
      // Force reload subscription details
      await loadSubscriptionDetails(user.email);
      setSuccess(
        "Subscription status refreshed. If you just completed payment, please wait a moment for the system to update."
      );
    } catch (error) {
      console.error("Manual refresh failed:", error);
      setError("Failed to refresh subscription status");
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleManualActivation = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/activate-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          "Subscription manually activated! Please refresh the page to see the changes."
        );
        // Reload subscription details after a short delay
        setTimeout(() => {
          if (user?.email) {
            loadSubscriptionDetails(user.email);
          }
        }, 1000);
      } else {
        throw new Error(data.error || "Failed to activate subscription");
      }
    } catch (error) {
      console.error("Manual activation failed:", error);
      setError(error.message || "Failed to manually activate subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const openBillingPortal = async () => {
    // Direct-link to hosted Stripe portal login provided
    window.location.href = "https://billing.stripe.com/p/login/eVq5kD7Wt87w115cE99ws00";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <Layout title="Profile - Philosiq">
         <SmallLoader />
      </Layout>
    );
  }

  return (
    <Layout title="Profile - Philosiq">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and view subscription details
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md"
              role="alert"
            >
              <div className="flex items-center">
                <FaCheckCircle className="mr-2" />
                <p>{success}</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
              role="alert"
            >
              <div className="flex items-center">
                <FaTimesCircle className="mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaUser className="mr-3 text-primary-maroon" />
                  Profile Information
                </h2>

                <form onSubmit={updateProfile} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={profileData.username}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                        placeholder="Choose a unique username"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Usernames must be unique.</p>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FaLock className="mr-2 text-gray-600" />
                      Change Password (Optional)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={profileData.currentPassword}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="text-gray-400" />
                            ) : (
                              <FaEye className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={profileData.newPassword}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="text-gray-400" />
                            ) : (
                              <FaEye className="text-gray-400" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Password must be at least 6 characters long
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={profileData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="text-gray-400" />
                            ) : (
                              <FaEye className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-6 py-3 bg-primary-maroon hover:bg-primary-darkMaroon text-white rounded-lg font-medium flex items-center transition-colors duration-200 ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      <FaSave className="mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Account Info Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-maroon to-primary-darkMaroon flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {user?.name}
                  </h3>
                  <p className="text-gray-600">{user?.email}</p>
                  {profileData.username && (
                    <p className="text-gray-700 mt-1">@{profileData.username}</p>
                  )}
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                      User
                    </span>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      Member Since
                    </span>
                    <span className="font-medium text-gray-900">
                      {subscriptionDetails?.since
                        ? new Date(
                            subscriptionDetails.since
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="text-green-600 font-medium flex items-center">
                      <FaCheckCircle className="mr-1" />
                      Active
                    </span>
                  </div>
                </div>

                <hr className="my-4" />

                <button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("userName");
                    router.push("/");
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>

                <hr className="my-4" />

                {/* Quiz History Button */}
                <button
                  onClick={() => router.push("/history")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 mb-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <FaHistory className="mr-2" />
                  Quiz History
                </button>

                {/* Compare Results Button */}
                <button
                  onClick={() => router.push("/compare")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <FaUsers className="mr-2" />
                  Compare Results
                </button>
              </div>

              {/* Subscription Status */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaCrown className="mr-2 text-yellow-500" />
                    Subscription Status
                  </h3>
                  <button
                    onClick={handleManualRefresh}
                    disabled={loadingSubscription}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    title="Refresh subscription details"
                  >
                    <FaSync
                      className={`text-sm ${
                        loadingSubscription ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>

                {loadingSubscription ? (
                  <div className="flex items-center justify-center py-4">
                    <SmallLoader />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      {subscriptionDetails?.active ? (
                        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <FaCrown className="text-3xl text-yellow-500 mx-auto mb-2" />
                          <h4 className="text-lg font-semibold text-yellow-800 mb-1">
                            Philosiq+ Active
                          </h4>
                          <p className="text-yellow-700 text-sm">
                            You have access to all premium features
                          </p>
                          {subscriptionDetails.since && (
                            <p className="text-yellow-600 text-xs mt-2">
                              Member since{" "}
                              {formatDate(subscriptionDetails.since)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="text-gray-400 text-3xl mb-2">👤</div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-1">
                            Free Account
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">
                            Upgrade to Philosiq+ for premium features
                          </p>
                          <button
                            onClick={handleUpgradeToPlus}
                            disabled={isLoading}
                            className="w-full bg-primary-maroon hover:bg-primary-darkMaroon text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center mb-3"
                          >
                            {isLoading ? (
                              <>
                                <SmallLoader />
                                Processing...
                              </>
                            ) : (
                              "Upgrade to Plus"
                            )}
                          </button>
                          <button
                            onClick={handleManualRefresh}
                            disabled={loadingSubscription}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center mb-2"
                          >
                            {loadingSubscription ? (
                              <>
                                <SmallLoader  />
                                Refreshing...
                              </>
                            ) : (
                              "Refresh Status"
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Subscription Details */}
                    {subscriptionDetails?.active && (
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h5 className="font-medium text-gray-900 text-sm">
                          Subscription Details
                        </h5>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Current Period Start:
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatDate(
                                subscriptionDetails.currentPeriodStart
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Current Period End{subscriptionDetails?.autoRenews === false ? " - Expiring" : " - Auto-Renews"}:
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatDate(subscriptionDetails.currentPeriodEnd)}
                            </span>
                          </div>
                          {subscriptionDetails?.autoRenews === false && (
                            <div className="text-[11px] text-gray-600 text-right">
                              Access will continue until this date and then end unless renewed.
                            </div>
                          )}
                        </div>

                        {/* Subscription Management Buttons */}
                        <div className="pt-3 space-y-2">
                          <button
                            onClick={openBillingPortal}
                            disabled={isLoading}
                            className="w-full bg-primary-maroon hover:bg-primary-darkMaroon text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center"
                          >
                            {isLoading ? (
                              <>
                                <SmallLoader />
                                Processing...
                              </>
                            ) : (
                              "Cancel Subscription"
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Compare Results</span>
                        <span
                          className={
                            subscriptionDetails?.active
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          {subscriptionDetails?.active
                            ? "✓ Available"
                            : "✗ Plus Only"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Advanced Analytics
                        </span>
                        <span
                          className={
                            subscriptionDetails?.active
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          {subscriptionDetails?.active
                            ? "✓ Available"
                            : "✗ Plus Only"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Axis-Specific Analysis
                        </span>
                        <span
                          className={
                            subscriptionDetails?.active
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          {subscriptionDetails?.active
                            ? "✓ Available"
                            : "✗ Plus Only"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Export Data</span>
                        <span
                          className={
                            subscriptionDetails?.active
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          {subscriptionDetails?.active
                            ? "✓ Available"
                            : "✗ Plus Only"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
