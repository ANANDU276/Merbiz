// routes/payment.js

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

// ✅ Load env vars
require("dotenv").config();

const { RAZORPAY_KEY_ID, RAZORPAY_SECRET } = process.env;
if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
  throw new Error("❌ Missing Razorpay credentials in .env file");
}

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET,
});

// ✅ Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { total } = req.body;

    if (!total) {
      return res.status(400).json({ error: "Missing total amount in request" });
    }

    const options = {
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({
      error: "Failed to create Razorpay order",
      details: err.message,
    });
  }
});

// ✅ Verify Razorpay Payment Signature
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const signBody = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(signBody.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Signature verification error:", err);
    res.status(500).json({ error: "Failed to verify payment", details: err.message });
  }
});

module.exports = router;
