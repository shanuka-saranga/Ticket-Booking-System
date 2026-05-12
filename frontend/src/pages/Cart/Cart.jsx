import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems") || "[]"),
  );

  const grandTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.totalPrice || 0),
      0,
    );
  }, [cartItems]);

  const removeItem = (indexToRemove) => {
    const updated = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleBuyNow = async () => {
    if (cartItems.length === 0) return;

    const userData = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    if (!userData?.id) {
      alert("Please log in before confirming a booking.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/bookings", {
        userId: userData.id,
        bookings: cartItems.map((item) => ({
          eventId: item.eventId || item.event_id || null,
          totalAmount: Number(item.totalPrice || 0),
          status: "confirmed",
        })),
      });

      const currentBookings = JSON.parse(
        localStorage.getItem("myBookings") || "[]",
      );

      const bookingBatch = response.data.bookings.map((booking, index) => {
        const item = cartItems[index];

        return {
          bookingId: booking.id,
          user_id: booking.user_id,
          event_id: booking.event_id,
          bookingDate: booking.booking_date,
          totalPrice: Number(booking.total_amount || 0),
          bookingStatus: "Confirmed",
          paymentStatus: "Paid",
          eventTitle: item.eventTitle,
          location: item.location,
          category: item.category,
          quantity: Number(item.quantity || 1),
          unitPrice: Number(item.unitPrice || 0),
        };
      });

      localStorage.setItem(
        "myBookings",
        JSON.stringify([...bookingBatch, ...currentBookings]),
      );

      alert("Payment successful! Your booking has been confirmed.");
      setCartItems([]);
      localStorage.setItem("cartItems", JSON.stringify([]));
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/my-bookings");
    } catch (error) {
      alert(
        error?.response?.data?.message || "Booking failed. Please try again.",
      );
    }
  };

  return (
    <div className="container py-5" style={{ marginTop: "90px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Your Cart</h2>
        <button
          className="btn btn-outline-dark rounded-pill"
          onClick={() => navigate("/events")}
        >
          Continue Shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5 className="mb-3">Your cart is empty</h5>
          <button
            className="btn btn-orange rounded-pill px-4"
            onClick={() => navigate("/events")}
          >
            Browse Events
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive bg-white rounded-4 shadow-sm p-3">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Ticket</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={`${item.eventId}-${item.category}-${index}`}>
                    <td>
                      <div className="fw-semibold">{item.eventTitle}</div>
                      <div className="small text-muted">{item.location}</div>
                    </td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>Rs {Number(item.unitPrice || 0).toLocaleString()}</td>
                    <td>Rs {Number(item.totalPrice || 0).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end align-items-center gap-3 mt-4">
            <h5 className="mb-0">
              Grand Total: Rs {grandTotal.toLocaleString()}
            </h5>
            <button
              className="btn btn-orange rounded-pill px-4"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
