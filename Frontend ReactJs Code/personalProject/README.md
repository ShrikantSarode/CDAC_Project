1.adminDashboard table{
    total appo,tot staff, tot customer, tot revenue
}

admin Appoint table 

2.staff management
staff list(select * from user where role="staff")

3.Appointments
all apoints

4.admin--> assign Services to staff table

      {/* ✅ Step 1: Select Services */}
      {step === 1 && (
        <div className="service-selection">
          <h2>Select Services</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className={`service-card ${selectedServices.includes(service) ? "selected" : ""}`} onClick={() => toggleServiceSelection(service)}>
                <h5>{service.name}</h5>
                <p>₹{service.price}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={selectedServices.length === 0}>Next</button>
        </div>
      )}

      {/* ✅ Step 2: Select Stylist */}
      {step === 2 && (
        <div className="stylist-selection">
          <h2>Select a Stylist</h2>
          <div className="stylists-grid">
            {availableStylists.map((stylist) => (
              <div key={stylist.id} className={`stylist-card ${selectedStylist?.id === stylist.id ? "selected" : ""}`} onClick={() => handleStylistSelection(stylist.id)}>
                <h3>{stylist.name}</h3>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={() => setStep(3)} disabled={!selectedStylist}>Next</button>
        </div>
      )}

      {/* ✅ Step 3: Choose Date & Time */}
      {step === 3 && (
        <div className="datetime-selection">
          <h2>Select Date & Time</h2>
          <input type="date" min={getTodayDate()} onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate} />
          
          <div className="time-slots">
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                disabled={!isTimeSlotAvailable(time)}
                onClick={() => setSelectedTime(time)}
              >
                {time} {isTimeSlotAvailable(time) ? "" : "(Unavailable)"}
              </button>
            ))}
          </div>

          <button onClick={() => setStep(2)}>Back</button>
          <button onClick={() => setStep(4)} disabled={!selectedDate || !selectedTime}>Next</button>
        </div>
      )}

      {step === 4 && (
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p><strong>Total Price:</strong> ₹{totalPrice}</p>
          <p><strong>Total Duration:</strong> {totalDuration} minutes</p>
          <button onClick={() => setStep(3)}>Back</button>
          <button onClick={handleBooking} disabled={loading}>{loading ? "Booking..." : "Confirm & Pay"}</button>
        </div>
      )}