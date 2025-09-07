import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus("Passwords do not match");
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const r = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.message || "Failed");
      setStatus("Password updated. Redirecting to login...");
      // Redirect to login after successful password update
      try {
        window.localStorage.removeItem("authToken");
      } catch {}
      router.push("/login?reset=success");
    } catch (e) {
      setStatus(e.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Reset Password - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Reset Password
            </h1>
            {status && (
              <div className="mb-4 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {status}
              </div>
            )}
            <form onSubmit={submit}>
              <label className="block text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <label className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mb-6"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
              />
              <button
                disabled={loading || !token}
                className="w-full py-2 px-4 text-white rounded bg-primary-maroon hover:bg-primary-darkMaroon"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
