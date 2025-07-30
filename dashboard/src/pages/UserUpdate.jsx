import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaSave, FaTimes } from 'react-icons/fa';

function UserUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    location: '',
    orders: 0,
    totalSpent: 0,
    joinDate: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: name === 'orders' || name === 'totalSpent' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, user);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  if (loading) return (
    <div className="p-8 text-center text-gray-600 flex justify-center items-center">
      <FaSpinner className="animate-spin mr-2" /> Loading...
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 md:p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Update User</h1>
            <p className="text-sm text-gray-500">ID: {user._id}</p>
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
            />
            <EditableField
              label="Email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              required
            />
            <EditableField
              label="Location"
              name="location"
              value={user.location}
              onChange={handleChange}
            />
            <EditableField
              label="Orders"
              name="orders"
              type="number"
              value={user.orders}
              onChange={handleChange}
              min="0"
            />
            <EditableField
              label="Total Spent ($)"
              name="totalSpent"
              type="number"
              value={user.totalSpent}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="text-sm text-gray-500">Member Since</label>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
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
              disabled={updating}
            >
              {updating ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Updating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
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

export default UserUpdate;