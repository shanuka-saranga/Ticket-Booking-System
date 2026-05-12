const express = require("express");

const router = express.Router();
const {
  createBookings,
  getBookingsByUserId,
  getAllBookingsForAdmin,
  deleteBooking,
} = require("../controllers/bookingController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");

router.post("/", createBookings);
router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  getAllBookingsForAdmin,
);
router.delete("/admin/:id", authenticateToken, requireAdmin, deleteBooking);
router.get("/user/:userId", getBookingsByUserId);

module.exports = router;
