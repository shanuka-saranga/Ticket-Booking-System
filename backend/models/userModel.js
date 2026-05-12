const db = require("../Connection/db");

const UserModel = {
  create: async ({ name, email, password, role }) => {
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role],
    );
    return result.insertId;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  },

  updatePasswordByEmail: async (email, hashedPassword) => {
    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
    );

    return result.affectedRows > 0;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  },

  findAll: async () => {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, profileImage, role FROM users ORDER BY id DESC",
    );
    return rows;
  },

  deleteById: async (id) => {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  updateRole: async (id, role) => {
    const [result] = await db.query("UPDATE users SET role = ? WHERE id = ?", [
      role,
      id,
    ]);
    return result.affectedRows > 0;
  },

  update: async (id, { name, email, phone, profileImage }) => {
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (email !== undefined) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (phone !== undefined) {
      updateFields.push("phone = ?");
      updateValues.push(phone);
    }
    if (profileImage !== undefined) {
      updateFields.push("profileImage = ?");
      updateValues.push(profileImage);
    }

    if (updateFields.length === 0) {
      return null;
    }

    updateValues.push(id);

    const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;
    const [result] = await db.query(query, updateValues);

    return result.affectedRows > 0;
  },
};

module.exports = UserModel;
