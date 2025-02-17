import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/Header.css";

export default function Header() {
  const location = useLocation();

  return (
    <header className="header-container">
      <nav className="nav-wrapper">
        <ul className="nav-list">
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
              to="/"
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} 
              to="/about"
            >
              <span className="nav-icon">ℹ️</span>
              <span className="nav-text">About</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} 
              to="/contact"
            >
              <span className="nav-icon">📞</span>
              <span className="nav-text">Contact</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link login-link ${location.pathname === '/login' ? 'active' : ''}`} 
              to="/login"
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Login</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
