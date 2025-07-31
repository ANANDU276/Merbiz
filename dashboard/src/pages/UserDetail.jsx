import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_USER;


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/${id}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!user) return <div className="p-8 text-center text-gray-600">No user data</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 md:p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
            {user.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-sm text-gray-500">ID: {user._id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <DetailCard title="Email" value={user.email} />
          <DetailCard title="Location" value={user.location || 'N/A'} />
          <DetailCard title="Orders" value={user.orders} />
          <DetailCard title="Total Spent" value={`$${user.totalSpent?.toFixed(2)}`} />
          <DetailCard title="Member Since" value={new Date(user.joinDate).toLocaleDateString()} />
        </div>

        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
            Edit
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ title, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

export default UserDetail;
