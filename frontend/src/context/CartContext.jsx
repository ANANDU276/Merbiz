import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const CartContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_CART;

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const userId = user?.id;

  const [cart, setCart] = useState([]);

  // Load cart from localStorage on init (before user is known)
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
      console.log("🗃️ Loaded cart from localStorage");
    }
  }, []);

  // Sync local cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("💾 Cart updated in localStorage:", cart);
  }, [cart]);

  // Fetch cart from server once user is available and AuthContext is ready
  useEffect(() => {
    if (!authLoading && userId) {
      console.log("🔑 User logged in, fetching server cart:", userId);
      fetchCartFromServer(userId);
    }
  }, [authLoading, userId]);

  // Clear cart on logout
  useEffect(() => {
    if (!userId && !authLoading) {
      console.log("🚪 User logged out, clearing cart");
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [userId, authLoading]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      return existing
        ? prevCart.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
    });

    if (userId) {
      axios
        .post(`${API_BASE_URL}`, {
          userId,
          product: {
            productId: product._id,
            quantity: 1,
          },
        })
        .then(() => console.log("🛒 addToCart synced to server"))
        .catch((err) =>
          console.error("❌ addToCart sync failed:", err.response?.data || err.message)
        );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));

    if (userId) {
      axios
        .delete(`${API_BASE_URL}/${userId}/${id}`)
        .then(() => console.log("🗑️ removeFromCart synced to server"))
        .catch((err) =>
          console.error("❌ removeFromCart sync failed:", err.response?.data || err.message)
        );
    }
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    if (userId) {
      axios
        .post(`${API_BASE_URL}`, {
          userId,
          product: {
            productId: id,
            quantity: 1,
          },
        })
        .then(() => console.log("➕ increaseQuantity synced to server"))
        .catch((err) =>
          console.error("❌ increaseQuantity sync failed:", err.response?.data || err.message)
        );
    }
  };

  const decreaseQuantity = (id) => {
    const targetItem = cart.find((item) => item._id === id);
    if (!targetItem) return;

    if (targetItem.quantity === 1) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );

      if (userId) {
        axios
          .post(`${API_BASE_URL}`, {
            userId,
            product: {
              productId: id,
              quantity: -1,
            },
          })
          .then(() => console.log("➖ decreaseQuantity synced to server"))
          .catch((err) =>
            console.error("❌ decreaseQuantity sync failed:", err.response?.data || err.message)
          );
      }
    }
  };

  const fetchCartFromServer = async (uid) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${uid}`);
      const serverCart = res.data?.items || [];

      const formatted = serverCart.map((item) => ({
        ...item.productId,
        quantity: item.quantity,
      }));

      setCart(formatted);
      localStorage.setItem("cart", JSON.stringify(formatted));
      console.log("📥 Cart fetched from server:", formatted);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err.response?.data || err.message);
    }
  };

  const syncWithServer = async (uid = userId) => {
    try {
      const syncRequests = cart.map((item) =>
        axios.post(`${API_BASE_URL}`, {
          userId: uid,
          product: {
            productId: item._id,
            quantity: item.quantity,
          },
        })
      );
      await Promise.all(syncRequests);
      console.log("🔁 Cart synced to server");
    } catch (err) {
      console.error("❌ Cart sync failed:", err.response?.data || err.message);
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
      localStorage.removeItem("cart");
      console.log("🧹 Cart cleared locally");

      if (userId) {
        const res = await axios.delete(`${API_BASE_URL}/${userId}`);
        console.log("🧼 Cart cleared from server" , res.data);
      }
    } catch (error) {
      console.error("❌ Failed to clear cart from server:", error.response?.data || error.message);
    }
  };
  

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        fetchCartFromServer,
        syncWithServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
