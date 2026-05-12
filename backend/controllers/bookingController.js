const BookingModel = require("../models/bookingModel");

exports.createBookings = async (req, res) => {
  const { userId, bookings } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({ message: "bookings array is required" });
    }

    const createdBookings = [];

    for (const booking of bookings) {
      const eventId = booking.eventId || booking.event_id;
      const totalAmount = Number(
        booking.totalAmount || booking.total_amount || 0,
      );
      const status = booking.status || "confirmed";

      if (!eventId) {
        return res
          .status(400)
          .json({ message: "eventId is required for each booking" });
      }

      const id = await BookingModel.create({
        userId,
        eventId,
        totalAmount,
        status,
      });

      createdBookings.push({
        id,
        user_id: userId,
        event_id: eventId,
        booking_date: new Date().toISOString(),
        total_amount: totalAmount,
        status,
      });
    }

    res.status(201).json({
      message: "Booking created successfully",
      bookings: createdBookings,
    });
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
