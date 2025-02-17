import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import home1 from "../assest/home.jpeg";
import s1 from "../assest/Services/svgtopng/hair.png";
import s2 from "../assest/Services/svgtopng/barber.png";
import s3 from "../assest/Services/svgtopng/massage.png";
import s4 from "../assest/Services/svgtopng/beauty.png";
import s5 from "../assest/Services/svgtopng/makeup.png";
import s6 from "../assest/Services/svgtopng/spa.png";
import s7 from "../assest/Services/svgtopng/mobile-salon.png";
import s8 from "../assest/Services/svgtopng/nail.png";
import s9 from "../assest/Services/svgtopng/bridal.png";
import s10 from "../assest/salon_booking.jpg";
import s11 from "../assest/salon2.jpg";
import "./css/Home.css";

export default function Home() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="hero-section">
        <div className="container text-center">
          <div className="container mt-5">
            <div className="row">
              <div className="col-xl-6">
                <h1 className="heading-1 text-start">
                  Salon booking made flexible
                </h1>
                <p className="text-start hero-text">
                  Optimize your appointment book with Groom Easy, the only salon
                  booking software that manages group appointments, sets custom
                  service times and pricing by job level or stylist—and so much
                  more.
                </p>
                <Link to="/login">
                  <button className="book-btn">
                    Book Appointment
                  </button>
                </Link>
              </div>
              <div className="col-xl-5 mb-5">
                <figure>
                  <img src={home1} alt="Salon Booking Software" className="hero-image" />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="services-section">
        <h1 className="services-title">Services</h1>
        <div className="container mt-5">
          <div className="row">
            {[
              { img: s1, title: "Haircut" },
              { img: s2, title: "Beard Cut" },
              { img: s3, title: "Massage Scheduling" },
              { img: s4, title: "Skincare" },
              { img: s5, title: "MakeUp Artist Booking" },
              { img: s6, title: "Spa Scheduling" },
              { img: s7, title: "Home Appointment" },
              { img: s8, title: "Nails Salon Scheduling" },
              { img: s9, title: "Bridal Salon Scheduling" },
            ].map((service, index) => (
              <div key={index} className="col-md-2 service-card">
                <figure className="d-flex justify-content-center">
                  <img src={service.img} alt={service.title} />
                </figure>
                <p className="text-center">{service.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="feature-section">
        <div className="container text-center justify-content-center mt-5">
          <div className="row">
            <div className="col-xl-4">
              <figure className="d-flex justify-content-center">
                <img
                  src={s10}
                  alt=""
                  className="feature-image img-fluid"
                />
              </figure>
            </div>
            <div className="col-xl-8 text-start feature-content">
              <h1 className="feature-title">Simplify online salon booking</h1>
              <p className="feature-text">
                Groom Ease Webstore & Consumer Mobile App gives guests the
                flexibility to book online 24/7.
              </p>
              <p className="feature-text">
                "Letting our guests manage their own appointments from start to
                finish has been a huge benefit for us. We've eliminated front desk
                lines and the phone doesn't ring as much, so our team can focus
                100% on taking care of guests in the chair."
              </p>
              <p className="feature-text">Groom Ease has been a game changer for our salon.</p>
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <div className="row">
            <div className="col-xl-8 feature-content">
              <h1 className="feature-title">
                Intelligent appointment booking, happy staff
              </h1>
              <p className="feature-text">
                Groom Easy ensures an accurate appointment book and helps stylists
                make the most of their schedules.
              </p>
              <div className="feature-list">
                <p>Automatically eliminate duplicate services during booking</p>
                <p>
                  Set rules to book services in the right order (e.g. cut, color,
                  blowout)
                </p>
                <p>
                  Split service segments across different providers to optimize
                  their schedules
                </p>
              </div>
            </div>
            <div className="col-xl-4">
              <figure className="d-flex justify-content-center">
                <img
                  src={s11}
                  alt=""
                  className="feature-image img-fluid"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
