import React, { useState, useEffect } from "react";
import "../Staff/StaffPofile.css";

export default function StaffProfile() {
  const [staffData, setStaffData] = useState({
    name: "Shrikant",
    role: "Facial",
    email: "shrikant@company.com",
    profilePic: "https://via.placeholder.com/150",
    department: "Facial",
    employeeId: "EMP001",
  });

  return (
    <div className="staff-profile-container mt-5">
      <div className="profile-header">
        <img
          src={staffData.profilePic}
          alt={staffData.name}
          className="profile-picture"
        />
        <h2 className="display-name">{staffData.name}</h2>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span className="label">Role:</span>
          <span>{staffData.role}</span>
        </div>
        <div className="detail-item">
          <span className="label">Email:</span>
          <span>{staffData.email}</span>
        </div>
        <div className="detail-item">
          <span className="label">Department:</span>
          <span>{staffData.department}</span>
        </div>
        <div className="detail-item">
          <span className="label">Employee ID:</span>
          <span>{staffData.employeeId}</span>
        </div>
      </div>
    </div>
  );
}
