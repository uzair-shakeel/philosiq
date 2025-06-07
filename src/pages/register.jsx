import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
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
    <Layout title="Register - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Create Account
            </h1>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Name
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  <FaUser className="text-gray-400 mr-2" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full focus:outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  <FaEnvelope className="text-gray-400 mr-2" />
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
                    placeholder="Create a password"
                    required
                    minLength={6}
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
                {isLoading ? "Creating account..." : "Register"}
              </button>
            </form>

            <div className="mt-4 text-center text-gray-600">
              <p>
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary hover:text-primary-dark"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
