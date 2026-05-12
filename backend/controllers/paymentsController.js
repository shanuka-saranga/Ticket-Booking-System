const crypto = require("crypto");

exports.generateHash = (req, res) => {
  const { order_id, amount, currency } = req.body;

  const merchant_id = process.env.PAYHERE_MERCHANT_ID;
  const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

  // 1. Merchant Secret එක MD5 කරලා Uppercase කරන්න
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchant_secret)
    .digest("hex")
    .toUpperCase();

  // 2. Amount එක 0.00 format එකට හදාගන්න
  const amountFormatted = parseFloat(amount).toFixed(2);

  // 3. සම්පූර්ණ Hash එක හදන්න
  const hash = crypto
    .createHash("md5")
    .update(merchant_id + order_id + amountFormatted + currency + hashedSecret)
    .digest("hex")
    .toUpperCase();

  res.json({ hash });
};
