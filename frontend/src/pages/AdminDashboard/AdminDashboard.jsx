import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const role = String(localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [savingUserId, setSavingUserId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activePanel, setActivePanel] = useState("users");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
    image_url: "",
    category_id: "",
    organizer_id: "",
  });

  useEffect(() => {
    if (role !== "admin") {
      navigate("/home", { replace: true });
    }
  }, [navigate, role]);

  const userStats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((item) => item.role === "admin").length;
    const customers = users.filter((item) => item.role !== "admin").length;
    return { total, admins, customers };
  }, [users]);

  const eventStats = useMemo(() => {
    return { total: events.length };
  }, [events]);

  const bookingStats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const totalAmount = bookings.reduce(
      (sum, b) => sum + (Number(b.total_amount) || 0),
      0,
    );
    return { total, confirmed, totalAmount };
  }, [bookings]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError("");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(response.data.users || []);
    } catch (err) {
      setUsersError(
        err?.response?.data?.message ||
          "Failed to load users. Please try again.",
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (role === "admin" && token) {
      fetchUsers();
    }
  }, [role, token]);

  const handleManageUsers = () => {
    setActivePanel("users");
    fetchUsers();
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    setEventsError("");

    try {
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(response.data || []);
    } catch (err) {
      setEventsError(
        err?.response?.data?.message ||
          "Failed to load events. Please try again.",
      );
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleManageEvents = () => {
    setActivePanel("events");
    fetchEvents();
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setBookingsError("");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/bookings/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBookings(response.data.bookings || []);
    } catch (err) {
      setBookingsError(
        err?.response?.data?.message ||
          "Failed to load bookings. Please try again.",
      );
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    const confirmed = window.confirm(
      "Delete this booking permanently? This cannot be undone.",
    );

    if (!confirmed) return;

    setLoadingBookings(true);
    setBookingsError("");

    try {
      await axios.delete(`http://localhost:5000/api/bookings/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings((current) => current.filter((b) => b.id !== id));
    } catch (err) {
      setBookingsError(
        err?.response?.data?.message || "Failed to delete booking.",
      );
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleManageBookings = () => {
    setActivePanel("bookings");
    setSelectedBooking(null);
    fetchBookings();
  };

  const startEditEvent = (event) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      event_date: event.event_date ? String(event.event_date).slice(0, 10) : "",
      image_url: event.image_url || "",
      category_id: event.category_id || "",
      organizer_id: event.organizer_id || "",
    });
  };

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEvent = async () => {
    if (!editingEventId) return;

    setSavingUserId(editingEventId);
    setEventsError("");

    try {
      const payload = {
        ...eventForm,
        category_id: eventForm.category_id
          ? Number(eventForm.category_id)
          : null,
        organizer_id: eventForm.organizer_id
          ? Number(eventForm.organizer_id)
          : null,
      };

      const response = await axios.put(
        `http://localhost:5000/api/events/admin/${editingEventId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedEvent = response.data.event;
      setEvents((currentEvents) =>
        currentEvents.map((item) =>
          item.id === editingEventId ? updatedEvent : item,
        ),
      );
      setEditingEventId(null);
      setActivePanel("events");
      setEventForm({
        title: "",
        description: "",
        location: "",
        event_date: "",
        image_url: "",
        category_id: "",
        organizer_id: "",
      });
    } catch (err) {
      setEventsError(err?.response?.data?.message || "Failed to update event.");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteEvent = async (id) => {
    const confirmed = window.confirm(
      "Delete this event permanently? This cannot be undone.",
    );

    if (!confirmed) return;

    setSavingUserId(id);
    setEventsError("");

    try {
      await axios.delete(`http://localhost:5000/api/events/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents((currentEvents) =>
        currentEvents.filter((item) => item.id !== id),
      );
      if (editingEventId === id) {
        setEditingEventId(null);
      }
      setActivePanel("events");
    } catch (err) {
      setEventsError(err?.response?.data?.message || "Failed to delete event.");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Delete this user permanently? This cannot be undone.",
    );

    if (!confirmed) return;

    setSavingUserId(id);
    try {
      await axios.delete(`http://localhost:5000/api/users/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((currentUsers) => currentUsers.filter((item) => item.id !== id));
      setActivePanel("users");
    } catch (err) {
      setUsersError(
        err?.response?.data?.message ||
          "Failed to delete user. Please try again.",
      );
    } finally {
      setSavingUserId(null);
    }
  };

  const handleCreateEvent = async () => {
    setSavingUserId("creating");
    setEventsError("");

    try {
      if (!eventForm.title || !eventForm.location || !eventForm.event_date) {
        setEventsError("Title, location, and event date are required");
        setSavingUserId(null);
        return;
      }

      const payload = {
        ...eventForm,
        category_id: eventForm.category_id
          ? Number(eventForm.category_id)
          : null,
        organizer_id: eventForm.organizer_id
          ? Number(eventForm.organizer_id)
          : null,
      };

      const response = await axios.post(
        "http://localhost:5000/api/events/admin/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newEvent = response.data.event;
      setEvents((currentEvents) => [...currentEvents, newEvent]);
      setIsCreatingEvent(false);
      setEventForm({
        title: "",
        description: "",
        location: "",
        event_date: "",
        image_url: "",
        category_id: "",
        organizer_id: "",
      });
    } catch (err) {
      setEventsError(err?.response?.data?.message || "Failed to create event.");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleRoleChange = async (id, nextRole) => {
    setSavingUserId(id);
    try {
      await axios.put(
        `http://localhost:5000/api/users/admin/users/${id}/role`,
        { role: nextRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === id ? { ...item, role: nextRole } : item,
        ),
      );
      setActivePanel("users");
    } catch (err) {
      setUsersError(
        err?.response?.data?.message || "Failed to update user role.",
      );
    } finally {
      setSavingUserId(null);
    }
  };

  if (role !== "admin") {
    return null;
  }

  return (
    <div>
      <AdminNavbar />
      <div style={{ marginTop: "90px", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Hero Section */}
          <div className="admin-dashboard-hero">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <div>
                <div className="admin-badge">Admin Panel</div>
                <h2>Welcome, {user?.name || "Admin"}</h2>
                <p>
                  View bookings, manage users, and keep the platform organized
                  from one place.
                </p>
              </div>
              <div className="admin-header-actions">
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={handleManageBookings}
                  disabled={loadingBookings}
                >
                  {loadingBookings && activePanel === "bookings"
                    ? "Loading Bookings..."
                    : "View Bookings"}
                </button>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={handleManageEvents}
                  disabled={loadingEvents}
                >
                  {loadingEvents && activePanel === "events"
                    ? "Loading Events..."
                    : "Manage Events"}
                </button>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={handleManageUsers}
                  disabled={loadingUsers}
                >
                  {loadingUsers && activePanel === "users"
                    ? "Loading Users..."
                    : "Manage Users"}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Users</span>
              <div className="admin-stat-value">{userStats.total}</div>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Events</span>
              <div className="admin-stat-value">{eventStats.total}</div>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Bookings</span>
              <div className="admin-stat-value">{bookingStats.total}</div>
            </div>
          </div>

          {/* Error Messages */}
          {usersError && (
            <div className="admin-alert admin-alert-danger">{usersError}</div>
          )}
          {eventsError && (
            <div className="admin-alert admin-alert-danger">{eventsError}</div>
          )}
          {bookingsError && (
            <div className="admin-alert admin-alert-danger">
              {bookingsError}
            </div>
          )}

          {/* Users Panel */}
          {activePanel === "users" && (
            <div className="admin-panel-container">
              <div className="admin-panel-header">
                <div>
                  <h4>Manage Users</h4>
                  <p>
                    Retrieved from the database. Update roles or remove access
                    when needed.
                  </p>
                </div>
                <button
                  className="admin-btn admin-btn-refresh"
                  onClick={fetchUsers}
                >
                  Refresh
                </button>
              </div>

              {users.length === 0 ? (
                <div className="admin-empty-state">
                  No users found in the database.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: "600" }}>#{item.id}</td>
                          <td>{item.name || "-"}</td>
                          <td>{item.email}</td>
                          <td>{item.phone || "-"}</td>
                          <td>
                            <select
                              className="role-select"
                              value={String(item.role || "customer")
                                .trim()
                                .toLowerCase()}
                              onChange={(e) =>
                                handleRoleChange(item.id, e.target.value)
                              }
                              disabled={savingUserId === item.id}
                            >
                              <option value="customer">Customer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="admin-table-actions">
                              <button
                                className="admin-table-btn admin-btn-danger"
                                onClick={() => handleDeleteUser(item.id)}
                                disabled={savingUserId === item.id}
                              >
                                {savingUserId === item.id
                                  ? "Saving..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Events Panel */}
          {activePanel === "events" && (
            <div className="admin-panel-container">
              <div className="admin-panel-header">
                <div>
                  <h4>Manage Events</h4>
                  <p>
                    Loaded from the database. Edit details or delete events.
                  </p>
                </div>
                <div className="admin-panel-actions">
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => {
                      setIsCreatingEvent(true);
                      setEditingEventId(null);
                      setEventForm({
                        title: "",
                        description: "",
                        location: "",
                        event_date: "",
                        image_url: "",
                        category_id: "",
                        organizer_id: "",
                      });
                    }}
                  >
                    + Create Event
                  </button>
                  <button
                    className="admin-btn admin-btn-refresh"
                    onClick={fetchEvents}
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* Create/Edit Form */}
              {(editingEventId || isCreatingEvent) && (
                <div className="admin-edit-form">
                  <h5>{isCreatingEvent ? "Create New Event" : "Edit Event"}</h5>
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={eventForm.title}
                        onChange={handleEventFormChange}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={eventForm.location}
                        onChange={handleEventFormChange}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Event Date</label>
                      <input
                        type="date"
                        name="event_date"
                        value={eventForm.event_date}
                        onChange={handleEventFormChange}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        name="image_url"
                        value={eventForm.image_url}
                        onChange={handleEventFormChange}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Category ID</label>
                      <input
                        type="number"
                        name="category_id"
                        value={eventForm.category_id}
                        onChange={handleEventFormChange}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Organizer ID</label>
                      <input
                        type="number"
                        name="organizer_id"
                        value={eventForm.organizer_id}
                        onChange={handleEventFormChange}
                      />
                    </div>
                    <div
                      className="admin-form-group"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <label>Description</label>
                      <textarea
                        rows="4"
                        name="description"
                        value={eventForm.description}
                        onChange={handleEventFormChange}
                      />
                    </div>
                  </div>
                  <div className="admin-form-actions">
                    <button
                      className="admin-btn admin-btn-primary"
                      onClick={
                        isCreatingEvent ? handleCreateEvent : handleSaveEvent
                      }
                      disabled={
                        savingUserId ===
                        (isCreatingEvent ? "creating" : editingEventId)
                      }
                    >
                      {savingUserId ===
                      (isCreatingEvent ? "creating" : editingEventId)
                        ? isCreatingEvent
                          ? "Creating..."
                          : "Saving..."
                        : isCreatingEvent
                          ? "Create Event"
                          : "Save Event"}
                    </button>
                    <button
                      className="admin-btn admin-btn-refresh"
                      onClick={() => {
                        setEditingEventId(null);
                        setIsCreatingEvent(false);
                        setEventForm({
                          title: "",
                          description: "",
                          location: "",
                          event_date: "",
                          image_url: "",
                          category_id: "",
                          organizer_id: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Events Table */}
              {events.length === 0 ? (
                <div className="admin-empty-state">
                  No events found in the database.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td style={{ fontWeight: "600" }}>#{event.id}</td>
                          <td>{event.title || "-"}</td>
                          <td>{event.location || "-"}</td>
                          <td>
                            {event.event_date
                              ? String(event.event_date).slice(0, 10)
                              : "-"}
                          </td>
                          <td>{event.category_id || "-"}</td>
                          <td style={{ textAlign: "right" }}>
                            <div className="admin-table-actions">
                              <button
                                className="admin-table-btn admin-btn-edit"
                                onClick={() => startEditEvent(event)}
                              >
                                Edit
                              </button>
                              <button
                                className="admin-table-btn admin-btn-danger"
                                onClick={() => handleDeleteEvent(event.id)}
                                disabled={savingUserId === event.id}
                              >
                                {savingUserId === event.id
                                  ? "Saving..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Bookings Panel */}
          {activePanel === "bookings" && (
            <div className="admin-panel-container">
              <div className="admin-panel-header">
                <div>
                  <h4>View Bookings</h4>
                  <p>
                    All bookings with user and event details. Click on a booking
                    to see user information.
                  </p>
                </div>
                <button
                  className="admin-btn admin-btn-refresh"
                  onClick={fetchBookings}
                >
                  Refresh
                </button>
              </div>

              {selectedBooking ? (
                <div className="admin-edit-form">
                  <h5>Booking Details</h5>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Booking ID
                      </label>
                      <p style={{ marginTop: "0.5rem" }}>
                        # {selectedBooking.id}
                      </p>
                    </div>
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Status
                      </label>
                      <p
                        style={{
                          marginTop: "0.5rem",
                          textTransform: "capitalize",
                        }}
                      >
                        {selectedBooking.status}
                      </p>
                    </div>
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Booking Date
                      </label>
                      <p style={{ marginTop: "0.5rem" }}>
                        {selectedBooking.booking_date
                          ? new Date(
                              selectedBooking.booking_date,
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Total Amount
                      </label>
                      <p style={{ marginTop: "0.5rem" }}>
                        ₹{Number(selectedBooking.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <h5 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    User Information
                  </h5>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Name
                      </label>
                      <p style={{ marginTop: "0.5rem" }}>
                        {selectedBooking.user_name || "-"}
                      </p>
                    </div>
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Email
                      </label>
                      <p style={{ marginTop: "0.5rem" }}>
                        {selectedBooking.user_email || "-"}
                      </p>
                    </div>
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Phone
                      </label>
                      <p style={{ marginTop: "0.5rem" }}>
                        {selectedBooking.user_phone || "-"}
                      </p>
                    </div>
                  </div>

                  <h5 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    Event Information
                  </h5>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Event Title
                      </label>
                      <p style={{ marginTop: "0.5rem" }}>
                        {selectedBooking.event_title || "-"}
                      </p>
                    </div>
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Location
                      </label>
                      <p style={{ marginTop: "0.5rem" }}>
                        {selectedBooking.event_location || "-"}
                      </p>
                    </div>
                    <div>
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#6b7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        Event Date
                      </label>
                      <p style={{ marginTop: "0.5rem" }}>
                        {selectedBooking.event_date
                          ? String(selectedBooking.event_date).slice(0, 10)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="admin-form-actions"
                    style={{ marginTop: "2rem" }}
                  >
                    <button
                      className="admin-btn admin-btn-refresh"
                      onClick={() => setSelectedBooking(null)}
                    >
                      Back to List
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {bookings.length === 0 ? (
                    <div className="admin-empty-state">
                      No bookings found in the database.
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Booking ID</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Event Title</th>
                            <th>Event Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id}>
                              <td style={{ fontWeight: "600" }}>
                                #{booking.id}
                              </td>
                              <td>{booking.user_name || "-"}</td>
                              <td>{booking.user_email || "-"}</td>
                              <td>{booking.event_title || "-"}</td>
                              <td>
                                {booking.event_date
                                  ? String(booking.event_date).slice(0, 10)
                                  : "-"}
                              </td>
                              <td>
                                ₹{Number(booking.total_amount).toLocaleString()}
                              </td>
                              <td>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "0.35rem 0.75rem",
                                    borderRadius: "20px",
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    backgroundColor:
                                      booking.status === "confirmed"
                                        ? "#dcfce7"
                                        : "#fee2e2",
                                    color:
                                      booking.status === "confirmed"
                                        ? "#15803d"
                                        : "#991b1b",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {booking.status}
                                </span>
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <div className="admin-table-actions">
                                  <button
                                    className="admin-table-btn admin-btn-edit"
                                    onClick={() => setSelectedBooking(booking)}
                                  >
                                    Details
                                  </button>
                                  <button
                                    className="admin-table-btn admin-btn-danger"
                                    onClick={() =>
                                      handleDeleteBooking(booking.id)
                                    }
                                    style={{ marginLeft: "0.5rem" }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
