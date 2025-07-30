const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  category: String,
  image: [String], // Changed from image to images: array of 3 image URLs
  rating: Number,
  description: String,
  topSelling: { type: Boolean, default: false }, // New field for top-selling
});

module.exports = mongoose.model("Product", ProductSchema);
