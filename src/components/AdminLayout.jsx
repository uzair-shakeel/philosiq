import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import SmallLoader from "./SmallLoader";
import {
  FaHome,
  FaQuestion,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlus,
  FaList,
  FaGlobe,
  FaEnvelope,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const isActive = (path) => {
    return router.pathname === path
      ? "bg-primary-maroon text-white"
      : "text-gray-700 hover:bg-gray-100";
  };

  // If not authenticated and not loading, redirect to login
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push(
        "/auth/signin?callbackUrl=" + encodeURIComponent(router.asPath)
      );
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="text-center">
          <SmallLoader size={48} className="mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Show empty div if not authenticated (will redirect)
  if (status !== "authenticated") {
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-neutral-light flex flex-col">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-primary-maroon">
              PhilosiQ Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-700 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin"
                className={`flex items-center px-4 py-2 rounded-md ${isActive(
                  "/admin"
                )}`}
              >
                <FaHome className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/questions"
                className={`flex items-center px-4 py-2 rounded-md ${isActive(
                  "/admin/questions"
                )}`}
              >
                <FaList className="mr-3" />
                Questions
              </Link>
            </li>
            <li>
              <Link
                href="/admin/questions/new"
                className={`flex items-center px-4 py-2 rounded-md ${isActive(
                  "/admin/questions/new"
                )}`}
              >
                <FaPlus className="mr-3" />
                Add Question
              </Link>
            </li>
            <li>
              <Link
                href="/admin/short-quiz"
                className={`flex items-center px-4 py-2 rounded-md ${isActive(
                  "/admin/short-quiz"
                )}`}
              >
                <FaCog className="mr-3" />
                Short Quiz Config
              </Link>
            </li>
            <li>
              <Link
                href="/admin/mindmap"
                className={`flex items-center px-4 py-2 rounded-md ${isActive(
                  "/admin/mindmap"
                )}`}
              >
                <FaChartBar className="mr-3" />
                MindMap Data
              </Link>
            </li>
            {/* <li>
              <Link
                href="/admin/stats"
                className={`flex items-center px-4 py-2 rounded-md ${isActive(
                  "/admin/stats"
                )}`}
              >
                <FaChartBar className="mr-3" />
                Statistics
              </Link>
            </li> */}
            <li>
              <Link
                href="/admin/contact"
                className={`flex items-center px-4 py-2 rounded-md ${isActive(
                  "/admin/contact"
                )}`}
              >
                <FaEnvelope className="mr-3" />
                Contact Messages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/icons"
                className={`flex items-center px-4 py-2 rounded-md ${isActive(
                  "/admin/icons"
                )}`}
              >
                <FaUserCircle className="mr-3" />
                Icons
              </Link>
            </li>
            <li>
              <Link
                href="/admin/admins"
                className={`flex items-center px-4 py-2 rounded-md ${isActive(
                  "/admin/admins"
                )}`}
              >
                <FaUser className="mr-3" />
                Manage Admins
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGlobe className="mr-3" />
                View Site
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="flex items-center w-full px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <FaSignOutAlt className="mr-3" />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen overflow-hidden">
        {/* Header */}
        <header className="z-10 bg-white shadow-sm h-16 flex items-center">
          <div className="container-custom flex w-full items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-700 lg:hidden"
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              {title}
            </h1>
            <div className="flex items-center">
              <div className="mr-2 text-right hidden sm:block">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary-maroon flex items-center justify-center text-white">
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 container-custom py-6 px-4 max-w-full overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-4">
          <div className="container-custom px-4">
            <p className="text-sm text-gray-500 text-center">
              &copy; {new Date().getFullYear()} PhilosiQ Admin Panel. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
