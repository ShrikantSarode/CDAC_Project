import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Components/css/ForgetPassword.css";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      toast.error("Please enter your email address!");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Invalid email format!");
      return;
    }

    try {
      setTimeout(() => {
        setMessage("Password reset link has been sent to your email.");
        toast.success("Reset link sent successfully! Check your email.");
        setError("");
        setEmail("");
      }, 1000);
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="forget-password-container">
      <div className="form-box">
        <h2 className="title">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="forget-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="submit-btn">
            Send Reset Link
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
