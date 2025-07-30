const express = require("express");
const router = express.Router();
const Product = require("../models/Products");

// ✅ Create a new product
router.post("/", async (req, res) => {
  try {
    const { image } = req.body;

    // ✅ Validate that images is an array of exactly 3 URLs
    if (!Array.isArray(image) || image.length !== 3) {
      return res
        .status(400)
        .json({ error: "Product must have exactly 3 image URLs" });
    }

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add product", details: error.message });
  }
});

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: error.message });
  }
});

// ✅ Get top-selling products
router.get("/top-selling", async (req, res) => {
  try {
    const topProducts = await Product.find({ topSelling: true });
    res.status(200).json(topProducts);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch top-selling products",
        details: error.message,
      });
  }
});

// ✅ Get a product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch product", details: error.message });
  }
});

// ✅ Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update product", details: error.message });
  }
});

// ✅ Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete product", details: error.message });
  }
});

module.exports = router;
