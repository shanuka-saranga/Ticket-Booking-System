import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-header container">
        <h2 className="section-title contact-page-title mb-3">Contact Us</h2>
        <p className="contact-page-subtitle mb-0">
          Reach out to our team for event support, booking help, or general
          inquiries.
        </p>
      </div>

      <div className="contact-container container">
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-5">
            <div className="contact-info-card h-100">
              <h3>Get in Touch</h3>
              <p>
                We’re here to help with tickets, event details, and account
                support.
              </p>

              <div className="contact-item">
                <i className="bi bi-geo-alt-fill"></i>
                <div>
                  <h5>Address</h5>
                  <p>Colombo, Sri Lanka</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="bi bi-telephone-fill"></i>
                <div>
                  <h5>Phone</h5>
                  <p>+94 11 234 5678</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="bi bi-envelope-fill"></i>
                <div>
                  <h5>Email</h5>
                  <p>support@eventticko.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="contact-form-card h-100">
              <h3>Send a Message</h3>
              <form className="contact-form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="6"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-orange px-4 py-2 rounded-pill"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
