const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db = pool.promise();

const ensureAutoIncrement = async (tableName) => {
  const [rows] = await db.query(
    `SELECT EXTRA
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = ?
       AND COLUMN_NAME = 'id'`,
    [process.env.DB_NAME, tableName],
  );

  if (
    rows.length > 0 &&
    !String(rows[0].EXTRA || "").includes("auto_increment")
  ) {
    await db.query(
      `ALTER TABLE ${tableName} MODIFY id int(11) NOT NULL AUTO_INCREMENT`,
    );
  }
};

const ensureBookingsAutoIncrement = async () => ensureAutoIncrement("bookings");
const ensurePaymentsAutoIncrement = async () => ensureAutoIncrement("payments");
const ensureReviewsAutoIncrement = async () => ensureAutoIncrement("reviews");

module.exports = db;
module.exports.ensureBookingsAutoIncrement = ensureBookingsAutoIncrement;
module.exports.ensurePaymentsAutoIncrement = ensurePaymentsAutoIncrement;
module.exports.ensureReviewsAutoIncrement = ensureReviewsAutoIncrement;
