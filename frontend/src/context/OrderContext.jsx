import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";

const OrderContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ORDER;


export const OrderProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const userEmail = user?.email;

  useEffect(() => {
    if (!authLoading && userEmail) {
      fetchOrders(userEmail);
    } else if (!authLoading) {
      setOrders([]);
      setLoading(false);
    }
  }, [authLoading, userEmail]);

  const fetchOrders = async (email) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/user?email=${email}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error(
        "Failed to fetch orders:",
        err.response?.data?.error || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}`, orderData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setOrders((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      const error = err.response?.data?.error || err.message;
      setCreateError(error);
      console.error("Failed to create order:", error);
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  const requestReturn = async (orderId, reason) => {
    setReturnLoading(true);
    setReturnError(null);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/${orderId}/return`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const updatedOrder = res.data.order;
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (err) {
      const error = err.response?.data?.error || err.message;
      setReturnError(error);
      console.error("Return request failed:", error);
      throw error;
    } finally {
      setReturnLoading(false);
    }
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order._id === orderId);
  };

  const canRequestReturn = (order) => {
    if (!order) return false;
    
    // Check if return already requested
    if (order.returnRequest?.requested) return false;
    
    // Check if order is within return window (e.g., 30 days)
    const returnWindowDays = 30;
    const orderDate = new Date(order.createdAt);
    const returnDeadline = new Date(
      orderDate.setDate(orderDate.getDate() + returnWindowDays)
    );
    
    return new Date() <= returnDeadline;
  };

  const clearOrders = () => {
    setOrders([]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        returnLoading,
        returnError,
        createLoading,
        createError,
        fetchOrders,
        createOrder,
        requestReturn,
        getOrderById,
        canRequestReturn,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};