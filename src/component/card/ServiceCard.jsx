import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ServiceCard = ({ service, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/services/delete/${service.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast.success("Service deleted successfully!");
        onDelete?.(service.id);
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Service Image with Next.js Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.serviceImage}
          alt={service.serviceName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Rest of the component remains the same */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 truncate">
            {service.serviceName}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            {service.location?.locationName || "N/A"}
          </span>
        </div>

        <p className="text-gray-600 mb-3 line-clamp-2 h-12">
          {service.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ${service.price.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-end">
          {showConfirm ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Confirm delete?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "..." : "Yes"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
