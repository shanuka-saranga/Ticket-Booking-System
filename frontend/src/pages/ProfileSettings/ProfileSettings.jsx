import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfile from "../../components/EditProfile/EditProfile";
import "./ProfileSettings.css";

const defaultSettings = {
  bookingAlerts: true,
  promoEmails: false,
  reminders: true,
  language: "English",
  theme: "Light",
};

const themeOptions = [
  {
    value: "Light",
    label: "Light",
    icon: "bi-sun",
    note: "Bright and clean interface",
  },
  {
    value: "Dark",
    label: "Dark",
    icon: "bi-moon-stars",
    note: "Low-light friendly view",
  },
  {
    value: "System",
    label: "System",
    icon: "bi-laptop",
    note: "Follow your device theme",
  },
];

const resolveTheme = (themePreference) => {
  if (themePreference === "System") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return String(themePreference || "Light").toLowerCase();
};

const applyThemePreference = (themePreference) => {
  const resolvedTheme = resolveTheme(themePreference);

  document.documentElement.setAttribute("data-theme", resolvedTheme);
  document.documentElement.style.colorScheme = resolvedTheme;
  document.body.setAttribute("data-theme", resolvedTheme);
  localStorage.setItem("themePreference", themePreference);

  return resolvedTheme;
};

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...JSON.parse(localStorage.getItem("profileSettings") || "{}"),
  }));
  const [message, setMessage] = useState("");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    const refreshUser = () => {
      setUserData(JSON.parse(localStorage.getItem("user") || "{}"));
    };

    window.addEventListener("userProfileUpdated", refreshUser);
    return () => window.removeEventListener("userProfileUpdated", refreshUser);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => applyThemePreference(settings.theme);
    updateTheme();

    if (settings.theme !== "System") {
      return undefined;
    }

    media.addEventListener("change", updateTheme);

    return () => media.removeEventListener("change", updateTheme);
  }, [settings.theme]);

  const updateSetting = (field, value) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    localStorage.setItem("profileSettings", JSON.stringify(settings));
    setMessage("Settings saved successfully.");
    setTimeout(() => setMessage(""), 2500);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.setItem("profileSettings", JSON.stringify(defaultSettings));
    applyThemePreference(defaultSettings.theme);
    setMessage("Settings reset to default.");
    setTimeout(() => setMessage(""), 2500);
  };

  const displayName = userData?.name || userData?.username || "Guest";
  const email = userData?.email || "Not available";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="profile-settings-page">
      <div className="profile-settings-hero">
        <div className="container">
          <div className="settings-hero-card">
            <div className="settings-avatar-wrap">
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt={displayName}
                  className="settings-avatar"
                />
              ) : (
                <div className="settings-avatar fallback">{initial}</div>
              )}
            </div>
            <div className="settings-hero-copy">
              <p className="settings-eyebrow mb-2">Profile Settings</p>
              <h2 className="mb-2">Customize your account preferences</h2>
              <p className="mb-0 text-muted">
                Manage booking alerts, language, and other small preferences
                from one place. Theme changes apply instantly.
              </p>
            </div>
            <div className="settings-hero-actions">
              <button
                className="btn btn-outline-dark rounded-pill px-4"
                onClick={() => setIsEditProfileOpen(true)}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Edit Profile
              </button>
              <button
                className="btn btn-orange rounded-pill px-4"
                onClick={() => navigate("/my-bookings")}
              >
                My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {message && (
          <div className="alert alert-success rounded-4">{message}</div>
        )}

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="settings-side-card">
              <h5 className="mb-3">Account</h5>
              <div className="settings-info-row">
                <span>Name</span>
                <strong>{displayName}</strong>
              </div>
              <div className="settings-info-row">
                <span>Email</span>
                <strong>{email}</strong>
              </div>
              <div className="settings-info-row">
                <span>Account Type</span>
                <strong>
                  {String(localStorage.getItem("role") || "customer")}
                </strong>
              </div>
              <div className="settings-info-row">
                <span>Support</span>
                <strong>24/7 ticket help</strong>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <form className="settings-main-card" onSubmit={handleSave}>
              <div className="settings-card-head">
                <div>
                  <h4 className="mb-1">General Settings</h4>
                  <p className="text-muted mb-0">
                    Save a few useful preferences for your booking experience.
                  </p>
                </div>
                <span className="settings-badge">Local only</span>
              </div>

              <div className="settings-grid">
                <label className="settings-toggle-card">
                  <div>
                    <strong>Booking confirmations</strong>
                    <p className="mb-0 text-muted">
                      Receive updates after each booking.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.bookingAlerts}
                    onChange={(e) =>
                      updateSetting("bookingAlerts", e.target.checked)
                    }
                  />
                </label>

                <label className="settings-toggle-card">
                  <div>
                    <strong>Booking reminders</strong>
                    <p className="mb-0 text-muted">
                      Remind me before an event starts.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.reminders}
                    onChange={(e) =>
                      updateSetting("reminders", e.target.checked)
                    }
                  />
                </label>

                <label className="settings-toggle-card">
                  <div>
                    <strong>Promotional emails</strong>
                    <p className="mb-0 text-muted">
                      Get offers and event announcements.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.promoEmails}
                    onChange={(e) =>
                      updateSetting("promoEmails", e.target.checked)
                    }
                  />
                </label>

                <div className="settings-input-card">
                  <label className="form-label">Language</label>
                  <select
                    className="form-select"
                    value={settings.language}
                    onChange={(e) => updateSetting("language", e.target.value)}
                  >
                    <option>English</option>
                    <option>Sinhala</option>
                    <option>Tamil</option>
                  </select>
                </div>

                <div className="settings-input-card">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <label className="form-label mb-1">
                        Theme preference
                      </label>
                      <p className="theme-helper-text mb-0">
                        Choose how the app looks. The active theme updates as
                        soon as you tap a mode.
                      </p>
                    </div>
                    <span className="theme-preview-pill">
                      <i
                        className={`bi ${resolveTheme(settings.theme) === "dark" ? "bi-moon-stars" : "bi-sun"} me-1`}
                      ></i>
                      {settings.theme}
                    </span>
                  </div>

                  <div className="theme-option-list">
                    {themeOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`theme-option-card ${settings.theme === option.value ? "active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="theme-preference"
                          value={option.value}
                          checked={settings.theme === option.value}
                          onChange={(e) => {
                            updateSetting("theme", e.target.value);
                            applyThemePreference(e.target.value);
                          }}
                        />
                        <span className="theme-option-icon">
                          <i className={`bi ${option.icon}`}></i>
                        </span>
                        <span className="theme-option-copy">
                          <strong>{option.label}</strong>
                          <small>{option.note}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button
                  type="button"
                  className="btn btn-outline-danger rounded-pill px-4"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-orange rounded-pill px-4"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};

export default ProfileSettings;
