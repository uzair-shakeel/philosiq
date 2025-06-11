import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { redirect } = router.query;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setDebugInfo(null);

    try {
      console.log("Attempting login with:", { email, hasPassword: !!password });

      // Try both API endpoints - the direct one and the catch-all
      const requestData = { email, password };

      // First try the catch-all route which is more likely to work in production
      let response;
      let responseText;
      let success = false;

      // List of endpoints to try in order
      const endpoints = [
        "/api/auth/login", // Try direct endpoint first
        "/api/auth/login/", // Some servers need trailing slash
        "/api/auth/login", // The catch-all route
      ];

      let lastError = null;

      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        if (success) break;

        try {
          const apiUrl = new URL(endpoint, window.location.origin).href;
          console.log(`Trying endpoint: ${apiUrl}`);

          response = await fetch(apiUrl, {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(requestData),
          });

          console.log(`Response from ${endpoint}:`, response.status);

          // Get the response text
          responseText = await response.text();
          console.log(
            `Response text from ${endpoint}:`,
            responseText.substring(0, 100)
          );

          // If response is ok and contains data, consider it successful
          if (response.ok && responseText) {
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error with endpoint ${endpoint}:`, err);
          lastError = err;
        }
      }

      // If all endpoints failed, throw the last error
      if (!success && lastError) {
        throw lastError;
      }

      // Parse the response text
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        setDebugInfo({
          status: response?.status,
          headers: response
            ? Object.fromEntries([...response.headers.entries()])
            : {},
          text: responseText,
        });
        throw new Error(
          `Non-JSON response: ${responseText?.substring(0, 100)}`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      console.log("Login successful");

      // Store the auth token but don't clear other localStorage items
      localStorage.setItem("authToken", data.token);

      // Redirect to the specified page or home page
      if (redirect) {
        router.push(`/${redirect}`);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Login - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">User Login</h1>

            {redirect === "results" && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6">
                Log in to save your quiz results and track your political
                journey over time.
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {debugInfo && (
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-6 text-xs overflow-auto max-h-40">
                <p>
                  <strong>Status:</strong> {debugInfo.status}
                </p>
                <p>
                  <strong>Headers:</strong>{" "}
                  {JSON.stringify(debugInfo.headers, null, 2)}
                </p>
                <p>
                  <strong>Response:</strong> {debugInfo.text}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  <FaUser className="text-gray-400 mr-2" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  <FaLock className="text-gray-400 mr-2" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full focus:outline-none"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 text-white rounded ${
                  isLoading
                    ? "bg-primary-maroon/70 cursor-not-allowed"
                    : "bg-primary-maroon hover:bg-primary-darkMaroon"
                } transition-colors`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-4 text-center text-gray-600">
              <p>
                Don't have an account?{" "}
                <a
                  href={
                    redirect ? `/register?redirect=${redirect}` : "/register"
                  }
                  className="text-primary hover:text-primary-dark"
                >
                  Register
                </a>
              </p>
              <p className="mt-2">
                <a
                  href="/forgot-password"
                  className="text-primary hover:text-primary-dark"
                >
                  Forgot Password?
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
