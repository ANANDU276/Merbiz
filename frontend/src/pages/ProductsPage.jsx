import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";
import { CategoryContext } from "../context/CategoryContext";
import ReactSlider from "react-slider";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortOption, setSortOption] = useState("popularity");
  const { selectedCategory } = useContext(CategoryContext);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        const filteredData = selectedCategory
          ? data.filter(
              (product) =>
                product.category.toLowerCase() ===
                selectedCategory.toLowerCase()
            )
          : data;

        setProducts(filteredData);
        setFilteredProducts(filteredData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [selectedCategory]);

  // Filter based on search and price
  useEffect(() => {
    let result = products;

    if (searchTerm.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(result);
  }, [searchTerm, products, priceRange]);

  // Apply sorting to filtered products
  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];
    
    switch (sortOption) {
      case "price-low-high":
        return productsToSort.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return productsToSort.sort((a, b) => b.price - a.price);
      case "newest":
        return productsToSort.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      case "rating":
        return productsToSort.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "popularity":
      default:
        // Default sorting (could be based on views, sales, etc.)
        return productsToSort.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
  }, [filteredProducts, sortOption]);

  if (loading)
    return <div className="text-center py-10">Loading products...</div>;

  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <main className="px-4 py-10 mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Products</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">FILTERS</h3>
              <button
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setSearchTerm("");
                  setPriceRange([0, 100000]);
                }}
              >
                Clear all
              </button>
            </div>

            {/* Search Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">SEARCH</h4>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">CATEGORIES</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!selectedCategory}
                    readOnly
                  />
                  <label className="text-gray-700 text-sm capitalize">
                    {selectedCategory || "All categories"}
                  </label>
                </div>
              </div>
            </div>

            {/* Price Range Filter with Dual Thumb Slider */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">PRICE RANGE</h4>
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
              <ReactSlider
                className="w-full h-2 bg-gray-200 rounded-lg"
                thumbClassName="h-4 w-4 bg-blue-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 -mt-1"
                trackClassName="h-2 bg-blue-300 rounded"
                min={0}
                max={100000}
                step={1000}
                value={priceRange}
                onChange={(range) => setPriceRange(range)}
                minDistance={1000}
              />
            </div>

            {/* In Stock Filter (disabled placeholder) */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled
                />
                <label className="text-gray-700 text-sm">In stock only</label>
              </div>
            </div>
          </div>
        </div>

        {/* Products Listing */}
        <div className="flex-1">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing {sortedProducts.length} of {products.length} products
                {searchTerm && ` for "${searchTerm}"`}
              </p>

              {/* Sort Options */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Sort By:</span>
                <select 
                  className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low-high">Price - Low to High</option>
                  <option value="price-high-low">Price - High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `No products found for "${searchTerm}"`
                  : "No products available."}
              </p>
              {searchTerm && (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;