import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

// ✅ Status and Payment Color Mapping
const STATUS_COLORS = {
  confirmed: "success",
  pending: "warning",
  cancelled: "danger",
  completed: "info",
};

const PAYMENT_STATUS_COLORS = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "secondary",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    totalStaff: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [adminName, setAdminName] = useState("Admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleId = localStorage.getItem("roleId");
    const userEmail = localStorage.getItem("userEmail");
    if (!token || roleId !== "1" || !userEmail) {
      navigate("/login");
      return;
    }
    fetchAdminDetails(userEmail);
    fetchDashboardStats();
    fetchAppointments();
  }, []);

  const fetchAdminDetails = async (email) => {
    try {
      const response = await axiosInstance.get(`admin/admin-details/${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdminName(response.data?.name || "Admin");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axiosInstance.get("admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDashboardData(response.data || {});
    } catch (error) {
      handleAuthError(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get("admin/appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments(response.data || []);
      setFilteredAppointments(response.data || []);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    console.error("API Error:", error);
    if (error.response && error.response.status === 401) {
      alert("Session expired. Please log in again.");
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ Handle Search Filter
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
    <div className="dashboard-container container-fluid p-0">
      <div className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          {[
            { to: "/admin/admin-dashboard", icon: "fa-home", text: "Dashboard" },
            { to: "/admin/staff-management", icon: "fa-users", text: "Staff Management" },
            { to: "/admin/services-management", icon: "fa-concierge-bell", text: "Services" },
            { to: "/admin/appointments-management", icon: "fa-calendar-check", text: "Appointments" },
            {/* { to: "/admin/customers", icon: "fa-user-friends", text: "Customers" },
            { to: "/admin/reports", icon: "fa-chart-bar", text: "Reports" },
            { to: "/admin/settings", icon: "fa-cog", text: "Settings" },
            { to: "/admin/edit-services", icon: "fa-edit", text: "Edit Services" }, */}
          ].map(({ to, icon, text }) => (
            <NavLink key={to} to={to} className="nav-item" onClick={() => setIsSidebarOpen(false)}>
              <i className={`fas ${icon}`}></i> {text}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="admin-info">
            <span>Welcome, {adminName}</span>
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="stats-container">
          {[
            { icon: "fa-calendar-check", value: dashboardData.totalAppointments, text: "Total Appointments" },
            { icon: "fa-users", value: dashboardData.totalStaff, text: "Total Staff" },
            { icon: "fa-user-friends", value: dashboardData.totalCustomers, text: "Total Customers" },
            { icon: "fa-dollar-sign", value: `₹${dashboardData.totalRevenue}`, text: "Total Revenue" },
          ].map(({ icon, value, text }) => (
            <div key={text} className="stat-card">
              <i className={`fas ${icon} stat-icon`}></i>
              <div className="stat-info">
                <h3>{value || 0}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Filters */}
        <div className="filter-container">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} className="search-input" />
          <input type="date" value={selectedDate} onChange={handleDateFilter} className="date-filter" />
        </div>

        {/* ✅ Appointment Table */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Staff</th>
                <th>Services</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.customer || "N/A"}</td>
                    <td>{appointment.staff || "Not Assigned"}</td>
                    <td>{appointment.services?.length ? appointment.services.map((s) => s.name).join(", ") : "N/A"}</td>
                    <td><span className={`badge bg-${STATUS_COLORS[appointment.status] || "secondary"}`}>{appointment.status}</span></td>
                    <td><span className={`badge bg-${PAYMENT_STATUS_COLORS[appointment.paymentStatus] || "warning"}`}>{appointment.paymentStatus}</span></td>
                  </tr>
                ))
              ) : <tr><td colSpan="7" className="text-center">No Appointments Found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
