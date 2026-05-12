const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db = pool.promise();

const ensureBookingsAutoIncrement = async () => {
  const [rows] = await db.query(
    `SELECT EXTRA
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = 'bookings'
       AND COLUMN_NAME = 'id'`,
    [process.env.DB_NAME],
  );

  if (
    rows.length > 0 &&
    !String(rows[0].EXTRA || "").includes("auto_increment")
  ) {
    await db.query(
      "ALTER TABLE bookings MODIFY id int(11) NOT NULL AUTO_INCREMENT",
    );
  }
};

module.exports = db;
module.exports.ensureBookingsAutoIncrement = ensureBookingsAutoIncrement;
