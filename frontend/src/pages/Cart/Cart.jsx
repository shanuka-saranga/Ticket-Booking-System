import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const paymentMethodOptions = [
  { value: "card", label: "Debit / Credit Card", icon: "bi-credit-card" },
  { value: "wallet", label: "Mobile Wallet", icon: "bi-phone" },
  { value: "bank", label: "Bank Transfer", icon: "bi-building" },
];

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems") || "[]"),
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "card",
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    walletProvider: "eZ Cash",
    walletNumber: "",
    walletReference: "",
    bankName: "Bank of Ceylon",
    accountName: "",
    transferReference: "",
  });

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

  const openCheckout = () => {
    setCheckoutError("");
    setShowCheckout(true);
  };

  const closeCheckout = () => {
    if (isPaying) return;
    setCheckoutError("");
    setShowCheckout(false);
  };

  const updatePaymentForm = (field, value) => {
    setPaymentForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const selectedPaymentMethod = paymentForm.paymentMethod;

  const getPaymentDetailsPayload = () => {
    if (selectedPaymentMethod === "wallet") {
      return {
        walletProvider: paymentForm.walletProvider,
        walletNumber: paymentForm.walletNumber,
        walletReference: paymentForm.walletReference,
      };
    }

    if (selectedPaymentMethod === "bank") {
      return {
        bankName: paymentForm.bankName,
        accountName: paymentForm.accountName,
        transferReference: paymentForm.transferReference,
      };
    }

    return {
      cardHolderName: paymentForm.cardHolderName,
      cardNumber: paymentForm.cardNumber,
      expiryDate: paymentForm.expiryDate,
      cvv: paymentForm.cvv,
    };
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
        payment: {
          paymentMethod: paymentForm.paymentMethod,
          ...getPaymentDetailsPayload(),
        },
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
      setIsPaying(false);
      alert(
        error?.response?.data?.message || "Booking failed. Please try again.",
      );
    }
  };

  const handlePay = async () => {
    const digitsOnly = String(paymentForm.cardNumber || "").replace(/\s+/g, "");

    if (paymentForm.paymentMethod === "card") {
      if (!paymentForm.cardHolderName.trim()) {
        setCheckoutError("Enter the card holder name.");
        return;
      }

      if (digitsOnly.length < 12) {
        setCheckoutError("Enter a valid card number.");
        return;
      }

      if (!paymentForm.expiryDate) {
        setCheckoutError("Select the expiry date.");
        return;
      }

      if (String(paymentForm.cvv || "").trim().length < 3) {
        setCheckoutError("Enter the CVV.");
        return;
      }
    }

    if (paymentForm.paymentMethod === "wallet") {
      if (!paymentForm.walletNumber.trim()) {
        setCheckoutError("Enter the wallet number.");
        return;
      }

      if (!paymentForm.walletReference.trim()) {
        setCheckoutError("Enter the wallet transaction reference.");
        return;
      }
    }

    if (paymentForm.paymentMethod === "bank") {
      if (!paymentForm.accountName.trim()) {
        setCheckoutError("Enter the account name.");
        return;
      }

      if (!paymentForm.transferReference.trim()) {
        setCheckoutError("Enter the bank transfer reference.");
        return;
      }
    }

    setCheckoutError("");
    setIsPaying(true);
    await handleBuyNow();
    setIsPaying(false);
  };

  return (
    <>
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
                      <td>
                        Rs {Number(item.totalPrice || 0).toLocaleString()}
                      </td>
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
                onClick={openCheckout}
              >
                Buy Now
              </button>
            </div>
          </>
        )}
      </div>

      {showCheckout && (
        <div className="checkout-overlay" onClick={closeCheckout}>
          <div
            className="checkout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="checkout-modal-header">
              <div>
                <p className="checkout-eyebrow mb-1">Secure checkout</p>
                <h4 className="mb-0">Complete your payment</h4>
              </div>
              <button
                type="button"
                className="btn-close checkout-close-btn"
                aria-label="Close"
                onClick={closeCheckout}
                disabled={isPaying}
              ></button>
            </div>

            <div className="checkout-summary">
              <div>
                <span>Total items</span>
                <strong>{cartItems.length}</strong>
              </div>
              <div>
                <span>Total amount</span>
                <strong>Rs {grandTotal.toLocaleString()}</strong>
              </div>
            </div>

            <div className="checkout-form-grid">
              <div className="payment-method-selector">
                {paymentMethodOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`payment-method-card ${selectedPaymentMethod === option.value ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={selectedPaymentMethod === option.value}
                      onChange={(event) =>
                        updatePaymentForm("paymentMethod", event.target.value)
                      }
                      disabled={isPaying}
                    />
                    <span className="payment-method-icon">
                      <i className={`bi ${option.icon}`}></i>
                    </span>
                    <span className="payment-method-label">{option.label}</span>
                  </label>
                ))}
              </div>

              {selectedPaymentMethod === "card" && (
                <div className="payment-details-panel">
                  <div className="payment-panel-head">
                    <h6 className="mb-1">Card details</h6>
                    <p className="mb-0">
                      Enter your card details to confirm the booking.
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Card Holder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Shanuka Perera"
                      value={paymentForm.cardHolderName}
                      onChange={(event) =>
                        updatePaymentForm("cardHolderName", event.target.value)
                      }
                      disabled={isPaying}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(event) =>
                        updatePaymentForm("cardNumber", event.target.value)
                      }
                      disabled={isPaying}
                    />
                  </div>
                  <div className="checkout-inline-fields">
                    <div>
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="month"
                        className="form-control"
                        value={paymentForm.expiryDate}
                        onChange={(event) =>
                          updatePaymentForm("expiryDate", event.target.value)
                        }
                        disabled={isPaying}
                      />
                    </div>
                    <div>
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength="4"
                        className="form-control"
                        placeholder="***"
                        value={paymentForm.cvv}
                        onChange={(event) =>
                          updatePaymentForm("cvv", event.target.value)
                        }
                        disabled={isPaying}
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === "wallet" && (
                <div className="payment-details-panel">
                  <div className="payment-panel-head">
                    <h6 className="mb-1">Wallet details</h6>
                    <p className="mb-0">
                      Select your wallet and provide the transaction proof.
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Wallet Provider</label>
                    <select
                      className="form-select"
                      value={paymentForm.walletProvider}
                      onChange={(event) =>
                        updatePaymentForm("walletProvider", event.target.value)
                      }
                      disabled={isPaying}
                    >
                      <option>eZ Cash</option>
                      <option>mCash</option>
                      <option>Dialog Genie</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Wallet Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0771234567"
                      value={paymentForm.walletNumber}
                      onChange={(event) =>
                        updatePaymentForm("walletNumber", event.target.value)
                      }
                      disabled={isPaying}
                    />
                  </div>
                  <div className="mb-0">
                    <label className="form-label">Transaction Reference</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Wallet transaction id"
                      value={paymentForm.walletReference}
                      onChange={(event) =>
                        updatePaymentForm("walletReference", event.target.value)
                      }
                      disabled={isPaying}
                    />
                  </div>
                </div>
              )}

              {selectedPaymentMethod === "bank" && (
                <div className="payment-details-panel">
                  <div className="payment-panel-head">
                    <h6 className="mb-1">Bank transfer details</h6>
                    <p className="mb-0">
                      Fill the bank info and transfer reference used for
                      payment.
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bank Name</label>
                    <select
                      className="form-select"
                      value={paymentForm.bankName}
                      onChange={(event) =>
                        updatePaymentForm("bankName", event.target.value)
                      }
                      disabled={isPaying}
                    >
                      <option>Bank of Ceylon</option>
                      <option>People's Bank</option>
                      <option>Commercial Bank</option>
                      <option>HNB</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Account Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name on the transferred account"
                      value={paymentForm.accountName}
                      onChange={(event) =>
                        updatePaymentForm("accountName", event.target.value)
                      }
                      disabled={isPaying}
                    />
                  </div>
                  <div className="mb-0">
                    <label className="form-label">Transfer Reference</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Bank transfer reference"
                      value={paymentForm.transferReference}
                      onChange={(event) =>
                        updatePaymentForm(
                          "transferReference",
                          event.target.value,
                        )
                      }
                      disabled={isPaying}
                    />
                  </div>
                </div>
              )}

              {checkoutError && (
                <div className="alert alert-danger rounded-4 mt-3 mb-0">
                  {checkoutError}
                </div>
              )}
            </div>

            <div className="checkout-footer">
              <button
                type="button"
                className="btn btn-outline-dark rounded-pill px-4"
                onClick={closeCheckout}
                disabled={isPaying}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-orange rounded-pill px-4"
                onClick={handlePay}
                disabled={isPaying}
              >
                {isPaying
                  ? "Processing..."
                  : `Pay Rs ${grandTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
