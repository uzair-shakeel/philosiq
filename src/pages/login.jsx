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

      // Use the direct endpoint that should be properly routed now
      const requestData = { email, password };
      const apiUrl = new URL("/api/auth/login", window.location.origin).href;

      console.log("Sending login request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("Login response status:", response.status);

      // Get the response text
      const responseText = await response.text();

      // Try to parse the response as JSON
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        setDebugInfo({
          status: response.status,
          headers: Object.fromEntries([...response.headers.entries()]),
          text: responseText,
        });
        throw new Error(`Non-JSON response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      console.log("Login successful");

      // Store the auth token
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
