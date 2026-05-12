import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const userName = userData?.name || "Admin";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top transition-nav ${scrolled ? "nav-scrolled shadow-sm" : "nav-transparent"}`}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold brand-text" to="/">
          EventTicko
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <span className="badge bg-danger ms-3">Admin</span>
            </li>

            <li className="nav-item position-relative ms-3" ref={profileRef}>
              <button
                className="profile-initial-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {userInitial}
              </button>

              <div
                className={`profile-dropdown shadow-lg ${profileOpen ? "open" : ""}`}
              >
                <div className="dropdown-header text-muted small px-3 pt-2 text-center">
                  Hi, <strong>{userName}</strong>
                  <br />
                  <span className="badge bg-danger mt-1">Admin</span>
                </div>
                <hr className="my-2" />
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
