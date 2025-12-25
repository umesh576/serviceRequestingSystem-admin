import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Shield,
  Copy,
  Check,
  MoreVertical,
  Star,
  MessageSquare,
  CreditCard,
  Activity,
} from "lucide-react";

const UserCard = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPhone = (number) => {
    const phoneStr = number.toString();
    return `${phoneStr.slice(0, 3)}-${phoneStr.slice(3, 6)}-${phoneStr.slice(
      6
    )}`;
  };

  const getTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard
      .writeText(text.toString())
      .then(() => {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 1500);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "from-purple-500 to-pink-500";
      case "USER":
        return "from-blue-500 to-cyan-500";
      case "WORKER":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200";
      case "USER":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200";
      case "WORKER":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300";
    }
  };

  const getStatusDot = (otp) => {
    return otp ? (
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    ) : (
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
    );
  };

  return (
    <div className="relative group">
      {/* Copy Success Toast */}
      {copiedField && (
        <div className="absolute top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Copied {copiedField}!</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Card Header with Gradient */}
        <div
          className={`bg-gradient-to-r ${getRoleColor(user.role)} p-6 relative`}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </button>

            {showActions && (
              <div className="absolute top-10 right-0 w-48 bg-white rounded-lg shadow-xl border py-2 z-40 animate-fade-in">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  View Transactions
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  View Activity
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-700" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white flex items-center justify-center">
                {getStatusDot(user.otp)}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                        user.role
                      )} backdrop-blur-sm`}
                    >
                      {user.role}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                      <span className="text-white/90 text-xs">
                        ID: {user.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-6 pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.bookServiceId ? "1" : "0"}
              </div>
              <div className="text-xs text-gray-500 mt-1">Active Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.otp ? "✓" : "✗"}
              </div>
              <div className="text-xs text-gray-500 mt-1">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {getTimeSince(user.dob).charAt(0)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Member Since</div>
            </div>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="p-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                  <button
                    onClick={() => copyToClipboard(user.email, "email")}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPhone(user.number)}
                  </p>
                  <button
                    onClick={() => copyToClipboard(user.number, "phone")}
                    className="text-xs text-green-600 hover:text-green-800 mt-1 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.location}
                  </p>
                  <div className="text-xs text-gray-500 mt-1">Location</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(user.dob)}
                  </p>
                  <div className="text-xs text-gray-500 mt-1">
                    Date of Birth
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Section Toggle */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all group"
          >
            <span className="text-sm font-medium text-gray-700">
              {isExpanded ? "Show Less" : "View More Details"}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600 group-hover:translate-y-[-2px] transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600 group-hover:translate-y-[2px] transition-transform" />
            )}
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 animate-slide-down">
            <div className="space-y-6">
              {/* Service Information */}
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Service Information
                    </h3>
                    <p className="text-sm text-gray-500">
                      Current service bookings
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Service ID</p>
                    <p className="text-lg font-bold text-gray-900">
                      {user.bookServiceId
                        ? `#${user.bookServiceId}`
                        : "No active service"}
                    </p>
                  </div>
                  {user.bookServiceId && (
                    <button
                      onClick={() =>
                        copyToClipboard(user.bookServiceId, "service ID")
                      }
                      className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 border border-indigo-200 transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy ID
                    </button>
                  )}
                </div>
              </div>

              {/* Security Status */}
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Security Status
                    </h3>
                    <p className="text-sm text-gray-500">
                      Account verification & security
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        OTP Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.otp
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.otp ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Account Type
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => console.log("View user details:", user.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">View Profile</span>
                </button>

                <button
                  onClick={() => console.log("Edit user:", user.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <Edit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Edit</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 1000px;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UserCard;
