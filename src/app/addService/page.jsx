"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AddServiceForm = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/locations/");
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        toast.error("Failed to load locations");
      }
    } catch (error) {
      toast.error("Network error loading locations");
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Convert types properly
      formDataToSend.append("serviceName", formData.serviceName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", parseFloat(formData.price));
      formDataToSend.append("locationId", parseInt(formData.locationId, 10));

      // Image is required by your backend
      if (imageFile) {
        formDataToSend.append("imageFile", imageFile);
      } else {
        // Send empty file if not provided
        const emptyBlob = new Blob([""], { type: "image/jpeg" });
        formDataToSend.append("imageFile", emptyBlob, "placeholder.jpg");
      }

      console.log("=== Sending to /api/services/create ===");

      // ✅ CORRECT URL with /create
      const response = await fetch(
        "http://localhost:8080/api/services/create",
        {
          method: "POST",
          body: formDataToSend,
          // NO headers for FormData
        }
      );

      console.log("Response Status:", response.status);

      const responseText = await response.text();
      console.log("Response Body:", responseText);

      if (response.ok) {
        const result = JSON.parse(responseText);
        toast.success("Service created successfully!");
        reset();
        setImageFile(null);
        setImagePreview("");
        router.push("/dashboard");
      } else {
        try {
          const errorJson = JSON.parse(responseText);
          toast.error(`Error: ${errorJson.message || "Unknown error"}`);
        } catch {
          toast.error(`Error: ${responseText || "HTTP " + response.status}`);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Service</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Service Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Name *
          </label>
          <input
            type="text"
            {...register("serviceName", {
              required: "Service name is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.serviceName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Computer Technician"
          />
          {errors.serviceName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.serviceName.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
              minLength: { value: 10, message: "Minimum 10 characters" },
            })}
            rows="3"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe the service in detail..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., 1000.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <select
            {...register("locationId", { required: "Location is required" })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.locationId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.locationName || `Location ${location.id}`}
              </option>
            ))}
          </select>
          {errors.locationId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.locationId.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Image
          </label>
          <div className="space-y-4">
            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Service...
              </span>
            ) : (
              "Create Service"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceForm;
