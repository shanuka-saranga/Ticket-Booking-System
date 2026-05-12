import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState(location.state?.event || null);
  const [loading, setLoading] = useState(true);
  const [ticketCategories, setTicketCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 1. Fetch Event Details
  useEffect(() => {
    const fetchEvent = async () => {
      if (event) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error("Error fetching event details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, event]);

  // 2. Fetch Ticket Types from DB
  useEffect(() => {
    const fetchTicketTypes = async () => {
      if (!id) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/events/${id}/ticket-types`,
        );

        if (Array.isArray(res.data) && res.data.length > 0) {
          const mappedTypes = res.data.map((type) => ({
            id: type.id,
            label: type.type_name, // DB එකේ 'type_name' column එක
            price: Number(type.price ?? 0), // DB එකේ 'price' column එක
            totalQuantity: Number(type.total_quantity ?? 0),
            availableQuantity: Number(type.available_quantity ?? 0),
          }));

          setTicketCategories(mappedTypes);
          setSelectedCategory(mappedTypes[0].id); // පළමු Ticket වර්ගය select කිරීම
        }
      } catch (error) {
        console.error("Error fetching ticket types", error);
      }
    };
    fetchTicketTypes();
  }, [id]);

  // දැනට Select කර ඇති ටිකට් එක සොයාගැනීම (Error නොවී තිබීමට ?. පාවිච්චි කර ඇත)
  const selectedTicket = useMemo(() => {
    return (
      ticketCategories.find((item) => item.id === selectedCategory) || null
    );
  }, [ticketCategories, selectedCategory]);

  const totalPrice = useMemo(() => {
    const price = selectedTicket ? selectedTicket.price : 0;
    return Math.round(price * quantity * 100) / 100;
  }, [selectedTicket, quantity]);

  const handleAddToCart = () => {
    if (!event || !selectedTicket || isRedirecting) return;

    const cartItem = {
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image_url,
      location: event.location,
      eventDate: event.event_date,
      category: selectedTicket.label,
      quantity,
      unitPrice: selectedTicket.price,
      totalPrice,
    };

    const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    existingCart.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setMessage("Added to cart successfully. Redirecting to cart...");
    setIsRedirecting(true);

    setTimeout(() => {
      navigate("/cart");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">Loading event details...</div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5 text-center">
        <p>Event not found.</p>
        <button className="btn btn-orange" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);

  return (
    <div className="event-details-page">
      <div className="container py-3 px-4">
        <div className="event-details-shell shadow-lg">
          <div className="row g-0">
            {/* Image Column */}
            <div className="col-lg-5 event-details-image-col">
              <img
                src={event.image_url}
                alt={event.title}
                className="event-details-image"
              />
              <div className="event-details-overlay">
                <span className="overlay-label">Event</span>
                <h2>{event.title}</h2>
                <p>{event.location}</p>
              </div>
            </div>

            {/* Content Column */}
            <div className="col-lg-7 event-details-content-col">
              <div className="event-details-content">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="details-badge">
                      {selectedTicket?.label || "Selecting..."} Ticket
                    </span>
                    <h1 className="event-details-title mb-2">{event.title}</h1>
                    <p className="event-details-meta">
                      <i className="bi bi-geo-alt-fill me-1"></i>{" "}
                      {event.location}
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-dark rounded-pill"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                </div>

                <p className="event-details-description">
                  {event.description || "No description available."}
                </p>

                {/* Info Grid */}
                <div className="event-details-info-grid">
                  <div className="info-card">
                    <span>Date</span>
                    <strong>{eventDate.toLocaleDateString()}</strong>
                  </div>
                  <div className="info-card">
                    <span>Time</span>
                    <strong>
                      {eventDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </strong>
                  </div>
                  <div className="info-card">
                    <span>Unit Price</span>
                    <strong>
                      ₨ {selectedTicket?.price?.toLocaleString() || 0}
                    </strong>
                  </div>
                  <div className="info-card">
                    <span>Available</span>
                    <strong>
                      {selectedTicket?.availableQuantity ?? 0} /{" "}
                      {selectedTicket?.totalQuantity ?? 0}
                    </strong>
                  </div>
                </div>

                {/* Ticket Categories from DB */}
                <div className="mt-4">
                  <label className="form-label fw-semibold">
                    Ticket Category
                  </label>
                  <div className="ticket-category-grid">
                    {ticketCategories.length > 0 ? (
                      ticketCategories.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`ticket-category-btn ${selectedCategory === item.id ? "active" : ""}`}
                          onClick={() => setSelectedCategory(item.id)}
                        >
                          <span>{item.label}</span>
                          <small>₨ {item.price.toLocaleString()}</small>
                        </button>
                      ))
                    ) : (
                      <p className="text-danger small">
                        No tickets available in database.
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity & Cart */}
                <div className="row g-3 mt-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      Total Price
                    </label>
                    <div className="selected-price-box">
                      ₨ {totalPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button
                      className="btn btn-orange w-100 rounded-pill event-cart-btn"
                      onClick={handleAddToCart}
                      disabled={!selectedTicket || isRedirecting}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {isRedirecting ? "Redirecting..." : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {message && (
                  <div className="alert alert-success mt-3 mb-0">{message}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
