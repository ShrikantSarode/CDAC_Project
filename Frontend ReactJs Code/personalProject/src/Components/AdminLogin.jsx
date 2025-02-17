import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Retrieve stored admin credentials from localStorage
    const storedEmail = localStorage.getItem("adminEmail");
    const storedPassword = localStorage.getItem("adminPassword");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Check credentials against stored values
    if (email === storedEmail && password === storedPassword) {
      // Store admin authentication token/data if needed
      localStorage.setItem("adminAuth", "true");

      // Navigate to admin dashboard on successful login
      navigate("/admin/admin-dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    // Redirect to appropriate login page based on role
    if (selectedRole === "user") {
      navigate("/login");
    } else if (selectedRole === "staff") {
      navigate("/staff-login");
    }
    // If "admin" is selected, stay on the current page
  };

  return (
    <div className="text-center d-flex justify-content-center">
      <div className="login-form text-center mt-5">
        <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>

        {error && <div className="error-message text-danger">{error}</div>}

        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={handleRoleChange}
            />
            User Login
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={handleRoleChange}
            />
            Admin Login
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="staff"
              checked={role === "staff"}
              onChange={handleRoleChange}
            />
            Staff Login
          </label>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="forgot-password mt-3">
          <Link to="/forgot-password">Forgot Password?</Link>
          <br />
          <Link className="mt-3" to="/admin-signup">
            I don't have an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
