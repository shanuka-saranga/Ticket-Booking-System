import React, { useState } from "react";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="container">
          {/* Top Section */}
          <div className="footer-top">
            <div className="row g-4">
              {/* Brand Section */}
              <div className="col-lg-3 col-md-6">
                <div className="footer-brand">
                  <h4>TicketHub</h4>
                  <p>
                    Your gateway to unforgettable experiences. Book tickets for
                    events, concerts, shows, and more.
                  </p>
                  <div className="social-links">
                    <a href="#" title="Facebook" aria-label="Facebook">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" title="Twitter" aria-label="Twitter">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" title="Instagram" aria-label="Instagram">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" title="YouTube" aria-label="YouTube">
                      <i className="bi bi-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6">
                <div className="footer-section">
                  <h5>Quick Links</h5>
                  <ul className="footer-links">
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="/events">Events</a>
                    </li>
                    <li>
                      <a href="/cart">Cart</a>
                    </li>
                    <li>
                      <a href="#about">About Us</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Support */}
              <div className="col-lg-2 col-md-6">
                <div className="footer-section">
                  <h5>Support</h5>
                  <ul className="footer-links">
                    <li>
                      <a href="#help">Help Center</a>
                    </li>
                    <li>
                      <a href="#faq">FAQ</a>
                    </li>
                    <li>
                      <a href="#contact">Contact Us</a>
                    </li>
                    <li>
                      <a href="#privacy">Privacy Policy</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Newsletter */}
              <div className="col-lg-3 col-md-6">
                <div className="footer-section newsletter-section">
                  <h5>Subscribe to Updates</h5>
                  <p className="newsletter-desc">
                    Get the latest event updates and exclusive offers.
                  </p>
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="newsletter-form"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit">
                      <i className="bi bi-send-fill"></i>
                    </button>
                  </form>
                  {subscribed && (
                    <div className="success-msg">✓ Thanks for subscribing!</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider"></div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="footer-credit">
                  &copy; 2026 EventTicko. All rights reserved.
                </p>
              </div>
              <div className="col-md-6 text-end">
                <div className="footer-bottom-links">
                  <a href="#terms">Terms of Service</a>
                  <span className="divider">•</span>
                  <a href="#privacy">Privacy</a>
                  <span className="divider">•</span>
                  <a href="#cookies">Cookies</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
