import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Custom404() {
  return (
    <Layout title="Page Not Found - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-maroon">404</h1>
          <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className="btn-primary text-lg px-8 py-3">
            Return Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
