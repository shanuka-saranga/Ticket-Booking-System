import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EditProfile from "../EditProfile/EditProfile";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = String(localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();

  // LocalStorage එකේ 'user' ලෙස Save කර ඇති දත්ත ලබා ගැනීම
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // නම තිබේ නම් එය ලබා ගන්න, නැතිනම් 'Guest' ලෙස පෙන්වන්න
  const initialUserName = userData?.username || userData?.name || "Guest";
  const initialProfileImage = userData?.profileImage || null;

  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userName, setUserName] = useState(initialUserName);
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const profileRef = useRef(null);

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const count = cartItems.reduce(
      (sum, item) => sum + Number(item.quantity || 1),
      0,
    );
    setCartCount(count);
  };

  // Pages without hero section (should always show scrolled navbar)
  const noHeroPages = [
    "/events",
    "/gallery",
    "/contact",
    "/cart",
    "/my-bookings",
    "/profile/settings",
  ];
  const currentPath = location.pathname ? location.pathname.toLowerCase() : "";
  const isNoHeroPage = noHeroPages.some((p) => currentPath.startsWith(p));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50 || isNoHeroPage);
    };

    // set initial state on mount (handles direct navigation / reload)
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNoHeroPage]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    updateCartCount();

    const handleStorage = () => updateCartCount();
    const handleCartUpdated = () => updateCartCount();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      const updatedUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      if (updatedUser) {
        setUserName(updatedUser.name || "Guest");
        setProfileImage(updatedUser.profileImage || null);
      }
    };

    window.addEventListener("userProfileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // නමේ මුල් අකුර
  const userInitial = userName.charAt(0).toUpperCase();

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
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* ===== COMMON LINKS (Show to everyone) ===== */}
            <li className="nav-item">
              <Link className="nav-link mx-2 fw-semibold" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link mx-2 fw-semibold" to="/Events">
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link mx-2 fw-semibold" to="/gallery">
                Gallery
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link mx-2 fw-semibold" to="/contact">
                Contact
              </Link>
            </li>

            {/* ===== NOT LOGGED IN (Show Login/Sign Up + Cart) ===== */}
            {!token && (
              <>
                <li className="nav-item me-3">
                  <Link className="nav-link p-0 position-relative" to="/cart">
                    <i className="bi bi-cart fs-4"></i>
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "10px" }}
                    >
                      {cartCount}
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-danger btn-logout-custom ms-2 px-4 rounded-pill shadow-sm"
                    to="/register"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {/* ===== USER ROLE ONLY (Show My Bookings, Cart, Profile) ===== */}
            {token && (role === "user" || role === "customer") && (
              <>
                <li className="nav-item">
                  <Link className="nav-link mx-2 fw-semibold" to="/my-bookings">
                    My Bookings
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link className="nav-link p-0 position-relative" to="/cart">
                    <i className="bi bi-cart fs-4"></i>
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "10px" }}
                    >
                      {cartCount}
                    </span>
                  </Link>
                </li>

                <li
                  className="nav-item position-relative ms-3"
                  ref={profileRef}
                >
                  <button
                    className="profile-initial-btn"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={userName}
                        className="profile-image-display"
                      />
                    ) : (
                      userInitial
                    )}
                  </button>

                  <div
                    className={`profile-dropdown shadow-lg ${profileOpen ? "open" : ""}`}
                  >
                    <div className="dropdown-header text-muted small px-3 pt-2 text-center">
                      Hi, <strong>{userName}</strong>
                    </div>
                    <button
                      className="dropdown-item mt-1"
                      onClick={() => {
                        setIsEditProfileOpen(true);
                        setProfileOpen(false);
                      }}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Edit Profile
                    </button>
                    <Link
                      to="/profile/settings"
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item signout-btn text-danger"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                </li>
              </>
            )}

            {/* ===== ADMIN ROLE ONLY (Show Admin Dashboard, Profile) ===== */}
            {token && role === "admin" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link mx-2 fw-semibold"
                    to="/admin-dashboard"
                  >
                    Admin Dashboard
                  </Link>
                </li>

                <li
                  className="nav-item position-relative ms-3"
                  ref={profileRef}
                >
                  <button
                    className="profile-initial-btn"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={userName}
                        className="profile-image-display"
                      />
                    ) : (
                      userInitial
                    )}
                  </button>

                  <div
                    className={`profile-dropdown shadow-lg ${profileOpen ? "open" : ""}`}
                  >
                    <div className="dropdown-header text-muted small px-3 pt-2 text-center">
                      Hi, <strong>{userName}</strong>
                      <br />
                      <span className="badge bg-danger mt-1">Admin</span>
                    </div>
                    <Link
                      to="/profile/settings"
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item signout-btn text-danger"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
