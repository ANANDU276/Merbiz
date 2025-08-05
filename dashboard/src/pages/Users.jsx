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

function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const usersPerPage = 10;

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setAllUsers(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // Delete user handler
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setAllUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setUsers(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, allUsers]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Customer Management
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              View and manage all registered users
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex space-x-2 md:space-x-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-300 rounded-lg text-sm md:text-base text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
              <FaFileExport className="w-4 h-4 mr-2" />
              Export
            </button>
            <Link to="/users/adduser">
              <button className="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 rounded-lg text-sm md:text-base text-white hover:bg-blue-700 transition-colors flex items-center">
                <FaPlus className="w-4 h-4 mr-2" />
                Add New User
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <StatCard
            title="Total Users"
            value={allUsers.length}
            icon="👥"
            trend="up"
            change="12% from last month"
          />
          <StatCard
            title="Active Customers"
            value={allUsers.filter((u) => u.orders > 0).length}
            icon="✅"
            trend="up"
            change="8% from last month"
          />
          <StatCard
            title="Avg. Orders"
            value={
              allUsers.length > 0
                ? (allUsers.reduce((sum, user) => sum + user.orders, 0) / allUsers.length).toFixed(1)
                : 0
            }
            icon="📦"
            trend="neutral"
            change="Stable"
            isDecimal={true}
          />
          <StatCard
            title="Avg. Spend"
            value={
              allUsers.length > 0
                ? (allUsers.reduce((sum, user) => sum + (user.totalSpent || 0), 0) / allUsers.length).toFixed(2)
                : 0
            }
            icon="💰"
            trend="up"
            change="5% from last month"
            isDecimal={true}
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 md:p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
            <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader className="hidden sm:table-cell">Contact</TableHeader>
                  <TableHeader className="hidden md:table-cell">Location</TableHeader>
                  <TableHeader>Orders</TableHeader>
                  <TableHeader className="hidden lg:table-cell">Total Spent</TableHeader>
                  <TableHeader className="hidden xl:table-cell">Member Since</TableHeader>
                  <TableHeader align="right">Actions</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div className="ml-2 md:ml-3">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[100px] md:max-w-[150px]">
                              {user.name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {user._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        <div className="truncate max-w-[120px] md:max-w-[180px]">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        <div className="truncate max-w-[100px] md:max-w-[150px]">
                          {user.location || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.orders > 10
                              ? "bg-green-100 text-green-800"
                              : user.orders > 5
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.orders || 0} {isMobile ? '' : 'orders'}
                        </span>
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden lg:table-cell">
                        ${(user.totalSpent || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ActionButtons userId={user._id} onDelete={handleDelete} isMobile={isMobile} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.length > usersPerPage && (
            <div className="bg-white px-3 md:px-4 py-3 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
                totalItems={users.length}
                itemsPerPage={usersPerPage}
                indexOfFirstItem={indexOfFirstUser + 1}
                indexOfLastItem={Math.min(indexOfLastUser, users.length)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable components (similar to your Products page)

function TableHeader({ children, align = "left", className = "" }) {
  return (
    <th
      className={`px-3 py-2 md:px-4 md:py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

function ActionButtons({ userId, onDelete, isMobile }) {
  return (
    <div className="flex justify-end space-x-2">
      <Link to={`/users/userdetail/${userId}`}>
        <button
          className="text-blue-600 hover:text-blue-900 p-1 md:p-2 rounded-full hover:bg-blue-50"
          title="View"
        >
          <FaEye className="w-4 h-4" />
        </button>
      </Link>
      <Link to={`/users/userupdate/${userId}`}>
        <button
          className="text-gray-600 hover:text-gray-900 p-1 md:p-2 rounded-full hover:bg-gray-50"
          title="Edit"
        >
          <FaEdit className="w-4 h-4" />
        </button>
      </Link>
      <button
        onClick={() => onDelete(userId)}
        className="text-red-600 hover:text-red-900 p-1 md:p-2 rounded-full hover:bg-red-50"
        title="Delete"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
}

function StatCard({ title, value, icon, trend, change, isDecimal = false }) {
  const trendColors = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    alert: "text-yellow-600 bg-yellow-100",
    neutral: "text-gray-600 bg-gray-100",
  };

  const formatValue = (val) => {
    if (typeof val === "number") {
      return isDecimal ? val.toFixed(2) : val.toString();
    }
    return val;
  };

  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-3 md:p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500">{title}</p>
          <p className="text-lg md:text-xl font-bold text-gray-800 mt-1">
            {formatValue(value)}
          </p>
        </div>
        <span className="text-xl">{icon}</span>
      </div>
      <div
        className={`mt-2 md:mt-3 inline-flex items-center text-xs md:text-sm px-2 py-1 rounded-full ${trendColors[trend]}`}
      >
        {change}
      </div>
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
      <p className="text-xs md:text-sm text-gray-700 mb-2 sm:mb-0">
        Showing <span className="font-medium">{indexOfFirstItem}</span> to{" "}
        <span className="font-medium">{indexOfLastItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </p>
      <div className="inline-flex rounded-md shadow-sm -space-x-px">
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-1.5 py-1.5 md:px-2 md:py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
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
            className={`relative inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border text-sm font-medium ${
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
          className={`relative inline-flex items-center px-1.5 py-1.5 md:px-2 md:py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
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

export default Users;