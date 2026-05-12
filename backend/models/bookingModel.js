const db = require("../Connection/db");

const BookingModel = {
  create: async ({ userId, eventId, totalAmount, status }) => {
    const [result] = await db.query(
      "INSERT INTO bookings (user_id, event_id, booking_date, total_amount, status) VALUES (?, ?, NOW(), ?, ?)",
      [userId, eventId, totalAmount, status],
    );

    return result.insertId;
  },

  getByUserId: async (userId) => {
    const [rows] = await db.query(
      "SELECT id, user_id, event_id, booking_date, total_amount, status FROM bookings WHERE user_id = ? ORDER BY booking_date DESC, id DESC",
      [userId],
    );

    return rows;
  },

  getAllWithUserAndEvent: async () => {
    const [rows] = await db.query(
      `SELECT 
        b.id, 
        b.user_id, 
        b.event_id, 
        b.booking_date, 
        b.total_amount, 
        b.status,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        e.title as event_title,
        e.location as event_location,
        e.event_date
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN events e ON b.event_id = e.id
      ORDER BY b.booking_date DESC, b.id DESC`,
    );

    return rows;
  },

  deleteById: async (id) => {
    const [result] = await db.query("DELETE FROM bookings WHERE id = ?", [id]);
    return result.affectedRows; // 1 if deleted, 0 if not found
  },
};

module.exports = BookingModel;
