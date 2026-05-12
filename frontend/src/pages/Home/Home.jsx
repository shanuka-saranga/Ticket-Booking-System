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
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const userData = userStr ? JSON.parse(userStr) : null;
  const userId = userData?.id || userData?.user_id;

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/reviews/recent?limit=6",
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };
    fetchReviews();
  }, []);

  const visibleEvents = events.slice(0, 3);
  const hiddenEvents = events.slice(3);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const searchResults = normalizedSearchQuery
    ? events.filter((event) => {
        const title = String(event.title || "").toLowerCase();
        const location = String(event.location || "").toLowerCase();
        return (
          title.includes(normalizedSearchQuery) ||
          location.includes(normalizedSearchQuery)
        );
      })
    : [];

  const handleGetTicket = (event) => {
    navigate(`/events/${event.id}`, { state: { event } });
  };

  const handleSearch = () => {
    if (normalizedSearchQuery) {
      setShowSearchResults(true);
    }
  };

  const handleSelectSearchResult = (event) => {
    setSearchQuery("");
    setShowSearchResults(false);
    handleGetTicket(event);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      setSubmitError("Please log in to submit a review");
      return;
    }

    if (!userId) {
      setSubmitError("User information not found. Please log in again.");
      return;
    }

    if (!newReview.comment.trim()) {
      setSubmitError("Please enter a comment");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");

    try {
      const reviewData = {
        userId: userId,
        eventId: events[0]?.id || 1,
        rating: newReview.rating,
        comment: newReview.comment,
      };

      console.log(
        "Submitting review with token:",
        token?.substring(0, 20) + "...",
      );
      console.log("Submitting review data:", reviewData);

      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Review submitted successfully:", response.data);

      setNewReview({ rating: 5, comment: "" });

      // Refresh reviews list
      const reviewsRes = await axios.get(
        "http://localhost:5000/api/reviews/recent?limit=6",
      );
      setReviews(reviewsRes.data);

      // Show success message briefly
      setSubmitError("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to submit review";
      console.error("Review submission error:", {
        status: err.response?.status,
        message: errorMessage,
        fullError: err,
      });
      setSubmitError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <i
          key={i}
          className={`bi bi-star${i < rating ? "-fill" : ""}`}
          style={{
            color: i < rating ? "#f97316" : "#cbd5e1",
            marginRight: "2px",
          }}
        />
      ));
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
          <div className="row justify-content-center position-relative">
            <div className="col-md-7">
              <div className="input-group search-bar search-bar-pill shadow-lg">
                <input
                  type="text"
                  className="form-control search-bar-input"
                  placeholder="Search Artist, Team, or Venue"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => {
                    if (normalizedSearchQuery) {
                      setShowSearchResults(true);
                    }
                  }}
                />
                <button
                  className="btn search-bar-btn"
                  type="button"
                  onClick={handleSearch}
                >
                  <i className="bi bi-search text-orange"></i>
                </button>
              </div>

              {showSearchResults && normalizedSearchQuery && (
                <div className="search-results-panel shadow-lg">
                  <div className="search-results-header">
                    <span>Search Results</span>
                    <button
                      type="button"
                      className="search-results-close"
                      onClick={() => setShowSearchResults(false)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="search-results-list">
                      {searchResults.map((event) => (
                        <button
                          type="button"
                          key={event.id}
                          className="search-result-item"
                          onClick={() => handleSelectSearchResult(event)}
                        >
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="search-result-thumb"
                          />
                          <div className="search-result-copy">
                            <strong>{event.title}</strong>
                            <span>
                              <i className="bi bi-geo-alt-fill me-1"></i>
                              {event.location}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="search-results-empty">
                      No matching events found.
                    </div>
                  )}
                </div>
              )}
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

        {/* --- Reviews Section --- */}
        <div className="reviews-section mt-5 pt-4">
          <div className="mb-4">
            <h2 className="fw-bold section-title text-uppercase">
              Community Reviews
            </h2>
            <p className="text-muted small">
              Share your experience and read what others loved about our events
            </p>
          </div>

          {/* Review Form */}
          <div className="row g-4 mb-5">
            <div className="col-lg-5">
              <div className="review-form-card shadow-sm">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-pencil-square me-2"></i>Add Your Review
                </h5>

                {submitError && (
                  <div
                    className="alert alert-warning alert-dismissible fade show"
                    role="alert"
                  >
                    {submitError}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSubmitError("")}
                    />
                  </div>
                )}

                {!token ? (
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Please{" "}
                    <a href="/login" className="alert-link">
                      log in
                    </a>{" "}
                    to submit a review.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Rating</label>
                      <div className="d-flex gap-2">
                        {[1, 2, 3, 4, 5].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            className={`rating-star-btn ${newReview.rating >= rate ? "active" : ""}`}
                            onClick={() =>
                              setNewReview({ ...newReview, rating: rate })
                            }
                          >
                            <i className="bi bi-star-fill"></i>
                          </button>
                        ))}
                      </div>
                      <small className="text-muted">
                        {newReview.rating} out of 5 stars
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Your Comment
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Share your experience..."
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-orange w-100"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>Submit Review
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="col-lg-7">
              <div className="reviews-list">
                <h5 className="fw-bold mb-3">Recent Reviews</h5>

                {reviews.length > 0 ? (
                  <div className="row g-3">
                    {reviews.map((review) => (
                      <div className="col-md-6" key={review.id}>
                        <div className="review-card shadow-sm">
                          <div className="review-header">
                            <div>
                              <strong>{review.name || review.user_name}</strong>
                              <p className="text-muted small mb-1">
                                {review.event_title}
                              </p>
                            </div>
                            <span className="review-rating">
                              {renderStars(review.rating)}
                            </span>
                          </div>
                          <p className="review-comment mb-2">
                            {review.comment}
                          </p>
                          <small className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      No reviews yet. Be the first to share your experience!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
