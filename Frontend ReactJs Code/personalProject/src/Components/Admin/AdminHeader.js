import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminHeader() {
  return (
    <header style={headerStyle}>
      <h1>Admin Dashboard</h1>
      <nav style={navStyle}>
        <NavLink to="/admin/admin-dashboard" style={linkStyle} activeStyle={activeLinkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/staff-management" style={linkStyle} activeStyle={activeLinkStyle}>
          Staff Management
        </NavLink>
        <NavLink to="/admin/appointments-management" style={linkStyle} activeStyle={activeLinkStyle}>
          Appointments
        </NavLink>
        <NavLink to="/admin/admin-assign" style={linkStyle} activeStyle={activeLinkStyle}>
          Services
        </NavLink>
      
      </nav>
    </header>
  );
}

// Basic styling for the header and navigation links
const headerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "10px 20px",
};

const navStyle = {
  display: "flex",
  gap: "20px",
  marginTop: "10px",
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
};

const activeLinkStyle = {
  fontWeight: "bold",
  textDecoration: "underline",
};
