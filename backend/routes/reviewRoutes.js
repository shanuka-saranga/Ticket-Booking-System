const express = require("express");
const router = express.Router();
const {
  getReviewsByEventId,
  getRecentReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Get recent reviews (for Home page)
router.get("/recent", getRecentReviews);

// Get all reviews for a specific event
router.get("/event/:eventId", getReviewsByEventId);

// Create a new review (requires authentication)
router.post("/", authenticateToken, createReview);

// Update a review (requires authentication)
router.put("/:id", authenticateToken, updateReview);

// Delete a review (requires authentication)
router.delete("/:id", authenticateToken, deleteReview);

module.exports = router;
