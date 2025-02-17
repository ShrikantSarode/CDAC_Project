import React, { useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'; 
import './css/Payment.css';

export default function Payment() {
  const [amount, setAmount] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  const generateUPIString = () => {
    const upiID = 'example@upi'; // Replace with your UPI ID
    const name = 'Salon Service'; // Merchant name
    const upiString = `upi://pay?pa=${upiID}&pn=${name}&am=${amount}&cu=INR`;
    return upiString;
  };

  const handleGenerateQRCode = () => {
    if (amount > 0) {
      setShowQRCode(true);
    } else {
      alert('Please enter a valid amount.');
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Payment Gateway</h2>
        {!showQRCode ? (
          <div className="payment-form">
            <div className="form-group">
              <label>Enter Amount (INR)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="amount-input"
              />
            </div>
            <button 
              onClick={handleGenerateQRCode}
              className="pay-button"
              disabled={!amount || amount <= 0}
            >
              Generate QR Code
            </button>
          </div>
        ) : (
          <div className="qr-code-section">
            <p>Scan the QR code below to pay ₹{amount}:</p>
            <QRCodeSVG value={generateUPIString()} size={200} />
            <button 
              onClick={() => setShowQRCode(false)} 
              className="back-button"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
