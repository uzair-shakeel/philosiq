import React from "react";
import { useRouter } from "next/router";

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Authentication Required
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          You need to be logged in to access this page.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-primary-maroon text-white rounded hover:bg-primary-darkMaroon transition-colors"
          >
            Login
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
