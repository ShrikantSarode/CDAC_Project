import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Staff/css/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    approvedAppointments: 0,
    pendingAppointments: 0,
    revenue: 0,
    customers: 0,
    completedAppointments: 0,
  });
  const [staffName, setStaffName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const staffId = localStorage.getItem("userId"); // ✅ Fetch staffId
  console.log(staffId);
  

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token || !staffId) {
      handleLogout();
      return;
    }
    await fetchDashboardData();
    await fetchAppointments();
  };

  // ✅ Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(`staff/dashboard-stats?staffId=${staffId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(response.data);
      setStaffName(response.data.staffName || "Staff");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Staff Appointments
  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get(`staff/appointments?staffId=${staffId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments(response.data);
    } catch (error) {
      handleAuthError(error);
    }
  };

  // ✅ Handle Unauthorized Access
  const handleAuthError = (error) => {
    console.error("Error fetching data:", error);
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please log in again.");
      handleLogout();
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="dashboard-content">
        {/* 🔹 Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <span className="welcome-text">Hi, {staffName}</span>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <span>Logout</span>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>

        <div className="dashboard-title-section">
          <h4 className="dashboard-title">Staff Dashboard</h4>
          <div className="date-picker">
            <input type="date" className="custom-date-input" />
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Loading dashboard...</p>
        ) : (
          <>
            {/* 🔹 Dashboard Stats */}
            <div className="stats-container">
              {[
                { title: "Total Appointments", value: stats.totalAppointments, color: "#6366f1" },
                { title: "Approved Appointments", value: stats.approvedAppointments, color: "#10b981" },
                { title: "Pending Appointments", value: stats.pendingAppointments, color: "#f59e0b" },
                { title: "Revenue", value: `₹${stats.revenue}`, color: "#3b82f6" },
                { title: "Customers", value: stats.customers, color: "#8b5cf6" },
                { title: "Completed Appointments", value: stats.completedAppointments, color: "#ec4899" },
              ].map((stat, index) => (
                <div
                  className="stat-card"
                  key={index}
                  style={{ "--delay": `${index * 0.1}s` }}
                >
                  <h4 style={{ color: stat.color }}>{stat.value}</h4>
                  <p>{stat.title}</p>
                </div>
              ))}
            </div>

            {/* 🔹 Appointments Table */}
            <div className="appointments-section">
              <h4 className="section-title">Upcoming Appointments</h4>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td>{appointment.id}</td>
                          <td>{appointment.date}</td> {/* ✅ Fixed field name */}
                          <td>{appointment.customer || "Unknown"}</td> {/* ✅ Fixed field name */}
                          <td>
                            <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td>
                            <span className={`payment-badge ${appointment.paymentStatus.toLowerCase()}`}>
                              {appointment.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No Appointments Found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
