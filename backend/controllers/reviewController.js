const reviewModel = require("../models/reviewModel");

const reviewController = {
  // Get all reviews for a specific event
  async getReviewsByEventId(req, res) {
    try {
      const { eventId } = req.params;
      const reviews = await reviewModel.getByEventId(eventId);
      res.status(200).json(reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  },

  // Get recent reviews for Home page
  async getRecentReviews(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 5;
      const reviews = await reviewModel.getRecent(limit);
      res.status(200).json(reviews);
    } catch (err) {
      console.error("Error fetching recent reviews:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch recent reviews: " + err.message });
    }
  },

  // Create a new review
  async createReview(req, res) {
    try {
      console.log("=== Review Creation Request ===");
      console.log("User from auth:", req.user);
      console.log("Headers:", {
        authorization: req.headers.authorization?.substring(0, 20) + "...",
      });

      const { userId, eventId, rating, comment } = req.body;

      console.log("Creating review with data:", {
        userId,
        eventId,
        rating,
        comment,
        authUserId: req.user?.id,
      });

      // Validation
      if (!userId || !eventId || !rating) {
        return res.status(400).json({
          error: "userId, eventId, and rating are required",
        });
      }

      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ error: "Rating must be between 1 and 5" });
      }

      const result = await reviewModel.create(
        userId,
        eventId,
        rating,
        comment || null,
      );

      console.log("Review created successfully with ID:", result.insertId);

      res.status(201).json({
        id: result.insertId,
        userId,
        eventId,
        rating,
        comment,
        message: "Review created successfully",
      });
    } catch (err) {
      console.error("Error creating review:", err);
      res.status(500).json({
        error: "Failed to create review: " + err.message,
      });
    }
  },

  // Update a review
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ error: "Rating must be between 1 and 5" });
      }

      const review = await reviewModel.getById(id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      await reviewModel.update(id, rating, comment || null);

      res.status(200).json({ message: "Review updated successfully" });
    } catch (err) {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Failed to update review" });
    }
  },

  // Delete a review
  async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const review = await reviewModel.getById(id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      await reviewModel.delete(id);

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
      console.error("Error deleting review:", err);
      res.status(500).json({ error: "Failed to delete review" });
    }
  },
};

module.exports = reviewController;
