const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  ],
  email: String,
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
  },
  paymentMethod: String,
  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Reached Nearby", "Delivered", "Returned"],
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Cash on Delivery", "Failed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },

  returnRequest: {
    requested: { type: Boolean, default: false },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Processing"],
      default: "Pending",
    },
    requestedAt: { type: Date },
  },
});
module.exports = mongoose.model("Order", orderSchema);
