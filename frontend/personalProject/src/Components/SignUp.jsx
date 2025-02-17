import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import axios from "axios";
import "./css/Signup.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [roleId, setRoleId] = useState(3);
  const [error, setError] = useState(""); // Ensure error is a string
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !mobile) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7277/api/User/register",
        {
          name,
          email,
          password,
          mobile,
          roleId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Sign up successful! Redirecting to login...");
        setTimeout(() => {
          setEmail("");
          setPassword("");
          setName("");
          setMobile("");
          setError("");
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      // ✅ Fix: Check if error response exists and is an object
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";

      setError(errorMessage); // ✅ Store only the string message
      toast.error(errorMessage);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label htmlFor="mobile">Mobile</label>
              <input type="text" id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter your mobile number" required />
            </div>
            <div className="form-group">
              <label htmlFor="roleId">Role</label>
              <select id="roleId" value={roleId} onChange={(e) => setRoleId(parseInt(e.target.value))} required>
                <option value="1">Admin</option>
                <option value="2">Staff</option>
                <option value="3">Customer</option>
              </select>
            </div>
          </div>
          {/* ✅ Fix: Ensure only a string is rendered */}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </div>
  );
}
