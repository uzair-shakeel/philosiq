import React, { useState } from "react";
import Layout from "../components/Layout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const r = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("If the email exists, a reset link was sent.");
    } catch (e) {
      setStatus("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Forgot Password - Philosiq">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Forgot Password
            </h1>
            {status && (
              <div className="mb-4 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {status}
              </div>
            )}
            <form onSubmit={submit}>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                disabled={loading}
                className="w-full py-2 px-4 text-white rounded bg-primary-maroon hover:bg-primary-darkMaroon"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
