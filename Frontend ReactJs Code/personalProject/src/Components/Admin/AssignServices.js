import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify"; // ✅ Import Toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Toast styles
import "./AssignServices.css";

export default function AssignServices() {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);

  // ✅ Fetch staff and services from the backend
  useEffect(() => {
    fetchStaff();
    fetchServices();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axiosInstance.get("/AssignServices/staff");
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("❌ Failed to load staff members.");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/AssignServices/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("❌ Failed to load services.");
    }
  };

  // ✅ Handle Service Assignment
  const handleServiceAssignment = async (e) => {
    e.preventDefault();

    if (!selectedStaff) {
      toast.warn("⚠ Please select a staff member!");
      return;
    }
    if (selectedServices.length === 0) {
      toast.warn("⚠ Please select at least one service to assign!");
      return;
    }

    try {
      await axiosInstance.post("/AssignServices/assign", {
        staffId: parseInt(selectedStaff),
        serviceIds: selectedServices,
      });

      fetchStaff(); // Refresh staff list
      setSelectedStaff("");
      setSelectedServices([]);
      toast.success("✅ Services assigned successfully!");
    } catch (error) {
      console.error("Error assigning services:", error);
      toast.error("❌ Error assigning services.");
    }
  };

  // ✅ Handle Service Removal
  const handleServiceRemoval = async (staffId, serviceName) => {
    if (!serviceName) {
      toast.error("❌ Service name is missing.");
      return;
    }

    // 🔍 Find the correct service ID
    const service = services.find((s) => s.name?.toLowerCase() === serviceName?.toLowerCase());

    if (!service) {
      toast.error("❌ Service not found in the list.");
      return;
    }

    try {
      await axiosInstance.delete("/AssignServices/remove", {
        headers: { "Content-Type": "application/json" },
        data: { staffId, serviceId: service.id }, // ✅ Ensure correct payload
      });

      fetchStaff(); // 🔄 Refresh staff list
      toast.success("✅ Service removed successfully!");
    } catch (error) {
      console.error("Error removing service:", error);
      toast.error(`❌ ${error.response?.data?.message || "Failed to remove service."}`);
    }
  };

  return (
    <div className="assign-services-container">
      {/* ✅ Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <h2>Assign Services to Staff</h2>

      <form onSubmit={handleServiceAssignment} className="assignment-form">
        <div className="form-group">
          <label>Select Staff Member:</label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="form-select"
          >
            <option value="">Choose staff member...</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <input
                type="checkbox"
                id={`service-${service.id}`}
                value={service.id}
                checked={selectedServices.includes(service.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedServices((prev) => [...prev, service.id]);
                  } else {
                    setSelectedServices((prev) => prev.filter((id) => id !== service.id));
                  }
                }}
              />
              <label htmlFor={`service-${service.id}`} className="service-label">
                <h3>{service.name}</h3>
                <p>Duration: {service.duration} mins</p>
                <p>Price: ₹{service.price}</p>
              </label>
            </div>
          ))}
        </div>

        <button type="submit" className="assign-button">
          Assign Services
        </button>
      </form>

      <div className="current-assignments">
        <h3>Current Assignments</h3>
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Assigned Services</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>
                  {member.expertise?.length > 0 ? (
                    member.expertise.map((service, index) => (
                      <div key={index} className="service-entry">
                        {service}{" "}
                        <button
                          onClick={() => handleServiceRemoval(member.id, service)}
                          className="remove-service-button"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    "No services assigned"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
