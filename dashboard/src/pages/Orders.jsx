import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiDownload,
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEdit,
  FiRefreshCw,
} from "react-icons/fi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ORDER;

  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}`);
        setOrders(res.data);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;
  const avgOrderValue = totalRevenue / (orders.length || 1);
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const returnRequests = orders.filter(
    (order) => order.returnRequest?.requested
  ).length;

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.email &&
        order.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.status &&
        order.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.returnRequest?.status &&
        order.returnRequest.status
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleReturnStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? {
              ...order,
              returnRequest: {
                ...order.returnRequest,
                status: newStatus,
              },
            }
          : order
      )
    );
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading orders...</div>
    );
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-3 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">
              Order Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all customer orders
            </p>
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center text-sm">
              <FiDownload className="mr-2" size={16} />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 flex items-center text-sm">
              <FiPlus className="mr-2" size={16} />
              Create Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon="📦"
            trend="neutral"
            change="All time"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000).toFixed(1)}K`}
            icon="💰"
            trend="up"
            change="This month"
          />
          <StatCard
            title="Delivered"
            value={deliveredOrders}
            icon="✅"
            trend="neutral"
            change={`${Math.round((deliveredOrders / orders.length) * 100)}%`}
          />
          <StatCard
            title="Pending"
            value={pendingOrders}
            icon="⏳"
            trend={pendingOrders > 5 ? "alert" : "neutral"}
            change={`${Math.round((pendingOrders / orders.length) * 100)}%`}
          />
          <StatCard
            title="Return Requests"
            value={returnRequests}
            icon="🔄"
            trend={returnRequests > 0 ? "alert" : "neutral"}
            change={`${returnRequests} pending`}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h2>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Return Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {order.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <StatusSelector
                          currentStatus={order.status || "Pending"}
                          orderId={order._id}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {order.returnRequest?.requested ? (
                          <ReturnStatusSelector
                            currentStatus={
                              order.returnRequest.status || "Pending"
                            }
                            orderId={order._id}
                            onStatusChange={handleReturnStatusChange}
                          />
                        ) : (
                          <span className="text-gray-400 italic">
                            No Request
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right text-sm">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <FiEye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <FiEdit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No orders found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredOrders.length > 0 && (
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstOrder + 1} to{" "}
                {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </p>
              <div className="space-x-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border text-sm rounded disabled:opacity-50"
                >
                  <FiChevronLeft />
                </button>
                <span className="px-2">{currentPage}</span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border text-sm rounded disabled:opacity-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusSelector({ currentStatus, orderId, onStatusChange }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/${orderId}/status`, {
        status: newStatus,
      });
      onStatusChange(orderId, newStatus);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Status update failed.");
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      className={`border rounded px-2 py-1 text-sm ${
        loading ? "opacity-50" : ""
      }`}
      value={status}
      onChange={handleChange}
      disabled={loading}
    >
      <option value="Pending">Pending</option>
      <option value="Shipped">Shipped</option>
      <option value="Reached Nearby">Reached Nearby</option>
      <option value="Delivered">Delivered</option>
    </select>
  );
}

function ReturnStatusSelector({ currentStatus, orderId, onStatusChange }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {

      await axios.put(`${API_BASE_URL}/${orderId}/return/status`, {
        status: newStatus,
      });
      console.log(newStatus);
      
      onStatusChange(orderId, newStatus);
    } catch (err) {
      console.error("Failed to update return status", err);
      alert("Return status update failed.");
      
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        className={`border rounded px-2 py-1 text-sm ${
          loading ? "opacity-50" : ""
        }`}
        value={status}
        onChange={handleChange}
        disabled={loading}
      >
        <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      
      </select>
      {loading && <FiRefreshCw className="animate-spin h-4 w-4" />}
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
    <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase">{title}</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <span className="text-xl">{icon}</span>
      </div>
      <div
        className={`mt-2 text-xs px-2 py-0.5 inline-block rounded-full ${trendColors[trend]}`}
      >
        {change}
      </div>
    </div>
  );
}

export default Orders;
