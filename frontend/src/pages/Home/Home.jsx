import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
// Path එක හරියටම චෙක් කරන්න (පියවර 2ක් පිටුපසට ගොස් components/Category වෙත)
import CategorySection from "../../components/Category/CategorySection";
import StatsSection from "../../components/StatsSection/StatsSection";
import HowItWorks from "../../components/Howitworks/HowItWorks";

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events", err);
      }
    };
    fetchEvents();
  }, []);

  const visibleEvents = events.slice(0, 3);
  const hiddenEvents = events.slice(3);

  const handleGetTicket = (event) => {
    navigate(`/events/${event.id}`, { state: { event } });
  };

  return (
    <div className="home-container">
      {/* --- Section 1: Hero Section --- */}
      <div className="hero-section">
        <div className="container text-center text-white">
          <h1 className="hero-title fw-bold">Make Your Dream Come True</h1>
          <p className="hero-subtitle mb-4">
            Meet your favorite artists, sport teams and parties
          </p>
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="input-group search-bar search-bar-pill shadow-lg">
                <input
                  type="text"
                  className="form-control search-bar-input"
                  placeholder="Search Artist, Team, or Venue"
                />
                <button className="btn search-bar-btn" type="button">
                  <i className="bi bi-search text-orange"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 3: Upcoming Events Section --- */}
      <div className="container mt-5 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold section-title text-uppercase">
              Upcoming Events
            </h2>
            <p className="text-muted small">
              Explore and book your favorite events happening soon.
            </p>
          </div>
          <button className="btn btn-outline-orange rounded-pill px-4">
            SEE ALL UPCOMING EVENTS
          </button>
        </div>

        {/* First 3 Events */}
        <div className="row g-4 justify-content-center upcoming-events-grid">
          {visibleEvents.map((event) => (
            <div className="col-lg-4 col-md-4 col-sm-6 col-12" key={event.id}>
              <div className="event-card upcoming-event-card shadow-sm">
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
                    <i className="bi bi-geo-alt-fill me-1"></i> {event.location}
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

        {/* See More Events */}
        {hiddenEvents.length > 0 && (
          <>
            <div className={`more-events-wrap ${showMore ? "open" : ""}`}>
              <div className="row g-4 pt-2 justify-content-center">
                {hiddenEvents.map((event) => (
                  <div
                    className="col-lg-4 col-md-4 col-sm-6 col-12"
                    key={event.id}
                  >
                    {/* Event Card Code (same as above) */}
                    <div className="event-card upcoming-event-card shadow-sm">
                      <div className="event-image-container">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="event-img"
                        />
                      </div>
                      <div className="event-details p-3">
                        <h5 className="fw-bold mb-1">{event.title}</h5>
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
            </div>
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-orange rounded-pill px-4 see-more-toggle"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "SHOW LESS" : "SEE MORE"}
              </button>
            </div>
          </>
        )}

        {/* --- Section 2: Category Section (දැන් Hero එකට පස්සේ පේනවා) --- */}
        <div className="py-5">
          <CategorySection />
        </div>

        <div>
          {/* Hero, Categories etc. */}
          <StatsSection />
          {/* Events section etc. */}
        </div>

        <div>
          {/* Hero, Categories etc. */}
          <HowItWorks />
          {/* Events section etc. */}
        </div>
      </div>
    </div>
  );
};

export default Home;
