import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserCss/UserOrders.css";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  // ✅ Fetch Recent Orders
  const fetchRecentOrders = async () => {
    try {
      const response = await axiosInstance.get(`/userprofile/orders/${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("❌ No recent orders found!");
    }
  };

  return (
    <div className="orders-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2>My Recent Orders</h2>
      
      {orders.length === 0 ? (
        <p>No recent orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Services</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.services.join(", ") || "N/A"}</td>
                <td>
                  <span className={`badge bg-${order.status === "confirmed" ? "success" : "warning"}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`badge bg-${order.paymentStatus === "completed" ? "success" : "danger"}`}>
                    {order.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
