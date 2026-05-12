const BookingModel = require("../models/bookingModel");
const PaymentModel = require("../models/paymentModel");

const buildTransactionId = (paymentMethod, bookingId, index) => {
  const safeMethod = String(paymentMethod || "payment")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return `TXN-${safeMethod}-${bookingId}-${Date.now()}-${index + 1}`;
};

exports.createBookings = async (req, res) => {
  const { userId, bookings, payment } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({ message: "bookings array is required" });
    }

    const normalizedPayment = payment || {};
    const paymentMethod = String(normalizedPayment.paymentMethod || "card")
      .trim()
      .toLowerCase();
    const paymentStatus = "success";

    const connection = await BookingModel.getConnection();
    try {
      await connection.beginTransaction();

      const createdBookings = [];

      for (let index = 0; index < bookings.length; index += 1) {
        const booking = bookings[index];
        const eventId = booking.eventId || booking.event_id;
        const totalAmount = Number(
          booking.totalAmount || booking.total_amount || 0,
        );
        const status = booking.status || "confirmed";

        if (!eventId) {
          await connection.rollback();
          return res
            .status(400)
            .json({ message: "eventId is required for each booking" });
        }

        const bookingId = await BookingModel.create(
          {
            userId,
            eventId,
            totalAmount,
            status,
          },
          connection,
        );

        const transactionId = buildTransactionId(
          paymentMethod,
          bookingId,
          index,
        );

        await PaymentModel.create(
          {
            bookingId,
            paymentMethod,
            transactionId,
            amount: totalAmount,
            status: paymentStatus,
          },
          connection,
        );

        createdBookings.push({
          id: bookingId,
          user_id: userId,
          event_id: eventId,
          booking_date: new Date().toISOString(),
          total_amount: totalAmount,
          status,
          payment: {
            payment_method: paymentMethod,
            transaction_id: transactionId,
            amount: totalAmount,
            payment_status: paymentStatus,
          },
        });
      }

      await connection.commit();

      res.status(201).json({
        message: "Booking created successfully",
        bookings: createdBookings,
      });
    } catch (transactionError) {
      await connection.rollback();
      throw transactionError;
    } finally {
      connection.release();
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create booking", error: err.message });
  }
};

exports.getBookingsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await BookingModel.getByUserId(userId);
    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: err.message });
  }
};

exports.getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await BookingModel.getAllWithUserAndEvent();
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: err.message,
    });
  }
};

exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const affected = await BookingModel.deleteById(id);

    if (!affected) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete booking", error: err.message });
  }
};
