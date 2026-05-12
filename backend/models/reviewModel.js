const db = require("../Connection/db");

const reviewModel = {
  // Get all reviews for an event
  async getByEventId(eventId) {
    try {
      const [reviews] = await db.query(
        `SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.event_id = ?
         ORDER BY r.created_at DESC`,
        [eventId],
      );
      return reviews;
    } catch (err) {
      throw err;
    }
  },

  // Get recent reviews across all events (for Home page)
  async getRecent(limit = 5) {
    try {
      const [reviews] = await db.query(
        `SELECT r.id, r.event_id, r.rating, r.comment, r.created_at, 
                u.name as user_name, e.title as event_title, e.image_url
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         LEFT JOIN events e ON r.event_id = e.id
         WHERE r.comment IS NOT NULL AND r.comment != ''
         ORDER BY r.created_at DESC
         LIMIT ${limit}`,
      );
      return reviews;
    } catch (err) {
      throw err;
    }
  },

  // Create a new review
  async create(userId, eventId, rating, comment) {
    try {
      const [result] = await db.query(
        `INSERT INTO reviews (user_id, event_id, rating, comment, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [userId, eventId, rating, comment],
      );
      return result;
    } catch (err) {
      throw err;
    }
  },

  // Get a specific review
  async getById(reviewId) {
    try {
      const [reviews] = await db.query(`SELECT * FROM reviews WHERE id = ?`, [
        reviewId,
      ]);
      return reviews.length > 0 ? reviews[0] : null;
    } catch (err) {
      throw err;
    }
  },

  // Update a review
  async update(reviewId, rating, comment) {
    try {
      const [result] = await db.query(
        `UPDATE reviews SET rating = ?, comment = ? WHERE id = ?`,
        [rating, comment, reviewId],
      );
      return result;
    } catch (err) {
      throw err;
    }
  },

  // Delete a review
  async delete(reviewId) {
    try {
      const [result] = await db.query(`DELETE FROM reviews WHERE id = ?`, [
        reviewId,
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = reviewModel;
