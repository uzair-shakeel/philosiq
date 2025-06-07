import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      router.push("/");
    } catch (err) {
      setError(err.message);
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

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                {error}
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
                  href="/register"
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
