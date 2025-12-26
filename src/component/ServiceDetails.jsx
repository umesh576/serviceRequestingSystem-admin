import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ServiceCard from "./card/ServiceCard";

const ServiceDetails = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/services/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          toast.error("Failed to fetch services");
        }
      } catch (error) {
        toast.error("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  if (!services.length) {
    return <div className="text-center py-8">No services available</div>;
  }

  return (
    <div className="service-container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id || service._id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServiceDetails;
