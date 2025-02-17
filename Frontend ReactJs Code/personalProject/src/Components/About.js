import React, { useEffect } from 'react';
import './css/About.css';
// import salonInterior from '../assets/salon-interior.jpg';
// import teamPhoto from '../assets/team-photo.jpg';
// import founderPhoto from '../assets/founder.jpg';

const About = () => {

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="about-container">
      <div className="hero-section">
        <h1 className="main-title">Welcome to Groom Easy</h1>
        <p className="subtitle">Where Style Meets Excellence</p>
      </div>

      <div className="story-section">
        <div className="content-wrapper">
          <div className="text-content">
            <h2>Our Story</h2>
            <p>
              Founded in 2020, Groom Easy has grown from a small local salon to a
              trendsetting beauty destination. Our passion for beauty and commitment
              to excellence drives everything we do.
            </p>
          </div>
          <div className="image-content">
            {/* <img src={salonInterior} alt="Salon Interior" className="about-image" /> */}
          </div>
        </div>
      </div>

      <div className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <i className="fas fa-heart"></i>
            <h3>Passion</h3>
            <p>We love what we do and it shows in our work</p>
          </div>
          <div className="value-card">
            <i className="fas fa-star"></i>
            <h3>Excellence</h3>
            <p>Delivering the highest quality service every time</p>
          </div>
          <div className="value-card">
            <i className="fas fa-users"></i>
            <h3>Community</h3>
            <p>Building lasting relationships with our clients</p>
          </div>
          <div className="value-card">
            <i className="fas fa-leaf"></i>
            <h3>Sustainability</h3>
            <p>Committed to eco-friendly practices</p>
          </div>
        </div>
      </div>

      <div className="team-section">
        <div className="content-wrapper reverse">
          <div className="image-content">
            {/* <img src={teamPhoto} alt="Our Team" className="about-image" /> */}
          </div>
          <div className="text-content">
            <h2>Our Team</h2>
            <p>
              Our talented team of professionals brings years of experience and
              continuous training to provide you with the latest trends and
              techniques in beauty and wellness.
            </p>
          </div>
        </div>
      </div>

      <div className="founder-section">
        <div className="content-wrapper">
          <div className="text-content">
            <h2>Meet Our Founder</h2>
            <p>
              Sarah Johnson's vision was to create a space where beauty meets
              comfort, and where every client feels like family. With 15 years of
              industry experience, she leads our team with passion and innovation.
            </p>
          </div>
          <div className="image-content">
            {/* <img src={founderPhoto} alt="Founder" className="about-image founder" /> */}
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h3>5000+</h3>
          <p>Happy Clients</p>
        </div>
        <div className="stat-card">
          <h3>15+</h3>
          <p>Expert Stylists</p>
        </div>
        <div className="stat-card">
          <h3>10+</h3>
          <p>Years Experience</p>
        </div>
        <div className="stat-card">
          <h3>25+</h3>
          <p>Beauty Awards</p>
        </div>
      </div>
    </div>
  );
};

export default About;
