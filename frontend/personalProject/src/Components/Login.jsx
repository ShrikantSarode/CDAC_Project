import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import axiosInstance from "./config/axiosConfig";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Prevent duplicate requests
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validate Inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("⚠ Please fill in all fields.");
      toast.error("⚠ Please fill in all fields!");
      return;
    }

    try {
      setLoading(true); // ✅ Prevent multiple API calls

      const loginData = { email: trimmedEmail, password: trimmedPassword };

      const response = await axiosInstance.post("/User/login", loginData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const { message, userId, roleId, token } = response.data;

        // ✅ Store User Info Securely
        localStorage.setItem("userEmail", trimmedEmail);
        localStorage.setItem("userId", userId);
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("token", token);

        // ✅ Show Success Message
        toast.success("🎉 Login successful! Redirecting...", {
          position: "top-center",
          autoClose: 2000,
        });

        // ✅ Redirect Based on Role
        setTimeout(() => {
          switch (parseInt(roleId)) {
            case 1:
              navigate("/admin/admin-dashboard");
              break;
            case 2:
              navigate("/staff/staff-dashboard");
              break;
            case 3:
              navigate("/user/user-appointment");
              break;
            default:
              navigate("/"); // Fallback to Home if role is unknown
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Login Error:", error);

      // ✅ Handle API Errors
      const errorMessage =
        error.response?.data?.message || "❌ Invalid email or password!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false); // ✅ Allow another attempt
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <ToastContainer /> {/* ✅ Toast Notifications */}
      <div className="login-form p-4 shadow rounded">
        <h2 className="text-center">Login</h2>

        {/* ✅ Error Message */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/forgot-password" className="d-block">Forgot Password?</Link>
          <Link to="/signup">I don't have an Account 🤦‍♂️</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
