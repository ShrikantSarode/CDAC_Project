import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import "./UserCss/UserHeader.css";

export default function UserHeader() {
  const navigate = useNavigate(); 
  const [notifications, setNotifications] = useState(0);

  // ✅ Fetch Notifications Count
  useEffect(() => {
    axiosInstance
      .get("/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setNotifications(response.data.count || 0))
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.clear(); // Clear all session data
    navigate("/login"); // Redirect to login
  };

  return (
    <header className="user-header">
      <div className="header-container">
        {/* ✅ Logo */}
        <div className="logo-section">
          <h1>Groom Easy</h1>
          <span className="user-tag">Customer Portal</span>
        </div>

        {/* ✅ Navigation */}
        <nav className="user-nav">
          <ul className="nav-links">
            <li>
              <Link to="/user/user-fav" className="nav-link">
                <i className="fas fa-heart"></i> Favorite Services
              </Link>
            </li>
            <li>
              <Link to="/user/user-appointment" className="nav-link">
                <i className="fas fa-calendar-alt"></i> My Appointments
              </Link>
            </li>
            <li>
              <Link to="/user/user-order" className="nav-link">
                <i className="fas fa-calendar-alt"></i> My Orders
              </Link>
            </li>
            <li>
              <Link to="/user/user-profile" className="nav-link">
                <i className="fas fa-calendar-alt"></i> My Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* ✅ User Actions */}
        <div className="user-actions">
          {/* 🔔 Notification Bell with Dynamic Badge */}
          <div className="notification-bell">
            <i className="fas fa-bell"></i>
            {notifications > 0 && <span className="notification-badge">{notifications}</span>}
          </div>

          {/* 🔴 Logout Button */}
          <button className="btn btn-danger logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
