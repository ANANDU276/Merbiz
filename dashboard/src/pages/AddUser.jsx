import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaSave, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

function AddUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    orders: 0,
    totalSpent: 0
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_USER;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: name === 'orders' || name === 'totalSpent' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Basic client-side validation
    if (!user.password || user.password.length < 6) {
      setError('Password must be at least 6 characters');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}`, user);
      navigate(`/users/userdetail/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 md:p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
            <span>{user.name?.charAt(0) || '+'}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Add New User</h1>
            <p className="text-sm text-gray-500">Create a new customer profile</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <EditableField
              label="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              autoFocus
            />
            <EditableField
              label="Email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              required
            />
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
              <label htmlFor="password" className="text-sm text-gray-500">
                Password*
                <span className="text-xs text-gray-400 ml-1">(min 6 characters)</span>
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <EditableField
              label="Location"
              name="location"
              value={user.location}
              onChange={handleChange}
            />
            <EditableField
              label="Initial Orders"
              name="orders"
              type="number"
              value={user.orders}
              onChange={handleChange}
              min="0"
            />
            <EditableField
              label="Initial Total Spent ($)"
              name="totalSpent"
              type="number"
              value={user.totalSpent}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Creating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Create User
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to Users
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditableField({ label, name, type = 'text', value, onChange, required = false, ...props }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <label htmlFor={name} className="text-sm text-gray-500">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        required={required}
        {...props}
      />
    </div>
  );
}

export default AddUser;