const express = require("express");

const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const db = require("./Connection/db");
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("./controllers/userController");
const {
  authenticateToken,
  requireAdmin,
} = require("./middlewares/authMiddleware");
const { updateEvent, deleteEvent } = require("./controllers/eventController");

const app = express();
app.use(cors());
// Increase payload limit to 50mb for profile picture uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/bookings", bookingRoutes);
app.put("/api/events/admin/:id", authenticateToken, requireAdmin, updateEvent);
app.delete(
  "/api/events/admin/:id",
  authenticateToken,
  requireAdmin,
  deleteEvent,
);

// Routes
app.use("/api/users", userRoutes);
app.get("/api/users/admin/users", authenticateToken, requireAdmin, getAllUsers);
app.delete(
  "/api/users/admin/users/:id",
  authenticateToken,
  requireAdmin,
  deleteUser,
);
app.put(
  "/api/users/admin/users/:id/role",
  authenticateToken,
  requireAdmin,
  updateUserRole,
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.ensureBookingsAutoIncrement();
    await db.ensurePaymentsAutoIncrement();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
};

startServer();
