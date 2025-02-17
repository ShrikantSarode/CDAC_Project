import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify"; // ✅ Import Toast
import "react-toastify/dist/ReactToastify.css";
import "./AppointmentManagement.css";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Fetch Appointments from Backend
  const fetchAppointments = () => {
    axiosInstance
      .get("appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        toast.error("❌ Error loading appointments.");
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, []); // ✅ Runs once on component mount

  // ✅ Update Appointment Status (Confirm/Cancel)
  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(
        `appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success(`✅ Appointment ${status} successfully!`);
      fetchAppointments(); // ✅ Refresh appointments after update
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("❌ Error updating appointment status.");
    }
  };

  // ✅ Handle Search Input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterAppointments(e.target.value, selectedDate);
  };

  // ✅ Handle Date Filter
  const handleDateFilter = (e) => {
    setSelectedDate(e.target.value);
    filterAppointments(searchTerm, e.target.value);
  };

  // ✅ Filter Appointments Based on Search & Date
  const filterAppointments = (search, date) => {
    let filtered = appointments;

    if (search) {
      filtered = filtered.filter(
        (apt) =>
          apt.customer.toLowerCase().includes(search.toLowerCase()) ||
          apt.staff.toLowerCase().includes(search.toLowerCase()) ||
          apt.status.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (date) {
      filtered = filtered.filter((apt) => apt.date === date);
    }

    setFilteredAppointments(filtered);
  };

  return (
    <div className="appointment-management">
      <h2>Appointment Management</h2>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ✅ Search & Filter Controls */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Customer, Staff, or Status"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateFilter}
          className="date-filter"
        />
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="appointments-container">
          <div className="appointment-grid">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className={`appointment-card ${apt.status}`}>
                <h4>Customer: {apt.customer || "N/A"}</h4>
                <p>
                  <strong>Services:</strong>{" "}
                  {apt.services && apt.services.length > 0
                    ? apt.services.map((s) => `${s.name} (${s.duration})`).join(", ")
                    : "No Service Selected"}
                </p>
                <p>Staff: {apt.staff || "Not Assigned"}</p>
                <p>Date: {apt.date}</p>
                <p>Time: {apt.appointmentTime}</p>
                <p>Status: <strong>{apt.status}</strong></p>
                <div className="btn-group">
                  {apt.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(apt.id, "confirmed")} className="confirm-btn">
                        Confirm
                      </button>
                      <button onClick={() => updateStatus(apt.id, "cancelled")} className="cancel-btn">
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
