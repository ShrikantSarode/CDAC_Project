import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import "./UserCss/MyAppointment.css";

// ✅ Load Razorpay dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function MyAppointment() {
  const [services, setServices] = useState([]);
  const [availableStylists, setAvailableStylists] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    axiosInstance
      .get("AssignServices/services", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setServices(response.data))
      .catch((error) => console.error("Error fetching services!", error));
  }, [token]);

  useEffect(() => {
    axiosInstance
      .get("AssignServices/staff", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setAvailableStylists(response.data))
      .catch((error) => console.error("Error fetching stylists!", error));
  }, [token]);

  useEffect(() => {
    if (!customerId) return;
    axiosInstance
      .get(`appointments/customer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBookedAppointments(response.data))
      .catch((error) => console.error("Error fetching appointments!", error));
  }, [customerId, token]);

  const isTimeSlotAvailable = (time) => {
    if (!selectedDate || !selectedStylist) return false;
    const today = getTodayDate();
    const currentHour = new Date().getHours();
    const selectedHour = parseInt(time.split(":")[0],10); // Fix incorrect parsing

    if (selectedDate === today && selectedHour <= currentHour) return false;
    return !bookedAppointments.some(
      (a) =>
        a.staffId === selectedStylist.id &&
        a.appointmentDate === selectedDate &&
        a.appointmentTime === time
    );
  };

  const toggleServiceSelection = (service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s.id === service.id);
      const newServices = isSelected
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service];
      setTotalPrice(newServices.reduce((sum, s) => sum + s.price, 0));
      setTotalDuration(newServices.reduce((sum, s) => sum + s.duration, 0));
      return newServices;
    });
  };

  const handleStylistSelection = (stylistId) => {
    const selectedStylistData = availableStylists.find(
      (stylist) => stylist.id === stylistId
    );
    setSelectedStylist(selectedStylistData);
  };

  const handleBooking = async () => {
    if (!selectedServices.length || !selectedStylist || !selectedDate || !selectedTime) {
      alert("Please select all fields before booking.");
      return;
    }
  
    setLoading(true);
  
    const bookingData = {
      customerId: parseInt(customerId),
      staffId: selectedStylist.id,
      services: selectedServices.map((s) => s.id),
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
    };
  
    try {
      const response = await axiosInstance.post("userappointments/book", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // ✅ Ensure orderId is received correctly
      const { appointmentId, orderId } = response.data;
      if (!orderId) {
        console.error("❌ Razorpay Order ID is missing!");
        alert("Order ID missing. Try again.");
        return;
      }
  
      // ✅ Ensure Razorpay SDK is loaded before opening payment
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load. Please try again.");
        return;
      }
  
      const rzpOptions = {
        key: "rzp_test_sBnMAWzm1Nrg0b",
        amount: totalPrice * 100,
        currency: "INR",
        name: "GroomEasy",
        description: "Appointment Payment",
        order_id: orderId, // ✅ Ensure this is passed
        handler: async function (paymentResponse) {
          console.log("🔵 Payment Successful, Verifying Payment with Backend:");
          console.log("Payment ID:", paymentResponse.razorpay_payment_id);
          console.log("Order ID:", paymentResponse.razorpay_order_id);
          console.log("Signature:", paymentResponse.razorpay_signature);
  
          try {
            await axiosInstance.post("userappointments/verify-payment", {
              appointmentId,
              orderId: paymentResponse.razorpay_order_id, // ✅ Ensure this is sent
              paymentId: paymentResponse.razorpay_payment_id,
              signature: paymentResponse.razorpay_signature,
            });
  
            alert("Payment successful! Appointment confirmed.");
          } catch (error) {
            console.error("🔴 Payment verification failed:", error);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          email: "shrikant@gmail.com",
          contact: "9123456789",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp = new window.Razorpay(rzpOptions);
      rzp.open();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div className="appointment-container">
      <button
        className="logout-button"
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
      <div className="booking-progress">
        <span className={`progress-step ${step === 1 ? "active" : ""}`}>
          Step 1: Select Services
        </span>
        <span className={`progress-step ${step === 2 ? "active" : ""}`}>
          Step 2: Select Stylist
        </span>
        <span className={`progress-step ${step === 3 ? "active" : ""}`}>
          Step 3: Choose Date & Time
        </span>
        <span className={`progress-step ${step === 4 ? "active" : ""}`}>
          Step 4: Confirm Booking
        </span>
      </div>

      {/* ✅ Step 1: Select Services */}
      {step === 1 && (
        <div className="service-selection">
          <h2>Select Services</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div
                key={service.id}
                className={`service-card ${
                  selectedServices.includes(service) ? "selected" : ""
                }`}
                onClick={() => toggleServiceSelection(service)}
              >
                <h5>{service.name}</h5>
                <p>₹{service.price}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={selectedServices.length === 0}
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Step 2: Select Stylist */}
      {step === 2 && (
        <div className="stylist-selection">
          <h2>Select a Stylist</h2>
          <div className="stylists-grid">
            {availableStylists.map((stylist) => (
              <div
                key={stylist.id}
                className={`stylist-card ${
                  selectedStylist?.id === stylist.id ? "selected" : ""
                }`}
                onClick={() => handleStylistSelection(stylist.id)}
              >
                <h3>{stylist.name}</h3>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={() => setStep(3)} disabled={!selectedStylist}>
            Next
          </button>
        </div>
      )}

      {/* ✅ Step 3: Choose Date & Time */}
      {step === 3 && (
        <div className="datetime-selection">
          <h2>Select Date & Time</h2>
          <input
            type="date"
            min={getTodayDate()}
            onChange={(e) => setSelectedDate(e.target.value)}
            value={selectedDate}
          />

          <div className="time-slots">
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`time-slot ${
                  selectedTime === time ? "selected" : ""
                }`}
                disabled={!isTimeSlotAvailable(time)}
                onClick={() => setSelectedTime(time)}
              >
                {time} {isTimeSlotAvailable(time) ? "" : "(Unavailable)"}
              </button>
            ))}
          </div>

          <button onClick={() => setStep(2)}>Back</button>
          <button
            onClick={() => setStep(4)}
            disabled={!selectedDate || !selectedTime}
          >
            Next
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>
            <strong>Total Price:</strong> ₹{totalPrice}
          </p>
          <p>
            <strong>Total Duration:</strong> {totalDuration} minutes
          </p>
          <button onClick={() => setStep(3)}>Back</button>
          <button onClick={handleBooking} disabled={loading}>
            {loading ? "Booking..." : "Confirm & Pay"}
          </button>
        </div>
      )}
    </div>
  );
}
