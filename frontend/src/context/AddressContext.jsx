import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import Swal from 'sweetalert2';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ADDRESSES;


  const resetError = useCallback(() => setError(null), []);

  const showSuccessAlert = useCallback((title, text) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#3399cc',
      timer: 2000
    });
  }, []);

  const showErrorAlert = useCallback((errorMessage) => {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#3399cc'
    });
  }, []);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    resetError();
    try {
      const { data } = await axios.get(`${API_BASE_URL}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Ensure default address exists
      const fetchedAddresses = Array.isArray(data) ? data : [];
      if (fetchedAddresses.length > 0 && !fetchedAddresses.some(a => a.isDefault)) {
        await setDefaultAddress(fetchedAddresses[0]._id);
      }

      setAddresses(fetchedAddresses);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch addresses';
      setError(errorMessage);
      await showErrorAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, API_BASE_URL, resetError, showErrorAlert]);

  const addAddress = useCallback(async (addressData) => {
    if (!user) throw new Error('Authentication required');

    setLoading(true);
    resetError();
    try {
      if (addresses.length >= 2) {
        throw new Error('Address limit reached (max 2)');
      }

      const { data } = await axios.post(`${API_BASE_URL}`, addressData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setAddresses(prev => [...prev, data]);
      await showSuccessAlert('Address Saved!', 'Your address has been saved successfully');
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add address';
      setError(errorMessage);
      await showErrorAlert(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, API_BASE_URL, addresses.length, resetError, showSuccessAlert, showErrorAlert]);

  const updateAddress = useCallback(async (id, addressData) => {
    setLoading(true);
    resetError();
    try {
      const { data } = await axios.put(`${API_BASE_URL}/${id}`, addressData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setAddresses(prev => prev.map(addr => addr._id === id ? data : addr));
      await showSuccessAlert('Address Updated!', 'Your address has been updated successfully');
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update address';
      setError(errorMessage);
      await showErrorAlert(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, resetError, showSuccessAlert, showErrorAlert]);

  const deleteAddress = useCallback(async (id) => {
    setLoading(true);
    resetError();
    try {
      const result = await Swal.fire({
        title: 'Confirm Deletion',
        text: "This address will be permanently removed",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) {
        setLoading(false);
        return false;
      }

      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setAddresses(prev => prev.filter(addr => addr._id !== id));
      await showSuccessAlert('Deleted!', 'Address removed successfully');
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete address';
      setError(errorMessage);
      await showErrorAlert(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, resetError, showSuccessAlert, showErrorAlert]);

  const setDefaultAddress = useCallback(async (id) => {
    setLoading(true);
    resetError();
    try {
      const { data } = await axios.patch(`${API_BASE_URL}/${id}/default`, {}, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr._id === id
      })));

      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to set default address';
      setError(errorMessage);
      await showErrorAlert(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, resetError, showErrorAlert]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [user, fetchAddresses]);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        loading,
        error,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        fetchAddresses,
        resetError,
        canAddMore: addresses.length < 2,
        defaultAddress: addresses.find(addr => addr.isDefault) || addresses[0] || null
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};