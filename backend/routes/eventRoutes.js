const express = require("express");
const router = express.Router();
const {
  getCategories,
  getAllEvents,
  getEventById,
  getTicketTypesByEventId,
  updateEvent,
  deleteEvent,
  createEvent,
} = require("../controllers/eventController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");

router.get("/", getAllEvents);
router.get("/categories", getCategories);
router.get("/:id", getEventById);
router.get("/:id/ticket-types", getTicketTypesByEventId);
router.post("/admin/create", authenticateToken, requireAdmin, createEvent);
router.put("/admin/:id", authenticateToken, requireAdmin, updateEvent);
router.delete("/admin/:id", authenticateToken, requireAdmin, deleteEvent);

module.exports = router;
