import React from "react";
import { products, Users, orders } from "../data/data";
import {
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiAlertTriangle,
  FiTrendingUp,
  FiChevronRight,
} from "react-icons/fi";

export default function Dashboard() {
  // Calculate stats from data
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = Users.length;
  const totalProducts = products.length;
  const lowStockItems = products.filter((product) => product.stock < 10).length;

  // Calculate monthly revenue
  const monthlyRevenue = orders.reduce((acc, order) => {
    const month = new Date(order.date).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + order.total;
    return acc;
  }, {});

  // Recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Top selling products
  const topProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <div className="mt-4 md:mt-0">
            <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={<FiDollarSign className="text-blue-500" size={24} />}
            trend="up"
            change="12% from last month"
          />
          <StatCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            icon={<FiPackage className="text-purple-500" size={24} />}
            trend="up"
            change="8% from last month"
          />
          <StatCard
            title="Customers"
            value={totalCustomers.toLocaleString()}
            icon={<FiUsers className="text-green-500" size={24} />}
            trend="up"
            change="5% from last month"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockItems}
            icon={<FiAlertTriangle className="text-yellow-500" size={24} />}
            trend={lowStockItems > 0 ? "alert" : "neutral"}
            change={lowStockItems > 0 ? "Needs attention" : "All good"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    Recent Orders
                  </h2>
                  <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Chart (Placeholder) */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Revenue Overview
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                    Monthly
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">
                    Weekly
                  </button>
                </div>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Revenue chart visualization</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Inventory Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Inventory Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalProducts}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(products.map((p) => p.category))]
                      .slice(0, 5)
                      .map((category) => (
                        <span
                          key={category}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    {[...new Set(products.map((p) => p.category))].length >
                      5 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                        +
                        {[...new Set(products.map((p) => p.category))].length -
                          5}{" "}
                        more
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Low Stock Items
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      lowStockItems > 0 ? "text-yellow-600" : "text-gray-800"
                    }`}
                  >
                    {lowStockItems}{" "}
                    {lowStockItems > 0 ? "⚠️ Needs attention" : "✅ All good"}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Top Selling Products
              </h2>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center">
                    <span className="text-gray-500 font-medium mr-3">
                      {index + 1}
                    </span>
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.sales} sold
                      </p>
                    </div>
                    <div className="ml-3 flex items-center text-green-600 text-sm">
                      <FiTrendingUp className="mr-1" /> {product.rating}★
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-3 rounded-lg text-sm font-medium transition-colors">
                  Add Product
                </button>
                <button className="bg-purple-50 hover:bg-purple-100 text-purple-800 p-3 rounded-lg text-sm font-medium transition-colors">
                  Create Order
                </button>
                <button className="bg-green-50 hover:bg-green-100 text-green-800 p-3 rounded-lg text-sm font-medium transition-colors">
                  Send Promotion
                </button>
                <button className="bg-orange-50 hover:bg-orange-100 text-orange-800 p-3 rounded-lg text-sm font-medium transition-colors">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Stat Card Component
function StatCard({ title, value, icon, trend, change, chartData }) {
  const trendColors = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    alert: "text-yellow-600 bg-yellow-100",
    neutral: "text-gray-600 bg-gray-100",
  };

  const trendIcons = {
    up: <FiTrendingUp className="inline ml-1" />,
    down: <FiTrendingUp className="inline ml-1 transform rotate-180" />,
    alert: "⚠️",
    neutral: "",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
            {value}
          </p>
        </div>
        <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      </div>
      <div className="mt-4">
        <span
          className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full ${trendColors[trend]}`}
        >
          {change} {trendIcons[trend]}
        </span>
      </div>
      {chartData && (
        <div className="mt-3 h-12 w-full bg-gray-50 rounded-md flex items-end">
          {chartData.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-blue-500 bg-opacity-50 mx-0.5 rounded-t-sm"
              style={{ height: `${(value / Math.max(...chartData)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Enhanced Status Badge Component
function StatusBadge({ status }) {
  const statusColors = {
    Delivered: "bg-green-100 text-green-800",
    Shipped: "bg-blue-100 text-blue-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
    Pending: "bg-purple-100 text-purple-800",
  };

  const statusIcons = {
    Delivered: "✓",
    Shipped: "🚚",
    Processing: "⏳",
    Cancelled: "✕",
    Pending: "⋯",
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[status]}`}
    >
      {statusIcons[status]} <span className="ml-1">{status}</span>
    </span>
  );
}
