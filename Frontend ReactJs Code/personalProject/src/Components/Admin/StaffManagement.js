import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StaffManagement.css";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    fetchStaffList();
    fetchUsersList();
  }, []);

  // ✅ Fetch Staff List
  const fetchStaffList = async () => {
    try {
      const response = await axiosInstance.get("/staff", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff list:", error);
      toast.error("❌ Failed to load staff members.");
    }
  };

  // ✅ Fetch Users List
  const fetchUsersList = async () => {
    try {
      const response = await axiosInstance.get("/staff", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsersList(response.data);
    } catch (error) {
      console.error("Error fetching users list:", error);
      toast.error("❌ Failed to load users.");
    }
  };

  // ✅ Add Staff Member
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.warn("⚠ Please select a user!");
      return;
    }

    try {
      // Find the selected user
      const selectedUser = usersList.find((user) => user.id === parseInt(selectedUserId));
      if (!selectedUser) {
        toast.error("❌ Invalid user selected!");
        return;
      }

      // ✅ Send correct DTO format
      const staffPayload = {
        userId: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        phoneNumber: selectedUser.mobile
      };

      // ✅ API Call
      const response = await axiosInstance.post("/staff", staffPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.status === 200) {
        fetchStaffList();
        setSelectedUserId("");
        toast.success("✅ Staff member added successfully!");
      } else {
        toast.error(response.data.message || "❌ Failed to add staff.");
      }
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast.error(error.response?.data?.message || "❌ Staff already exist.");
    }
  };

  // ✅ Remove Staff Member
  const handleRemoveStaff = async (staffId) => {
    try {
      await axiosInstance.delete(`staff/${staffId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
  
      fetchStaffList();
      toast.success("✅ Staff member removed successfully!");
    } catch (error) {
      console.error("Error removing staff member:", error);
  
      // 🔴 Handle "Cannot delete staff with pending appointments!" error
      if (error.response && error.response.status === 400) {
        toast.warn(`⚠ ${error.response.data.message}`);
      } else {
        toast.error("❌ Cannot delete staff with pending appointments!");
      }
    }
  };
  

  return (
    <div className="staff-management-container">
      <h2 className="main-title">Staff Management</h2>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="staff-grid">
        <div className="staff-list-section">
          <h3 className="section-title">Staff List</h3>
          {staffList.length > 0 ? (
            <div className="staff-cards">
              {staffList.map((staff) => (
                <div key={staff.id} className="staff-card">
                  <div className="staff-avatar">{staff.name.charAt(0).toUpperCase()}</div>
                  <div className="staff-info">
                    <h4>{staff.name}</h4>
                    <p className="staff-email">{staff.email}</p>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemoveStaff(staff.id)}>
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-users"></i>
              <p>No staff members found.</p>
            </div>
          )}
        </div>

        <div className="add-staff-section">
          <h3 className="section-title">Add New Staff</h3>
          <form onSubmit={handleAddStaff} className="add-staff-form">
            <div className="form-group">
              <label>Select Staff from Users:</label>
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
                <option value="">Choose a Staff...</option>
                {usersList.map((user) => (
                  <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="add-btn">
              <i className="fas fa-plus"></i> Add Staff Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
