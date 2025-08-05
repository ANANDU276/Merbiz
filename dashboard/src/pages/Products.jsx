import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaFileExport,
} from "react-icons/fa";

import DefaultProductImage  from "../assets/default-product-image.jpg"



function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setAllProducts(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Delete product handler
const handleDelete = async (productId) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;
  try {
    await axios.delete(`http://localhost:5000/api/products/${productId}`);
    setAllProducts((prev) => prev.filter((p) => p._id !== productId));
  } catch (error) {
    console.error("Failed to delete product", error);
    alert("Failed to delete product.");
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, allProducts]);

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "bg-red-500" };
    if (stock < 10) return { text: "Low Stock", color: "bg-yellow-500" };
    return { text: "In Stock", color: "bg-green-500" };
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Product Inventory
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your product catalog and inventory
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
              <FaFileExport className="w-4 h-4 mr-2" />
              Export
            </button>
            <Link to="/products/addproduct">
              <button className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center">
                <FaPlus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={allProducts.length}
            icon="📦"
            trend="up"
            change="5% from last month"
          />
          <StatCard
            title="Out of Stock"
            value={allProducts.filter((p) => p.stock === 0).length}
            icon="⚠️"
            trend="alert"
            change="Attention needed"
          />
          <StatCard
            title="Avg. Rating"
            value={
              allProducts.length > 0
                ? (
                    allProducts.reduce((sum, p) => sum + p.rating, 0) /
                    allProducts.length
                  ).toFixed(1)
                : 0
            }
            icon="⭐"
            trend="neutral"
            change="Stable"
          />
          <StatCard
            title="Categories"
            value={[...new Set(allProducts.map((p) => p.category))].length}
            icon="🏷️"
            trend="up"
            change="2 new categories"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              All Products
            </h2>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Price</TableHeader>
                  <TableHeader>Stock Status</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Rating</TableHeader>
                  <TableHeader align="right">Actions</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ProductCell product={product} />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ₹{product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span
                              className={`h-3 w-3 rounded-full ${stockStatus.color} mr-2`}
                            />
                            <span className="text-sm text-gray-900">
                              {stockStatus.text} ({product.stock})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <CategoryBadge category={product.category} />
                        </td>
                        <td className="px-6 py-4">
                          <RatingDisplay rating={product.rating} />
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                       <ActionButtons productId={product._id} onDelete={handleDelete} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {products.length > productsPerPage && (
            <div className="bg-white px-5 py-3 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
                totalItems={products.length}
                itemsPerPage={productsPerPage}
                indexOfFirstItem={indexOfFirstProduct + 1}
                indexOfLastItem={Math.min(indexOfLastProduct, products.length)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Reusable Components ----------

function TableHeader({ children, align = "left" }) {
  return (
    <th
      className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}
    >
      {children}
    </th>
  );
}
function ProductCell({ product }) {
  const [imgSrc, setImgSrc] = useState(product.image[0] || DefaultProductImage);

  return (
    <div className="flex items-center">
      <div className="h-10 w-10 flex-shrink-0">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(DefaultProductImage)}
          className="h-10 w-10 rounded object-cover"
        />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{product.name}</div>
        <div className="text-sm text-gray-500">
          {product.description?.slice(0, 40)}...
        </div>
      </div>
    </div>
  );
}

function CategoryBadge({ category }) {
  return (
    <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
      {category}
    </span>
  );
}

function RatingDisplay({ rating }) {
  return (
    <div className="flex items-center">
      <span className="text-yellow-500 mr-1">★</span>
      <span className="text-sm font-medium text-gray-900">{rating}</span>
      <span className="text-gray-500 text-xs ml-1">/5</span>
    </div>
  );
}

function ActionButtons({ productId, onDelete }) {
  return (
    <div className="flex justify-end space-x-3">
      <Link to={`/products/productdetail/${productId}`}>
        <button
          className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
          title="View"
        >
          <FaEye className="w-4 h-4" />
        </button>
      </Link>
      <Link to={`/products/updateproduct/${productId}`}>
        <button
          className="text-blue-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50"
          title="Edit"
        >
          <FaEdit className="w-4 h-4" />
        </button>
      </Link>
      <button
        onClick={() => onDelete(productId)}
        className="text-red-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50"
        title="Delete"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
}


function Pagination({
  currentPage,
  totalPages,
  paginate,
  totalItems,
  itemsPerPage,
  indexOfFirstItem,
  indexOfLastItem,
}) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center">
      <p className="text-sm text-gray-700 mb-2 sm:mb-0">
        Showing <span className="font-medium">{indexOfFirstItem}</span> to{" "}
        <span className="font-medium">{indexOfLastItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </p>
      <div className="inline-flex rounded-md shadow-sm -space-x-px">
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          ←
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 border text-sm font-medium ${
              number === currentPage
                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, change }) {
  const trendColors = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    alert: "text-yellow-600 bg-yellow-100",
    neutral: "text-gray-600 bg-gray-100",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div
        className={`mt-4 inline-flex items-center text-sm px-2 py-1 rounded-full ${trendColors[trend]}`}
      >
        {change}
      </div>
    </div>
  );
}

export default Products;
