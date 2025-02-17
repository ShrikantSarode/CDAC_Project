import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../User/UserCss/Profile.css";

export default function Profile() {  // ✅ Renamed to 'Profile'
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    if (!customerId) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    try {
      const response = await axiosInstance.get(`/userprofile/profile/${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("❌ Failed to fetch profile!");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put(`/userprofile/${customerId}`, profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("❌ Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2>My Profile</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Mobile:</label>
          <input type="text" name="mobile" value={profile.mobile} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={profile.email} disabled />
        </div>
        <button type="submit" className="update-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
