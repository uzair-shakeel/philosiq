import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Login() {
  // In a real app, you would implement actual authentication logic
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Redirect to Google OAuth flow
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
    // Redirect to Facebook OAuth flow
  };

  const handleTwitterLogin = () => {
    console.log("Twitter login clicked");
    // Redirect to Twitter OAuth flow
  };

  return (
    <Layout title="Login - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-600">
                Sign in to access your account and continue your political
                journey
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors duration-300"
              >
                <FaGoogle className="text-red-500" />
                <span>Continue with Google</span>
              </button>

              <button
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center gap-3 bg-[#3b5998] text-white py-3 px-4 rounded-md hover:bg-[#324b80] transition-colors duration-300"
              >
                <FaFacebook />
                <span>Continue with Facebook</span>
              </button>

              <button
                onClick={handleTwitterLogin}
                className="w-full flex items-center justify-center gap-3 bg-[#1da1f2] text-white py-3 px-4 rounded-md hover:bg-[#0d8ecf] transition-colors duration-300"
              >
                <FaTwitter />
                <span>Continue with Twitter</span>
              </button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">
                  Or sign in with email
                </span>
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-gray-700">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-primary-maroon hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="w-full btn-primary py-3">
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="#" className="text-primary-maroon hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
