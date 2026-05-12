const db = require("../Connection/db");

const EventModel = {
  getCategories: async () => {
    const [categories] = await db.query(
      "SELECT id, name FROM categories ORDER BY name ASC",
    );
    return categories;
  },

  getAll: async () => {
    const [events] = await db.query(
      "SELECT id, title, description, location, event_date, image_url, category_id, organizer_id FROM events",
    );
    return events;
  },

  getById: async (id) => {
    const [events] = await db.query(
      "SELECT id, title, description, location, event_date, image_url, category_id, organizer_id FROM events WHERE id = ?",
      [id],
    );
    return events[0] || null;
  },

  updateById: async (
    id,
    {
      title,
      description,
      location,
      event_date,
      image_url,
      category_id,
      organizer_id,
    },
  ) => {
    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (location !== undefined) {
      fields.push("location = ?");
      values.push(location);
    }
    if (event_date !== undefined) {
      fields.push("event_date = ?");
      values.push(event_date);
    }
    if (image_url !== undefined) {
      fields.push("image_url = ?");
      values.push(image_url);
    }
    if (category_id !== undefined) {
      fields.push("category_id = ?");
      values.push(category_id);
    }
    if (organizer_id !== undefined) {
      fields.push("organizer_id = ?");
      values.push(organizer_id);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);

    const [result] = await db.query(
      `UPDATE events SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows > 0;
  },

  deleteById: async (id) => {
    const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  create: async ({
    title,
    description,
    location,
    event_date,
    image_url,
    category_id,
    organizer_id,
  }) => {
    const [result] = await db.query(
      "INSERT INTO events (title, description, location, event_date, image_url, category_id, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        location,
        event_date,
        image_url,
        category_id || null,
        organizer_id || null,
      ],
    );

    return result.insertId;
  },
};

module.exports = EventModel;
