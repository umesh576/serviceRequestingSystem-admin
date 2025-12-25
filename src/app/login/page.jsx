"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log("data", data);
    try {
      // Make API call to login endpoint
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // if (response.data.success && response.data.user) {
      // Check if user is admin
      // if (response.data.user.role === "admin") {
      //   toast.success("Login successful! Redirecting to dashboard...");

      //   // Store user data in localStorage or context (for demo purposes)
      //   localStorage.setItem("user", JSON.stringify(response.data.user));
      //   localStorage.setItem("token", response.data.token || "");

      //   // Redirect to dashboard after a short delay
      //   setTimeout(() => {
      //     router.push("/dashboard");
      //   }, 1500);
      // } else {
      //   // User is not admin
      //   toast.error("Only administrators can access this application.");
      // }
      const responseUser = await response.json();
      console.log("response", responseUser);

      if (responseUser.user.role === "ADMIN") {
        console.log("admintoken", responseUser.token);
        localStorage.setItem("adminToken", responseUser.token);
        router.push("/dashboard");
      } else {
        toast.error("Only Admin can access this app.");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 401) {
          toast.error("Invalid email or password. Please try again.");
        } else if (error.response.status === 404) {
          toast.error("Login endpoint not found. Please contact support.");
        } else {
          toast.error(
            `Login failed: ${error.response.data?.message || "Server error"}`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login is not implemented yet.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Toast Container */}
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

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Branding & Info */}
        <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">SH</span>
              </div>
              <h1 className="text-2xl font-bold">Service Hub</h1>
            </div>

            <h2 className="text-3xl font-bold mb-6">Admin Portal</h2>
            <p className="text-blue-100 mb-8">
              This is the administrative portal for Service Hub. Only authorized
              administrators can access this system to manage service requests
              and users.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm">🔒</span>
                </div>
                <span>Secure admin access only</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm">📊</span>
                </div>
                <span>Comprehensive dashboard analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm">👑</span>
                </div>
                <span>Role-based access control</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-blue-500">
            <p className="text-blue-200 text-sm">
              Having trouble?{" "}
              <Link
                href="/support"
                className="text-white font-semibold hover:underline"
              >
                Contact system administrator
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-3/5 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-right mb-6">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Forgot admin password?
              </Link>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Admin Login
              </h2>
              <p className="text-gray-600">
                Sign in with your administrator credentials
              </p>
            </div>

            {/* Social Login Buttons (Optional for Admin) */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <button
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <FaGoogle className="text-red-500" />
                <span className="text-sm hidden sm:inline">Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <FaGithub className="text-gray-800" />
                <span className="text-sm hidden sm:inline">GitHub</span>
              </button>
              <button
                onClick={() => handleSocialLogin("linkedin")}
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <FaLinkedin className="text-blue-600" />
                <span className="text-sm hidden sm:inline">LinkedIn</span>
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or sign in with credentials
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="admin@servicehub.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Remember this device
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In as Admin"
                )}
              </button>

              {/* Get Started Button */}
              <button
                type="button"
                onClick={() => {
                  toast.info("Please login with admin credentials first.");
                }}
                disabled={isLoading}
                className={`w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Get Started</span>
                  <span>→</span>
                </div>
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  By signing in, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Admin Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
                <div className="flex justify-center gap-6 text-sm">
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    About System
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Admin Support
                  </Link>
                  <Link
                    href="/audit"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Audit Logs
                  </Link>
                </div>

                {/* Demo Credentials Note */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Email: admin@servicehub.com
                    <br />
                    Password: admin123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
