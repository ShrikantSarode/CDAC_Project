import React from 'react';
import './css/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Contact Information */}
        <div className="section fade-in">
          <h4 className="heading">Contact Us</h4>
          <p>123 Beauty Lane</p>
          <p>Cityville, ST 12345</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@salonname.com</p>
        </div>

        {/* Social Media Links */}
        <div className="section fade-in">
          <h4 className="heading">Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        {/* Business Hours */}
        <div className="section fade-in">
          <h4 className="heading">Business Hours</h4>
          <p>Mon - Fri: 9:00 AM - 7:00 PM</p>
          <p>Sat: 10:00 AM - 5:00 PM</p>
          <p>Sun: Closed</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} Salon Name. All rights reserved.</p>
      </div>
    </footer>
  );
}
