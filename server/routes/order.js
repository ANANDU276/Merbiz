const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const sendOrderConfirmationEmail = require("../utils/sendEmail");

// Constants
const ALLOWED_STATUSES = [
  "Pending",
  "Shipped",
  "Reached Nearby",
  "Delivered",
  "Returned",
];
const ALLOWED_RETURN_ACTIONS = [
  "Pending",
  "Approved",
  "Rejected",
  "Processing",
];

// Utils
const isValidStatus = (status) => ALLOWED_STATUSES.includes(status);
const isValidReturnAction = (action) => ALLOWED_RETURN_ACTIONS.includes(action);

// POST /api/orders - Create a new order
router.post("/", async (req, res) => {
  try {
    const { email, items, total, ...rest } = req.body;

    if (!email || !items || !total) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const newOrder = new Order({ email, items, total, ...rest });
    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });

    // Send confirmation email (non-blocking)
    sendOrderConfirmationEmail(email, newOrder).catch((err) =>
      console.error("Failed to send confirmation email:", err.message)
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to place order", details: error.message });
  }
});

// GET /api/orders - Get all orders (admin use)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch orders", details: err.message });
  }
});

// GET /api/orders/user?email=... - Get orders by user email
router.get("/user", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  try {
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch user orders", details: err.message });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidStatus(status)) {
    return res
      .status(400)
      .json({ error: "Invalid status value", allowed: ALLOWED_STATUSES });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update order status", details: err.message });
  }
});

// PUT /api/orders/:id/return - Request a return
router.put("/:id/return", async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: "Return reason is required" });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if return is already requested
    if (order.returnRequest?.requested) {
      return res
        .status(400)
        .json({ error: "Return already requested for this order" });
    }

    // Check if order is eligible for return (e.g., delivered within last 30 days)
    const returnWindowDays = 30;
    const orderDate = new Date(order.createdAt);
    const returnDeadline = new Date(
      orderDate.setDate(orderDate.getDate() + returnWindowDays)
    );

    if (new Date() > returnDeadline) {
      return res.status(400).json({ error: "Return window has expired" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        returnRequest: {
          requested: true,
          reason,
          status: "Pending",
          requestedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    res.json({ message: "Return request submitted", order: updatedOrder });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to submit return request", details: err.message });
  }
});

// PUT /api/orders/:id/return/status - Process return request (admin)
router.put("/:id/return/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: id and status",
    });
  }

  if (!isValidReturnAction(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid return status",
      allowed: ALLOWED_RETURN_ACTIONS,
    });
  }

  try {
    // Start a session for transaction
    const session = await Order.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(id).session(session);
      if (!order) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          error: "Order not found",
        });
      }

      // Check if return was requested
      if (!order.returnRequest?.requested) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          error: "No return request for this order",
        });
      }

      const updateData = {
        "returnRequest.status": status,
        "returnRequest.processedAt": new Date(),
      };

      if (status === "Approved") {
        updateData.status = "Returned";
      }
      
      
      const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
        session,
      });

      await session.commitTransaction();
      session.endSession();

      res.json({
        success: true,
        message: `Return request ${status.toLowerCase()} successfully`,
        order: updatedOrder,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err; // This will be caught by the outer catch
    }
  } catch (err) {
    console.error("Return action processing error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to process return request",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
