"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDetails from "@/component/UserDetails";
import ServiceDetails from "@/component/ServiceDetails";
import BookedService from "@/component/BookedService";
import Maintainence from "@/component/Maintainence";
import ViewWorker from "@/component/ViewWorker";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [whichService, setWhichService] = useState("manageService");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/");
  };
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/login");
    }
    console.log("adminToken", adminToken);
    const validateToken = async () => {
      const res = await fetch(
        `http://localhost:8080/api/auth/validate?token=${adminToken}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        if (result.user.role == "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } else {
        console.log("token expired");
        router.push("/login");
      }
    };
    validateToken();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <header className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Service Hub Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.name || user?.email || "Admin"}!
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <p className="font-semibold">{user?.name || "Administrator"}</p>
                <p className="text-sm text-gray-500">{user?.role || "Admin"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Service Requests</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">1,247</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
          </div>
          <p className="text-green-600 text-sm mt-4">↑ 12% from last month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Requests</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">42</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
          <p className="text-green-600 text-sm mt-4">↓ 8% from yesterday</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Today</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">18</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
          <p className="text-green-600 text-sm mt-4">↑ 23% from yesterday</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">User Satisfaction</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">94%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">😊</span>
            </div>
          </div>
          <p className="text-green-600 text-sm mt-4">↑ 2% from last month</p>
        </div>
      </div>
      <div className="w-full flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-200 shadow-sm min-h-screen p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Dashboard</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setWhichService("viewUser")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                whichService === "viewUser"
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              View Users
            </button>

            <button
              onClick={() => setWhichService("manageService")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                whichService === "manageService"
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Manage Services
            </button>

            <button
              onClick={() => setWhichService("bookedService")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                whichService === "bookedService"
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Booked Services
            </button>
            <button
              onClick={() => setWhichService("updateService")}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Manage Requests
            </button>

            <button
              onClick={() => setWhichService("updateService")}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Overall Performance
            </button>

            <button
              onClick={() => setWhichService("updateService")}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Economic Performance
            </button>

            <button
              onClick={() => setWhichService("viewWorker")}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              View Workers
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {whichService === "viewUser" && "User Management"}
              {whichService === "manageService" && "Service Management"}
              {whichService === "bookedService" && "Booked Services"}
            </h1>
            <p className="text-gray-600 mt-1">
              {whichService === "viewUser" &&
                "View and manage all user accounts"}
              {whichService === "manageService" &&
                "Create, edit, and manage services"}
              {whichService === "bookedService" &&
                "Monitor and manage booked services"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {whichService === "viewUser" && (
              <div>
                <UserDetails />
              </div>
            )}
            {whichService === "manageService" && (
              <div>
                <ServiceDetails />
              </div>
            )}
            {whichService === "bookedService" && (
              <div>
                <BookedService />
              </div>
            )}
            {whichService === "updateService" && (
              <div>
                <Maintainence />
              </div>
            )}
            {whichService === "viewWorker" && (
              <div>
                <ViewWorker />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
