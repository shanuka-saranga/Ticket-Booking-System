const db = require("../Connection/db"); // ඔයාගේ DB Connection එක

const TicketTypeModel = {
  getByEventId: async (eventId) => {
    try {
      const [rows] = await db.query(
        `SELECT id, event_id, type_name, price, total_quantity, available_quantity 
         FROM ticket_types 
         WHERE event_id = ? 
         ORDER BY price ASC`,
        [eventId],
      );
      return rows;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = TicketTypeModel;
