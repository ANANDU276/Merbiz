const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

// ✅ Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const { RAZORPAY_KEY_ID, RAZORPAY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
    console.error("❌ Missing Razorpay credentials in environment");
    return res.status(500).json({ error: "Missing Razorpay credentials in .env file" });
  }

  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET,
  });

  try {
    const { total } = req.body;
    console.log("🟢 Received request to create order. Total:", total);

    if (!total || typeof total !== "number" || total <= 0) {
      console.warn("❌ Invalid total amount received:", total);
      return res.status(400).json({ error: "Invalid or missing total amount" });
    }

    const options = {
      amount: Math.round(total * 100), // Convert INR to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    console.log("🔧 Creating Razorpay order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", order);

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Error creating Razorpay order:", err?.response?.data || err.message || err);
    res.status(500).json({
      error: "Failed to create Razorpay order",
      details: err.message || "Unknown error",
    });
  }
});

// ✅ Verify Razorpay Payment Signature
router.post("/verify-payment", (req, res) => {
  const { RAZORPAY_SECRET } = process.env;

  if (!RAZORPAY_SECRET) {
    console.error("❌ Missing Razorpay secret in environment");
    return res.status(500).json({ error: "Missing Razorpay secret in .env file" });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    console.log("🔍 Verifying payment:", {
      razorpay_order_id,
      razorpay_payment_id,
    });

    const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(signBody)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment verified successfully.");
      res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      console.warn("❌ Invalid Razorpay signature");
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("❌ Payment signature verification error:", err);
    res.status(500).json({
      error: "Failed to verify payment",
      details: err.message || "Unknown error",
    });
  }
});

module.exports = router;
