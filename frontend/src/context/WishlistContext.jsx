import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const WishlistContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_WISHLIST;

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  const userId = user?.id;

  useEffect(() => {
  if (!userId) {
    setWishlist([]);
    localStorage.removeItem("wishlist");
  }
}, [userId]);

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (userId) {
      fetchWishlist(userId);
    }
  }, [userId]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const addToWishlist = async (product) => {
    if (!product || !product._id || isInWishlist(product._id)) return;

    setWishlist((prev) => [...prev, product]);

    if (userId) {
      try {
        await axios.post(`${API_BASE_URL}`, {
          userId,
          productId: product._id,
        });
      } catch (err) {
        console.error("Failed to sync addToWishlist:", err.response?.data || err.message);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));

    if (userId) {
      try {
        await axios.delete(`${API_BASE_URL}/${userId}/${productId}`);
      } catch (err) {
        console.error("Failed to sync removeFromWishlist:", err.response?.data || err.message);
      }
    }
  };

  const fetchWishlist = async (uid = userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${uid}`);
      const items = res.data?.items?.map((entry) => entry.productId) || [];
      setWishlist(items);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err.response?.data || err.message);
    }
  };

  const clearWishlist = async () => {
    setWishlist([]);
    localStorage.removeItem("wishlist");

    if (userId) {
      try {
        await axios.delete(`${API_BASE_URL}/${userId}/all`);
      } catch (err) {
        console.error("Failed to clear wishlist:", err.response?.data || err.message);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
