const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentsController");

router.post("/generate-hash", paymentController.generateHash);
router.post("/notify", (req, res) => res.status(200).send("OK"));

module.exports = router;
