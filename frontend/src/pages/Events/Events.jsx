import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Events.css";

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    venue: "",
    date: "",
    priceRange: "all",
  });

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data);
        setFilteredEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events", err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/events/categories",
        );
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = events;

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (event) => event.category_id === parseInt(filters.category),
      );
    }

    // Venue filter (location)
    if (filters.venue) {
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(filters.venue.toLowerCase()),
      );
    }

    // Date filter
    if (filters.date) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.event_date)
          .toISOString()
          .split("T")[0];
        return eventDate === filters.date;
      });
    }

    // Price range filter (placeholder - adjust if price data available)
    if (filters.priceRange !== "all") {
      // You can add price filtering logic when price data is available
    }

    setFilteredEvents(filtered);
  }, [filters, events]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "",
      venue: "",
      date: "",
      priceRange: "all",
    });
  };

  const handleGetTicket = (event) => {
    navigate(`/events/${event.id}`, { state: { event } });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-container">
      {/* Filter Bar */}
      <div className="filter-bar-section py-4">
        <div className="container-fluid filter-bar">
          <h5 className="filter-title mb-2">Filter Events</h5>
          <div className="row g-2 align-items-end">
            {/* Category Filter */}
            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-semibold">Category</label>
              <select
                className="form-select form-select-sm"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Venue Filter */}
            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-semibold">Venue</label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="venue"
                placeholder="e.g., Colombo, Kandy"
                value={filters.venue}
                onChange={handleFilterChange}
              />
            </div>

            {/* Date Filter */}
            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-semibold">Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>

            {/* Price Range Filter */}
            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-semibold">
                Price Range
              </label>
              <select
                className="form-select form-select-sm"
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
              >
                <option value="all">All Prices</option>
                <option value="0-50">₨0 - ₨50</option>
                <option value="50-100">₨50 - ₨100</option>
                <option value="100-200">₨100 - ₨200</option>
                <option value="200+">₨200+</option>
              </select>
            </div>

            {/* Clear Button (inline) */}
            <div className="col-lg-2 col-md-6 d-flex justify-content-end">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handleResetFilters}
              >
                <i className="bi bi-arrow-clockwise me-1"></i> Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events Display */}
      <div className="container events-display">
        <div className="mb-4">
          <h2 className="fw-bold">All Events</h2>
          <p className="text-muted">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="row g-4">
            {filteredEvents.map((event) => (
              <div className="col-lg-4 col-md-6 col-sm-12" key={event.id}>
                <div className="event-card shadow-sm h-100">
                  <div className="event-image-container">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="event-img"
                    />
                    <div className="date-badge">
                      <span className="day">
                        {new Date(event.event_date).getDate()}
                      </span>
                      <span className="month">
                        {new Date(event.event_date).toLocaleString("default", {
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="event-details p-3">
                    <h5 className="fw-bold mb-1">{event.title}</h5>
                    <p className="text-muted small mb-3">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {event.location}
                    </p>
                    <p className="text-muted small mb-3">
                      <i className="bi bi-calendar-event me-1"></i>
                      {new Date(event.event_date).toLocaleDateString()}
                    </p>
                    <button
                      className="btn event-get-btn"
                      title="Get Ticket"
                      onClick={() => handleGetTicket(event)}
                    >
                      <i className="bi bi-ticket-fill me-2"></i>GET TICKET
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted fs-5">
              No events found matching your filters. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
