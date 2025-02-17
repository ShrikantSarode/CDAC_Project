import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/AppointmentStaff.css";

const AppointmentStaff = () => {
  const [appointments, setAppointments] = useState([]);

  // ✅ Fetch Appointments from Backend
  const fetchAppointments = () => {
    axiosInstance
      .get("/appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // 🔒 Include Token
      })
      .then((response) => setAppointments(response.data))
      .catch((error) => console.error("Error fetching appointments:", error));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Update Appointment Status (Complete/Cancel)
  const updateStatus = (id, status) => {
    axiosInstance
      .patch(
        `/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        toast.success(`✅ Appointment ${status} successfully!`);
        fetchAppointments();
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        toast.error("❌ Error updating appointment status.");
      });
  };

  return (
    <div className="appointment-staff">
      <h2>Staff Appointment Management</h2>
      <ToastContainer position="top-right" autoClose={2000} />

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="appointments-container">
          <div className="appointment-grid">
            {appointments.map((apt) => (
              <div key={apt.id} className={`appointment-card ${apt.status}`}>
                <h4>Customer: {apt.customerName}</h4>
                <p>Service: {apt.serviceName}</p>
                <p>Date: {apt.appointmentDate}</p>
                <p>Time: {apt.appointmentTime}</p>
                <p>Status: <strong>{apt.status}</strong></p>
                <p>Payment: <strong>{apt.paymentStatus}</strong></p>
                <button onClick={() => updateStatus(apt.id, "confirmed")} className="confirm-btn">
                Confirm
                </button>
                <button onClick={() => updateStatus(apt.id, "cancelled")} className="cancel-btn">
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentStaff;
