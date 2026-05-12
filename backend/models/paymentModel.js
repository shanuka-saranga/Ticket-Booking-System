const db = require("../Connection/db");

const PaymentModel = {
  create: async (
    { bookingId, paymentMethod, transactionId, amount, status },
    connection = db,
  ) => {
    const [result] = await connection.query(
      "INSERT INTO payments (booking_id, payment_method, transaction_id, amount, payment_status) VALUES (?, ?, ?, ?, ?)",
      [bookingId, paymentMethod, transactionId, amount, status],
    );

    return result.insertId;
  },
};

module.exports = PaymentModel;
