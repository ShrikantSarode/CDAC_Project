import React from "react";
import { NavLink } from "react-router-dom";

export default function StaffHeader() {
  return (
    <header style={headerStyle}>
      <h1 style={logoStyle}>Staff Portal</h1>
      <nav style={navStyle}>
        <NavLink to="/staff/staff-dashboard" style={linkStyle} activeStyle={activeLinkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/staff/staff-appointments" style={linkStyle} activeStyle={activeLinkStyle}>
          Appointments
        </NavLink>
        {/* <NavLink to="/staff/staff-customers" style={linkStyle} activeStyle={activeLinkStyle}>
          Customer
        </NavLink> */}
        <NavLink to="/staff/staff-payment" style={linkStyle} activeStyle={activeLinkStyle}>
          Payment
        </NavLink>
        <NavLink to="/staff/staff-profile" style={linkStyle} activeStyle={activeLinkStyle}>
          My Profile
        </NavLink>
        <NavLink to="/" style={linkStyle} activeStyle={activeLinkStyle}>
          Home
        </NavLink>
      </nav>
    </header>
  );
}

// Styling for the header and navigation links
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "#fff",
};

const logoStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
};

const navStyle = {
  display: "flex",
  gap: "15px",
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "1rem",
};

const activeLinkStyle = {
  fontWeight: "bold",
  textDecoration: "underline",
};
