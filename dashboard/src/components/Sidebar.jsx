import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaUser,
  FaShoppingCart,
  FaClipboardList,
  FaStar,
  FaUserShield,
  FaChevronDown,
  FaChevronRight,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith("/products")) {
      setIsProductsOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const handleKeyDown = (e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(path);
    }
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
      isActive
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  const dropdownLinkClasses = ({ isActive }) =>
    `block p-2 pl-11 rounded-md transition-colors text-sm ${
      isActive
        ? "bg-blue-50 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-600"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 w-60 h-screen bg-white p-4 shadow-md flex flex-col left-0 top-0 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-20" : "md:w-60"}`}
      >
        {/* Collapse Button */}
        <button
          className="hidden md:flex absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-all"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaChevronRight 
            className={`text-gray-600 transition-transform duration-200 ${
              isCollapsed ? "" : "rotate-180"
            }`} 
          />
        </button>

        {/* Logo with link to dashboard */}
        <NavLink
          to="/"
          className={`mb-6 px-3 hover:opacity-80 transition-opacity flex items-center ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          
          {!isCollapsed && (
            <span className="ml-2 text-lg font-semibold">Merbiz</span>
          )}
        </NavLink>

        {/* Navigation */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          <NavLink to="/" end className={linkClasses}>
            <div className="flex items-center gap-3">
              <FaChartLine className="text-lg flex-shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </div>
          </NavLink>

          <NavLink to="/users" className={linkClasses}>
            <div className="flex items-center gap-3">
              <FaUser className="text-lg flex-shrink-0" />
              {!isCollapsed && <span>Users</span>}
            </div>
            {!isCollapsed && location.pathname === "/users" && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                New
              </span>
            )}
          </NavLink>

          {/* Products Dropdown */}
          {!isCollapsed && (
            <div className="space-y-1">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  location.pathname.startsWith("/products")
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-expanded={isProductsOpen}
                aria-controls="products-dropdown"
              >
                <div className="flex items-center gap-3">
                  <FaShoppingCart className="text-lg flex-shrink-0" />
                  <span>Products</span>
                </div>
                {isProductsOpen ? (
                  <FaChevronDown className="text-xs" />
                ) : (
                  <FaChevronRight className="text-xs" />
                )}
              </button>

              <div
                id="products-dropdown"
                className={`pl-4 space-y-1 overflow-hidden transition-all duration-200 ${
                  isProductsOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink
                  to="/products"
                  className={dropdownLinkClasses}
                  end
                  tabIndex={isProductsOpen ? 0 : -1}
                >
                  List Products
                </NavLink>
                <NavLink
                  to="/products/addproduct"
                  className={dropdownLinkClasses}
                  tabIndex={isProductsOpen ? 0 : -1}
                >
                  Add Product
                </NavLink>
              </div>
            </div>
          )}

          {isCollapsed && (
            <NavLink
              to="/products"
              className={linkClasses}
              title="Products"
              aria-label="Products"
            >
              <div className="flex items-center justify-center w-full">
                <FaShoppingCart className="text-lg flex-shrink-0" />
              </div>
            </NavLink>
          )}

          <NavLink to="/orders" className={linkClasses}>
            <div className="flex items-center gap-3">
              <FaClipboardList className="text-lg flex-shrink-0" />
              {!isCollapsed && <span>Orders</span>}
            </div>
            {!isCollapsed && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                5
              </span>
            )}
          </NavLink>

          <NavLink to="/reviews" className={linkClasses}>
            <div className="flex items-center gap-3">
              <FaStar className="text-lg flex-shrink-0" />
              {!isCollapsed && <span>Reviews</span>}
            </div>
            {!isCollapsed && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                3
              </span>
            )}
          </NavLink>

          <NavLink to="/admins" className={linkClasses}>
            <div className="flex items-center gap-3">
              <FaUserShield className="text-lg flex-shrink-0" />
              {!isCollapsed && <span>Admins</span>}
            </div>
          </NavLink>
        </nav>

        {/* User profile and settings */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div
            className={`flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            onClick={() => navigate("/settings")}
            onKeyDown={(e) => handleKeyDown(e, "/settings")}
            role="button"
            tabIndex={0}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                AD
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">
                  admin@example.com
                </p>
              </div>
            )}
            {!isCollapsed && (
              <div className="flex gap-2">
                <button
                  className="p-1 rounded-full hover:bg-gray-200"
                  title="Settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/settings");
                  }}
                >
                  <FaCog className="text-gray-500" />
                </button>
                <button
                  className="p-1 rounded-full hover:bg-gray-200"
                  title="Logout"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle logout
                  }}
                >
                  <FaSignOutAlt className="text-gray-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}