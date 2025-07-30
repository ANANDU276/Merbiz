import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import iphone16 from "../../assets/iphone16.png";
import controller from "../../assets/controller.png";
import headphones from "../../assets/headphones.png";
import watch from "../../assets/watch.png";
import { CategoryContext } from "../../context/CategoryContext";

function Hero() {
  const { setSelectedCategory } = useContext(CategoryContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 -z-10"></div>

      {/* Main container */}
      <div className="l mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left column - Featured product */}
          <motion.div
            className="flex flex-col justify-center"
            variants={itemVariants}
          >
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                New Arrivals
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Elevate Your <span className="text-blue-600">Digital Life</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Discover cutting-edge technology designed to enhance your
                everyday experiences with premium quality and innovative
                features.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/phones"
                  onClick={() => setSelectedCategory("Phones")}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Shop Now <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/products"
                  className="flex items-center px-6 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
                >
                  Browse All
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
              {[
                { value: "10K+", label: "Products" },
                { value: "2M+", label: "Customers" },
                { value: "24/7", label: "Support" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column - Product showcase */}
          <motion.div className="relative" variants={itemVariants}>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl overflow-hidden h-full min-h-[500px] flex flex-col lg:flex-row items-center p-8">
              {/* Text content - left side */}
              <div className="lg:w-1/2 flex flex-col justify-center p-6 lg:p-8 order-2 lg:order-1">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-4">
                  NEW RELEASE
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  iPhone 16 Pro
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  The ultimate iPhone experience with our most advanced camera
                  system, A18 Pro chip, and revolutionary durability.
                </p>
                <div className="space-y-2 mb-8">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">
                      6.7" Super Retina XDR display
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">
                      Pro camera system with 5x zoom
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">All-day battery life</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/product/iphone-16-pro"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg text-center"
                  >
                    Buy Now
                  </Link>
                  <Link
                    to="/phones"
                    className="px-6 py-3 bg-white text-gray-800 font-medium rounded-lg border border-gray-200 text-center"
                  >
                    View All Phones
                  </Link>
                </div>
              </div>

              {/* Image - right side */}
              <div className="lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
                <motion.img
                  src={iphone16}
                  alt="iPhone 16 Pro"
                  className="w-full max-w-md object-contain"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Category cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            {
              id: 1,
              title: "Gaming Gear",
              description: "High-performance equipment",
              image: controller,
              category: "Gaming Gear",
              bgColor: "bg-purple-50",
              accentColor: "bg-purple-200",
              gradient: "from-purple-50/0 to-purple-50/100",
            },
            {
              id: 2,
              title: "Audio",
              description: "Immersive sound experience",
              image: headphones,
              category: "Headphones",
              bgColor: "bg-blue-50",
              accentColor: "bg-blue-200",
              gradient: "from-blue-50/0 to-blue-50/100",
            },
            {
              id: 3,
              title: "Wearables",
              description: "Tech for your lifestyle",
              image: watch,
              category: "watch",
              bgColor: "bg-pink-50",
              accentColor: "bg-pink-200",
              gradient: "from-pink-50/0 to-pink-50/100",
            },
            {
              id: 4,
              title: "Speakers",
              description: "Complete your setup",
              image: headphones,
              category: "speaker",
              bgColor: "bg-green-50",
              accentColor: "bg-green-200",
              gradient: "from-green-50/0 to-green-50/100",
            },
          ].map((item) => (
            <Link
              key={item.id}
              to="/productpage"
              onClick={() => setSelectedCategory(item.category)}
              className={`relative rounded-xl p-6 h-full overflow-hidden`}
            >
              {/* Background with opacity gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${item.gradient}`}
              ></div>

              {/* Color accent circle */}
              <div
                className={`absolute -right-10 -top-10 w-32 h-32 ${item.accentColor} rounded-full filter blur-3xl opacity-30`}
              ></div>

              <div className="relative z-10 flex h-full">
                {/* Text Content - 50% width */}
                <div className="w-1/2 pr-4 flex flex-col justify-between">
                  <div>
                    <h3 className={"text-xl font-semibold"}>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Image - 50% width */}
                <div className="w-1/2 flex items-center justify-center">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="h-full max-h-40 w-auto object-contain"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
