import React from "react";
import { Link } from "react-router-dom";

const PopularCategories = () => {
  const categories = [
    "Headphones",
    "Phones",
    "Speakers",
    "Smart Watches",
    "Gaming",
    "Laptops",
  ];

  const brands = [
    { name: "Amiga" },
    { name: "STELA" },
    { name: "Johnson&Berg" },
    { name: "HelenSmith" },
    { name: "Johnson&Berg" },
    { name: "Amiga" },
    { name: "STELA" },
    { name: "Johnson&Berg" },
    { name: "Amiga" },
    { name: "STELA" },
    { name: "Johnson&Berg" },
    { name: "HelenSmith" },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Categories Section */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Popular Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${category.toLowerCase()}`}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-center"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {category}
              </h3>
            </Link>
          ))}
        </div>

        {/* Brands Section */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Featured Brands
        </h2>

        <div className="overflow-hidden relative w-full">
          <div className="flex animate-marquee whitespace-nowrap gap-6 text-lg font-medium text-gray-700">
            {[...brands, ...brands].map((brand, index) => (
              <span key={index} className="flex items-center gap-3">
                <Link
                  to={`/products?brand=${brand.name.toLowerCase()}`}
                  className="hover:underline transition"
                >
                  {brand.name}
                </Link>
                <span className="text-gray-400">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;