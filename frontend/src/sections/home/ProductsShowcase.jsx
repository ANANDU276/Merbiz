import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../api/productsApi";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaArrowRight } from "react-icons/fa";

const ProductsShowcase = () => {
  const [products, setProducts] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        // Filter only top-selling products
        const topSellingProducts = data.filter(product => product.topSelling);
        
        if (topSellingProducts.length > 0) {
          // Select random featured product
          const randomFeaturedIndex = Math.floor(Math.random() * topSellingProducts.length);
          setFeaturedProduct(topSellingProducts[randomFeaturedIndex]);
          
          // Remove featured product from the grid display
          const productsForGrid = [...topSellingProducts];
          productsForGrid.splice(randomFeaturedIndex, 1);
          
          // Shuffle remaining products randomly
          const shuffledProducts = productsForGrid.sort(() => 0.5 - Math.random());
          
          // Take first 12 or less (since we already have 1 featured)
          setProducts(shuffledProducts.slice(0, 12));
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading)
    return (
      <div className="min-h-[40vh] flex justify-center items-center">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-blue-500" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center py-10">
        <p>Error loading products</p>
        <p className="text-sm">{error}</p>
      </div>
    );

  // If no top-selling products found
  if (!loading && products.length === 0 && !featuredProduct) {
    return (
      <section className="px-4 py-12">
        <div className="text-center py-10">
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            No top-selling products found
          </h2>
          <p className="text-gray-500 mb-4">
            Check back later for our featured products
          </p>
          <Link
            to="/shop"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse All Products <FaArrowRight className="inline ml-1" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12">
      {/* Featured Block */}
      <div className="mb-10 bg-blue-50 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow overflow-hidden relative">
        {/* Background image pattern */}
        <div className="absolute inset-0 opacity-5">
          {featuredProduct?.image?.[0] && (
            <img 
              src={featuredProduct.image[0]} 
              alt="" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="flex-1 z-10">
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-sm" />
            ))}
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              FEATURED TOP SELLER
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {featuredProduct?.name || "Our Top-Selling Products"}
          </h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {featuredProduct?.description || "Customer favorites that everyone's loving. High-quality, top-reviewed items you can trust."}
          </p>
          {featuredProduct && (
            <Link
              to={`/products/${featuredProduct._id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View this product <FaArrowRight className="ml-1" />
            </Link>
          )}
        </div>
        
        {featuredProduct?.image?.[0] && (
          <div className="flex-shrink-0 w-full sm:w-48 h-48 overflow-hidden z-10">
            <img
              src={featuredProduct.image[0]}
              alt={featuredProduct.name}
              className="w-full h-full object-contain p-2"
            />
          </div>
        )}
      </div>

      {/* Product Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProductsShowcase;