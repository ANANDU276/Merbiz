import React from 'react';
import { FaAward, FaHeadset, FaShippingFast, FaLeaf, FaHandsHelping } from 'react-icons/fa';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import teamImage from '../assets/default-product-image.jpg'; // Replace with your team image
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Our Story
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-lg mx-auto text-xl text-gray-300"
            >
              Redefining online shopping with quality, convenience, and exceptional service.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10 lg:mb-0"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Who We Are
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Founded in 2015, ShopEase began as a small startup with a big vision - to make online shopping effortless 
              and enjoyable. Today, we're one of the fastest growing e-commerce platforms, serving millions of happy 
              customers across the country.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Our team of passionate individuals works tirelessly to bring you the best products at competitive prices, 
              with a shopping experience that's seamless from start to finish.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-lg overflow-hidden shadow-xl"
          >
            <img
              className="w-full h-full object-cover"
              src={teamImage}
              alt="Our team working together"
            />
            <div className="absolute inset-0 bg-blue-600 mix-blend-multiply"></div>
          </motion.div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              These principles guide everything we do at ShopEase
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <FaAward className="h-10 w-10 text-blue-600" />,
                title: "Quality First",
                description: "We rigorously vet every product to ensure it meets our high standards before it reaches you."
              },
              {
                icon: <FaHeadset className="h-10 w-10 text-blue-600" />,
                title: "Customer Obsession",
                description: "Your satisfaction is our top priority. Our support team is always ready to help."
              },
              {
                icon: <FaShippingFast className="h-10 w-10 text-blue-600" />,
                title: "Fast & Reliable",
                description: "We've optimized our logistics network to get your orders to you as quickly as possible."
              },
              {
                icon: <FaLeaf className="h-10 w-10 text-blue-600" />,
                title: "Sustainability",
                description: "We're committed to eco-friendly practices and reducing our environmental impact."
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-50">
                  {value.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{value.title}</h3>
                <p className="mt-2 text-base text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { number: "5M+", label: "Happy Customers" },
              { number: "100K+", label: "Products Available" },
              { number: "24/7", label: "Customer Support" },
              { number: "98%", label: "Positive Reviews" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl font-extrabold text-white">{stat.number}</p>
                <p className="mt-2 text-lg font-medium text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Promise */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10 lg:mb-0 order-last lg:order-first"
          >
            <img
              className="w-full rounded-lg shadow-xl"
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Happy customer with package"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Promise to You
            </h2>
            <div className="mt-8 space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                    <FiPackage className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Hassle-Free Returns</h3>
                  <p className="mt-1 text-gray-600">
                    30-day return policy - no questions asked. We make returns easy and convenient.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                    <FaHandsHelping className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Personalized Service</h3>
                  <p className="mt-1 text-gray-600">
                    Our customer care specialists are available round the clock to assist you.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                    <FiShoppingBag className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Curated Selection</h3>
                  <p className="mt-1 text-gray-600">
                    We carefully select each product in our catalog to ensure quality and value.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to experience the ShopEase difference?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
            Join millions of happy customers who shop with confidence.
          </p>
          <div className="mt-8">
            <a
              href="/productpage"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;