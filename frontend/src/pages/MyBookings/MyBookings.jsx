import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("myBookings") || "[]");
    return stored;
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const paidBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const paymentStatus = String(booking.paymentStatus || "")
          .trim()
          .toLowerCase();
        return paymentStatus === "paid" || paymentStatus === "success";
      }),
    [bookings],
  );

  const declinedBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const paymentStatus = String(booking.paymentStatus || "")
          .trim()
          .toLowerCase();
        return paymentStatus === "declined";
      }),
    [bookings],
  );

  const normalizePaymentStatus = (paymentStatus) => {
    const normalized = String(paymentStatus || "")
      .trim()
      .toLowerCase();
    if (normalized === "success") return "Paid";
    if (normalized === "declined") return "Declined";
    return paymentStatus || "Paid";
  };

  const updateStorage = (nextBookings) => {
    setBookings(nextBookings);
    localStorage.setItem("myBookings", JSON.stringify(nextBookings));
  };

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find((item) => item.bookingId === bookingId);
    if (!booking) return;

    const confirmCancel = window.confirm(
      `Cancel booking for ${booking.eventTitle}?`,
    );
    if (!confirmCancel) return;

    const nextBookings = bookings.filter(
      (item) => item.bookingId !== bookingId,
    );
    updateStorage(nextBookings);
    setSelectedBooking(null);
    setStatusMessage("Booking cancelled successfully.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const totalPaid = paidBookings.reduce(
    (sum, booking) => sum + Number(booking.totalPrice || 0),
    0,
  );

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-header container">
        <h2 className="section-title my-bookings-title mb-3">My Bookings</h2>
        <p className="my-bookings-subtitle mb-0">
          View your confirmed bookings, check booking details, or cancel a
          booking if needed.
        </p>
      </div>

      <div className="container my-bookings-container">
        {statusMessage && (
          <div className="alert alert-success rounded-4 shadow-sm mb-4">
            {statusMessage}
          </div>
        )}

        {paidBookings.length === 0 && declinedBookings.length === 0 ? (
          <div className="empty-bookings-card text-center">
            <i className="bi bi-ticket-perforated"></i>
            <h4>No bookings yet</h4>
            <p>
              Complete payment from the cart to create your booking history.
            </p>
            <button
              className="btn btn-orange rounded-pill px-4"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </button>
          </div>
        ) : (
          <>
            {paidBookings.length > 0 && (
              <>
                <div className="booking-summary-bar">
                  <div>
                    <span className="summary-label">Total Confirmed</span>
                    <h5>{paidBookings.length}</h5>
                  </div>
                  <div>
                    <span className="summary-label">Total Paid</span>
                    <h5>Rs {totalPaid.toLocaleString()}</h5>
                  </div>
                  <div>
                    <span className="summary-label">Status</span>
                    <h5>Paid & Confirmed</h5>
                  </div>
                </div>

                <div className="row g-4 mb-5">
                  {paidBookings.map((booking) => (
                    <div className="col-lg-6" key={booking.bookingId}>
                      <div className="booking-card">
                        <div className="booking-card-top">
                          <div>
                            <h4 className="booking-event-title">
                              {booking.eventTitle}
                            </h4>
                            <p className="booking-location mb-0">
                              <i className="bi bi-geo-alt-fill me-1"></i>
                              {booking.location}
                            </p>
                          </div>
                          <span className="status-pill confirmed">
                            Confirmed
                          </span>
                        </div>

                        <div className="booking-meta-grid">
                          <div>
                            <span>Booking ID</span>
                            <strong>{booking.bookingId}</strong>
                          </div>
                          <div>
                            <span>Ticket Type</span>
                            <strong>{booking.category}</strong>
                          </div>
                          <div>
                            <span>Qty</span>
                            <strong>{booking.quantity}</strong>
                          </div>
                          <div>
                            <span>Total</span>
                            <strong>
                              Rs{" "}
                              {Number(booking.totalPrice || 0).toLocaleString()}
                            </strong>
                          </div>
                        </div>

                        <div className="booking-card-actions">
                          <button
                            className="btn btn-outline-dark rounded-pill px-4"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn btn-outline-danger rounded-pill px-4"
                            onClick={() =>
                              handleCancelBooking(booking.bookingId)
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {declinedBookings.length > 0 && (
              <>
                <h4 className="mt-5 mb-3">
                  <i
                    className="bi bi-exclamation-circle me-2"
                    style={{ color: "#dc3545" }}
                  ></i>
                  Declined Payments ({declinedBookings.length})
                </h4>
                <div className="row g-4">
                  {declinedBookings.map((booking) => (
                    <div className="col-lg-6" key={booking.bookingId}>
                      <div
                        className="booking-card"
                        style={{
                          opacity: 0.85,
                          borderLeft: "4px solid #dc3545",
                        }}
                      >
                        <div className="booking-card-top">
                          <div>
                            <h4 className="booking-event-title">
                              {booking.eventTitle}
                            </h4>
                            <p className="booking-location mb-0">
                              <i className="bi bi-geo-alt-fill me-1"></i>
                              {booking.location}
                            </p>
                          </div>
                          <span
                            className="status-pill"
                            style={{
                              backgroundColor: "#dc3545",
                              color: "white",
                            }}
                          >
                            Declined
                          </span>
                        </div>

                        <div className="booking-meta-grid">
                          <div>
                            <span>Booking ID</span>
                            <strong>{booking.bookingId}</strong>
                          </div>
                          <div>
                            <span>Ticket Type</span>
                            <strong>{booking.category}</strong>
                          </div>
                          <div>
                            <span>Qty</span>
                            <strong>{booking.quantity}</strong>
                          </div>
                          <div>
                            <span>Total</span>
                            <strong>
                              Rs{" "}
                              {Number(booking.totalPrice || 0).toLocaleString()}
                            </strong>
                          </div>
                        </div>

                        <div className="booking-card-actions">
                          <button
                            className="btn btn-outline-dark rounded-pill px-4"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn btn-outline-danger rounded-pill px-4"
                            onClick={() =>
                              handleCancelBooking(booking.bookingId)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {selectedBooking && (
        <div
          className="booking-modal-overlay"
          onClick={() => setSelectedBooking(null)}
        >
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal-header">
              <h4>Booking Details</h4>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedBooking(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="booking-modal-body">
              <div className="detail-row">
                <span>Event</span>
                <strong>{selectedBooking.eventTitle}</strong>
              </div>
              <div className="detail-row">
                <span>Booking ID</span>
                <strong>{selectedBooking.bookingId}</strong>
              </div>
              <div className="detail-row">
                <span>Ticket Type</span>
                <strong>{selectedBooking.category}</strong>
              </div>
              <div className="detail-row">
                <span>Quantity</span>
                <strong>{selectedBooking.quantity}</strong>
              </div>
              <div className="detail-row">
                <span>Unit Price</span>
                <strong>
                  Rs {Number(selectedBooking.unitPrice || 0).toLocaleString()}
                </strong>
              </div>
              <div className="detail-row">
                <span>Total Price</span>
                <strong>
                  Rs {Number(selectedBooking.totalPrice || 0).toLocaleString()}
                </strong>
              </div>
              <div className="detail-row">
                <span>Payment</span>
                <strong>
                  {normalizePaymentStatus(selectedBooking.paymentStatus)}
                </strong>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <strong>{selectedBooking.bookingStatus}</strong>
              </div>
              <div className="detail-row">
                <span>Booked At</span>
                <strong>
                  {selectedBooking.bookingDate
                    ? new Date(selectedBooking.bookingDate).toLocaleString()
                    : "N/A"}
                </strong>
              </div>
            </div>

            <div className="booking-modal-footer">
              <button
                className="btn btn-outline-danger rounded-pill px-4"
                onClick={() => handleCancelBooking(selectedBooking.bookingId)}
              >
                Cancel Booking
              </button>
              <button
                className="btn btn-orange rounded-pill px-4"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
