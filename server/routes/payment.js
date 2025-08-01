// routes/payment.js

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

// Load env vars
// Note: It's best practice to load this in your main server.js file
// to avoid multiple calls. But for a standalone file, this is okay.
// require("dotenv").config();

const { RAZORPAY_KEY_ID, RAZORPAY_SECRET } = process.env;
if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
  // This is a good check. It will throw on server startup if vars are missing.
  // The server will not start if the keys are missing.
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
    console.log("Received request to create order with total:", total); // Log the received data

    if (!total) {
      console.log("Error: Missing total amount in request."); // Log error on server
      return res.status(400).json({ error: "Missing total amount in request" });
    }

    // Ensure the total is a number and valid
    if (typeof total !== 'number' || total <= 0) {
        console.log("Error: Invalid total amount received:", total);
        return res.status(400).json({ error: "Invalid total amount" });
    }

    const options = {
      amount: Math.round(total * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    console.log("Creating Razorpay order with options:", options); // Log the options payload

    const order = await razorpay.orders.create(options);
    console.log("Successfully created Razorpay order:", order); // Log the successful response
    res.status(200).json(order);
  } catch (err) {
    // This is the most likely place where an issue with Razorpay's API would manifest.
    console.error("Razorpay order creation error:", err.message);
    // It's possible the err object is not a simple string.
    // Let's log the entire error object for better insight.
    console.error("Full Razorpay error object:", err);
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

    console.log("Verifying payment with IDs:", razorpay_order_id, razorpay_payment_id);

    const signBody = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(signBody.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("Payment signature is valid.");
      res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      console.log("Payment signature is invalid.");
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Signature verification error:", err);
    res.status(500).json({ error: "Failed to verify payment", details: err.message });
  }
});

module.exports = router;