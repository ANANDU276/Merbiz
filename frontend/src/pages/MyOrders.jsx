import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import Swal from "sweetalert2";
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
  FiDollarSign,
  FiShoppingBag,
  FiRefreshCw,
  FiEye,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const {
    orders,
    fetchOrders,
    loading,
    requestReturn,
    returnLoading,
    returnError,
    canRequestReturn,
    getOrderById,
  } = useOrders();
  const [activeReturnOrder, setActiveReturnOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");

  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    }
  }, [user?.email]);

  const handleReturnRequest = async (orderId) => {
    const order = getOrderById(orderId);
    if (!order) return;

    const { value: reason } = await Swal.fire({
      title: "Return Request",
      html: `
        <div class="text-left">
          <p class="mb-2">Order #${order._id}</p>
          <p class="mb-4">Please tell us why you're returning this item:</p>
          <textarea 
            id="return-reason" 
            class="swal2-textarea" 
            placeholder="Reason for return..."
            rows="4"
            required
          ></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit Request",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const reason = document.getElementById("return-reason").value;
        if (!reason) {
          Swal.showValidationMessage("Please provide a reason for return");
          return false;
        }
        return reason;
      },
    });

    if (reason) {
      try {
        setActiveReturnOrder(orderId);
        setReturnReason(reason);
        await requestReturn(orderId, reason);

        Swal.fire({
          title: "Return Request Submitted",
          text: "Your return request has been received. We will process it shortly.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          title: "Request Failed",
          text: error.message || "Failed to submit return request",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setActiveReturnOrder(null);
        setReturnReason("");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-gray-50 rounded-xl p-8">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No orders yet
          </h3>
          <p className="mt-2 text-gray-500">
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">View and manage your order history</p>
      </div>
      <div className="space-y-6">
        {[...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order) => {
            const items = order.items || [];
            const itemTotal = items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            const shipping = order.shipping || 0;
            const tax = order.tax || 0;
            const grandTotal = order.total || itemTotal + shipping + tax;

            const isReturnRequested = order.returnRequest?.requested;
            const canReturn = canRequestReturn(order);

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Order #</p>
                    <p className="font-medium text-gray-900">{order._id}</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <p className="text-sm text-gray-500">Placed on</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-1">
                          Order:
                        </span>
                        <StatusBadge status={order.status || "Pending"} />
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-1">
                          Payment:
                        </span>
                        <PaymentStatusBadge
                          status={order.paymentStatus || "Pending"}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qty
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                                  {item.image ? (
                                    <img
                                      className="h-full w-full object-cover"
                                      src={item.image}
                                      alt={item.name}
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                      <FiPackage />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.variant || "Standard"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right text-sm text-gray-500">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-4 text-right text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {isReturnRequested && (
                    <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div className="flex items-center">
                        <FiRefreshCw className="text-blue-500 mr-2" />
                        <h4 className="font-medium text-blue-800">
                          Return Requested
                        </h4>
                      </div>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          <span className="font-medium">Reason:</span>{" "}
                          {order.returnRequest.reason}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          <ReturnStatusBadge
                            status={order.returnRequest.status}
                          />
                        </p>
                        <p>
                          <span className="font-medium">Requested on:</span>{" "}
                          {new Date(
                            order.returnRequest.requestedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiEye className="mr-2" />
                      View Order Details
                    </Link>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() =>
                          Swal.fire({
                            title: "Track Order",
                            text: `Track ID: ${order._id} — Feature coming soon!`,
                            icon: "info",
                            confirmButtonText: "OK",
                            scrollbarPadding: false,
                          })
                        }
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiTruck className="mr-2" />
                        Track Order
                      </button>
                      <button
                        onClick={() => (window.location.href = "/products")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Shop Again
                      </button>

                      {isReturnRequested ? (
                        <button
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 cursor-not-allowed"
                          disabled
                        >
                          Return Requested
                        </button>
                      ) : canReturn ? (
                        <button
                          onClick={() => handleReturnRequest(order._id)}
                          disabled={
                            returnLoading && activeReturnOrder === order._id
                          }
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            returnLoading && activeReturnOrder === order._id
                              ? "bg-green-400"
                              : "bg-green-600 hover:bg-green-700"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                        >
                          {returnLoading && activeReturnOrder === order._id ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            "Request Return"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: "Cancel Order",
                              text: "Are you sure you want to cancel this order?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, cancel it",
                              cancelButtonText: "No, keep it",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                Swal.fire(
                                  "Cancelled",
                                  "Your order has been cancelled.",
                                  "success"
                                );
                              }
                            });
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  let color = "";
  let icon = null;

  switch (status.toLowerCase()) {
    case "shipped":
      color = "bg-blue-100 text-blue-800";
      icon = <FiTruck className="mr-1" />;
      break;
    case "delivered":
      color = "bg-green-100 text-green-800";
      icon = <FiCheckCircle className="mr-1" />;
      break;
    case "returned":
      color = "bg-purple-100 text-purple-800";
      icon = <FiCheckCircle className="mr-1" />;
      break;
    case "cancelled":
      color = "bg-red-100 text-red-800";
      icon = <FiXCircle className="mr-1" />;
      break;
    case "processing":
      color = "bg-purple-100 text-purple-800";
      icon = <FiPackage className="mr-1" />;
      break;
    case "pending":
    default:
      color = "bg-yellow-100 text-yellow-800";
      icon = <FiClock className="mr-1" />;
      break;
  }

  const formattedStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`${base} ${color}`}>
      {icon}
      {formattedStatus}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  let color = "";
  let icon = null;

  switch (status.toLowerCase()) {
    case "paid":
      color = "bg-green-100 text-green-800";
      icon = <FiCheckCircle className="mr-1" />;
      break;
    case "failed":
      color = "bg-red-100 text-red-800";
      icon = <FiXCircle className="mr-1" />;
      break;
    case "refunded":
      color = "bg-purple-100 text-purple-800";
      icon = <FiDollarSign className="mr-1" />;
      break;
    case "pending":
    default:
      color = "bg-yellow-100 text-yellow-800";
      icon = <FiClock className="mr-1" />;
      break;
  }

  const formattedStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`${base} ${color}`}>
      {icon}
      {formattedStatus}
    </span>
  );
};

const ReturnStatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  let color = "";
  let icon = null;

  switch (status.toLowerCase()) {
    case "approved":
      color = "bg-green-100 text-green-800";
      icon = <FiCheckCircle className="mr-1" />;
      break;
    case "rejected":
      color = "bg-red-100 text-red-800";
      icon = <FiXCircle className="mr-1" />;
      break;
    case "processing":
      color = "bg-blue-100 text-blue-800";
      icon = <FiRefreshCw className="mr-1" />;
      break;
    case "pending":
    default:
      color = "bg-yellow-100 text-yellow-800";
      icon = <FiClock className="mr-1" />;
      break;
  }

  const formattedStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`${base} ${color}`}>
      {icon}
      {formattedStatus}
    </span>
  );
};

export default MyOrders;
