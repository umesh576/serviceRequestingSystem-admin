"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Wrench,
  Home,
  ChevronRight,
  Loader2,
} from "lucide-react";

// interface WorkerDetails {
//   id: number;
//   workerName: string;
//   workerEmail: string;
//   workerNumber: string;
//   description: string;
//   serviceProvide: string;
//   assignWorkId: number | null;
//   role: string | null;
// }

// interface AssignedWork {
//   id: number;
//   name: string;
//   address: string;
//   service: string;
//   date: string;
//   time: string;
//   phone: string;
//   status: string;
//   description: string;
// }

const WorkerDashBoard = () => {
  const params = useParams();
  const router = useRouter();
  const workerid = params.id;

  const [workerDetails, setWorkerDetails] = useState();
  const [assignedWork, setAssignedWork] = useState();
  const [loading, setLoading] = useState(true);
  const [workLoading, setWorkLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchWorkerById = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/worker/${workerid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setWorkerDetails(result);

          // If worker has assigned work, fetch it
          if (result.assignWorkId) {
            fetchAssignedWork(result.assignWorkId);
          }
        } else {
          toast.error("Failed to fetch worker details");
        }
      } catch (error) {
        toast.error("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerById();
  }, [workerid]);

  const fetchAssignedWork = async (assignWorkId) => {
    try {
      setWorkLoading(true);
      const response = await fetch(
        `http://localhost:8080/bookservices/${assignWorkId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAssignedWork(result);
      } else {
        toast.error("Failed to fetch assigned work");
      }
    } catch (error) {
      toast.error("Failed to load assigned work");
    } finally {
      setWorkLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("worker_token");
    localStorage.removeItem("worker_data");
    toast.success("Logged out successfully");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const updateWorkStatus = async (status) => {
    if (!assignedWork) return;

    try {
      const response = await fetch(
        `http://localhost:8080/bookservices/${assignedWork.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...assignedWork,
            status: status,
          }),
        }
      );

      if (response.ok) {
        setAssignedWork((prev) => (prev ? { ...prev, status } : null));
        toast.success(`Work marked as ${status.toLowerCase()}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Worker Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Professional Service Portal
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned Works</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workerDetails?.assignWorkId ? "1" : "0"}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Service Category</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workerDetails?.serviceProvide || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-2xl font-bold text-gray-900">Active</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24"></div>
              <div className="px-6 pb-6 -mt-12">
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {workerDetails?.workerName || "Worker Name"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {workerDetails?.description}
                  </p>
                  <span className="inline-block mt-3 px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {workerDetails?.serviceProvide || "Service Provider"}
                  </span>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{workerDetails?.workerEmail || "No email"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{workerDetails?.workerNumber || "No phone"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Worker ID: {workerDetails?.id || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("work")}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>View Assigned Work</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Work Schedule</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>Update Profile</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Work Details */}
          <div className="lg:col-span-2">
            {/* Work Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Assigned Work
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    assignedWork
                      ? assignedWork.status === "COMPLETED"
                        ? "bg-green-50 text-green-700"
                        : assignedWork.status === "IN_PROGRESS"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-blue-50 text-blue-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {assignedWork ? assignedWork.status : "NO WORK ASSIGNED"}
                </span>
              </div>

              {workLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading work details...</p>
                </div>
              ) : assignedWork ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Home className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Client Name
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {assignedWork.name}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Phone className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Contact</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {assignedWork.phone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Service Address
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {assignedWork.address}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Scheduled Date
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {assignedWork.date}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Scheduled Time
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {assignedWork.time}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Service Details
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 mb-2">
                      {assignedWork.service}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {assignedWork.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <button
                      onClick={() => updateWorkStatus("IN_PROGRESS")}
                      disabled={assignedWork.status === "IN_PROGRESS"}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        assignedWork.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-700 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
                      }`}
                    >
                      {assignedWork.status === "IN_PROGRESS"
                        ? "Work In Progress"
                        : "Start Work"}
                    </button>

                    <button
                      onClick={() => updateWorkStatus("COMPLETED")}
                      disabled={assignedWork.status === "COMPLETED"}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        assignedWork.status === "COMPLETED"
                          ? "bg-green-100 text-green-700 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                      }`}
                    >
                      {assignedWork.status === "COMPLETED"
                        ? "Work Completed"
                        : "Mark as Complete"}
                    </button>

                    <button
                      onClick={() => toast.info("Feature coming soon!")}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Work Assigned
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    You don&apos;t have any assigned work at the moment. Please
                    check back later or contact your supervisor.
                  </p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Profile Updated</p>
                    <p className="text-sm text-gray-600">
                      Your profile information was last updated
                    </p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>

                {assignedWork && (
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Briefcase className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Work Assigned</p>
                      <p className="text-sm text-gray-600">
                        {assignedWork.service} at {assignedWork.address}
                      </p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>
              © {new Date().getFullYear()} Service Worker Portal. All rights
              reserved.
            </p>
            <p className="mt-1">
              Worker ID: {workerDetails?.id} | Contact Support:
              support@serviceportal.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkerDashBoard;
