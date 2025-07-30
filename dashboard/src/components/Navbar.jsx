import React, { useState } from "react";
import { FaSearch, FaBell, FaBars } from "react-icons/fa"; // Import FaBars for the hamburger icon

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar/drawer

  const handleLogin = () => {
    // Replace this with real auth logic
    setIsLoggedIn(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // In a real app, you'd likely pass this state up to a parent
    // or use a context to control the actual sidebar component.
  };

  return (
    // Use justify-between to push hamburger left and icons right
    // Adjust horizontal padding for different screen sizes: px-4 on mobile, px-6 on larger
    <header className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-white shadow-sm relative z-10">
      {/* Hamburger Menu (visible on small screens) */}
      {/* Assuming the hamburger menu would toggle a sidebar. */}
      <button
        onClick={toggleSidebar}
        className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl md:hidden focus:outline-none" // Hidden on md and up
      >
        <FaBars />
      </button>

      {/* Placeholder for a Logo or Brand Name (visible on medium and up) */}
      {/* You can replace this with your actual logo/brand component */}
      <div className="hidden md:block text-xl font-bold text-gray-800">
        Your Logo
      </div>

      {/* Right-aligned Icons and User Info */}
      {/* Adjust gap for smaller screens: gap-3 on mobile, gap-4 on small, gap-6 on larger */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        {/* Search Icon */}
        <button className="text-gray-500 hover:text-gray-700 text-base sm:text-lg focus:outline-none">
          <FaSearch />
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-1 cursor-pointer">
          <img
            src="https://flagcdn.com/w40/gb.png"
            alt="Language"
            className="h-4 w-4 sm:h-5 sm:w-5 rounded-sm" // Smaller flag on mobile
          />
        </div>

        {/* Notification with Badge */}
        <div className="relative cursor-pointer">
          <FaBell className="text-gray-500 hover:text-gray-700 text-base sm:text-lg" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] sm:text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
            2
          </span>{" "}
          {/* Smaller badge on mobile */}
        </div>

        {/* Login / User Avatar */}
        {isLoggedIn ? (
          <img
            src="https://i.pravatar.cc/40?img=10"
            alt="User"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-gray-200 object-cover" // Smaller avatar on mobile
          />
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-md focus:outline-none" // Smaller button on mobile
          >
            Login
          </button>
        )}
      </div>

      {/* Optional: Overlay/Sidebar for mobile menu */}
      {/* This is a basic example; a full sidebar component would be more complex */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleSidebar}></div>
      )}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 z-30 transform transition-transform duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav>
            <ul>
              <li className="mb-2"><a href="#" className="text-gray-700 hover:text-blue-600" onClick={toggleSidebar}>Dashboard</a></li>
              <li className="mb-2"><a href="#" className="text-gray-700 hover:text-blue-600" onClick={toggleSidebar}>Products</a></li>
              <li className="mb-2"><a href="#" className="text-gray-700 hover:text-blue-600" onClick={toggleSidebar}>Orders</a></li>
              {/* Add more menu items */}
            </ul>
          </nav>
          <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-500 text-2xl">&times;</button>
        </div>
      )}
    </header>
  );
}