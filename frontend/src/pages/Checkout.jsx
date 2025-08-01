import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, MapPin, Edit, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import AuthContext from "../context/AuthContext";
import { useAddress } from "../context/AddressContext";
import Swal from "sweetalert2";

const MAX_ADDRESSES_PER_USER = 2;

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useContext(AuthContext);
  const {
    addresses: savedAddresses,
    loading: loadingAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddress();
  const navigate = useNavigate();

  // Calculate order totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 9.99;
  const taxRate = 0.08;
  const tax = (subtotal * taxRate).toFixed(2);
  const total = (subtotal + shipping + parseFloat(tax)).toFixed(2);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_PAYMENT;

  // Form state
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    paymentMethod: "Cash on Delivery",
  });

  const [saveAddress, setSaveAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Load user email when user changes
  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (address) => {
    setForm({
      ...form,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      apartment: address.apartment || "",
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone || "",
    });
  };

  const handleSaveAddress = async () => {
    if (
      !form.firstName ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.zip
    ) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required address fields to save.",
        confirmButtonColor: "#3399cc",
        scrollbarPadding: false,
      });
      return;
    }

    try {
      const addressData = {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        zip: form.zip,
        phone: form.phone,
        isDefault: savedAddresses.length === 0,
      };

      await addAddress(addressData);
      setSaveAddress(false);

      await Swal.fire({
        icon: "success",
        title: "Address Saved!",
        text: "Your address has been saved successfully.",
        confirmButtonColor: "#3399cc",
      });
    } catch (error) {
      console.error("Error saving address:", error);
      await Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text: error.message || "Failed to save address. Please try again.",
        confirmButtonColor: "#3399cc",
      });
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setForm({
      ...form,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      apartment: address.apartment || "",
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone || "",
    });
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress) return;

    try {
      const updatedData = {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        zip: form.zip,
        phone: form.phone,
      };

      await updateAddress(editingAddress._id, updatedData);

      await Swal.fire({
        icon: "success",
        title: "Address Updated!",
        text: "Your address has been updated successfully.",
        confirmButtonColor: "#3399cc",
      });

      setEditingAddress(null);
    } catch (error) {
      console.error("Error updating address:", error);
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update address. Please try again.",
        confirmButtonColor: "#3399cc",
      });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAddress(addressId);
        await Swal.fire(
          "Deleted!",
          "Your address has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting address:", error);
        await Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete address. Please try again.",
          confirmButtonColor: "#3399cc",
        });
      }
    }
  };

  const showAddressLimitAlert = () => {
    Swal.fire({
      icon: "info",
      title: "Address Limit Reached",
      text: `You can only save up to ${MAX_ADDRESSES_PER_USER} addresses. Please delete an existing one to add a new address.`,
      confirmButtonColor: "#3399cc",
    });
  };

  const handleOrder = async () => {
    // Validate required fields
    if (
      !form.email ||
      !form.firstName ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.zip
    ) {
      await Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#3399cc",
      });
      return;
    }

    // Save address if checkbox is checked and user is authenticated
    if (saveAddress && user) {
      if (savedAddresses.length >= MAX_ADDRESSES_PER_USER) {
        showAddressLimitAlert();
        return;
      }
      await handleSaveAddress();
    }

    // Prepare order data
    const baseOrderData = {
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.image[0],
        price: item.price,
        quantity: item.quantity,
      })),
      email: form.email,
      shippingAddress: {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        zip: form.zip,
        phone: form.phone,
      },
      paymentMethod: form.paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
    };

    // Handle different payment methods
    if (form.paymentMethod === "Cash on Delivery") {
      const orderData = {
        ...baseOrderData,
        paymentStatus: "Cash on Delivery",
      };

      try {
        await createOrder(orderData);
        clearCart();
        localStorage.removeItem("cart");

        await Swal.fire({
          icon: "success",
          title: "Order Placed!",
          text: "Your order has been placed successfully with Cash on Delivery.",
          confirmButtonColor: "#3399cc",
        });

        navigate("/ordersuccess", { state: { order: orderData } });
      } catch (err) {
        console.error("Order error:", err);
        await Swal.fire({
          icon: "error",
          title: "Order Failed",
          text: "Failed to place order. Please try again.",
          confirmButtonColor: "#3399cc",
        });
      }
    } else if (form.paymentMethod === "Online Payment") {
      try {
        const res = await fetch(`${API_BASE_URL}/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ total }),
        });

        const data = await res.json();

        const options = {
          key: "rzp_test_McyqweXXfGvPEA",
          amount: data.amount,
          currency: "INR",
          name: "Your Store Name",
          description: "Order Payment",
          order_id: data.id,
          handler: async function (response) {
            try {
              const verifyRes = await fetch(`${API_BASE_URL}/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                const orderData = {
                  ...baseOrderData,
                  paymentStatus: "Paid",
                  paymentId: response.razorpay_payment_id,
                };

                await createOrder(orderData);
                clearCart();
                localStorage.removeItem("cart");

                await Swal.fire({
                  icon: "success",
                  title: "Payment Verified!",
                  text: "Your payment has been verified and order placed successfully.",
                  confirmButtonColor: "#3399cc",
                });

                navigate("/ordersuccess");
              } else {
                await Swal.fire({
                  icon: "error",
                  title: "Verification Failed",
                  text: "Payment verification failed. Order not placed.",
                  confirmButtonColor: "#3399cc",
                });
              }
            } catch (err) {
              console.error("Verification error:", err);
              await Swal.fire({
                icon: "error",
                title: "Verification Error",
                text: "Could not verify payment. Please contact support.",
                confirmButtonColor: "#3399cc",
              });
            }
          },
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Payment error:", err);
        await Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "Failed to initiate payment. Please try again.",
          confirmButtonColor: "#3399cc",
        });
      }
    }
  };

  return (
    <main className="px-4 py-10 mx-auto max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-blue-600">
          Cart
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Checkout</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Form */}
        <div className="lg:w-2/3 space-y-6">
          {/* Saved Addresses */}
          {user && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin size={18} />
                Saved Addresses {savedAddresses.length}/{MAX_ADDRESSES_PER_USER}
              </h2>
              {loadingAddresses ? (
                <p>Loading addresses...</p>
              ) : savedAddresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      className={`border rounded-md p-3 relative ${
                        form.address === address.address &&
                        form.city === address.city &&
                        form.zip === address.zip
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => handleSelectAddress(address)}
                      >
                        <h3 className="font-medium">
                          {address.firstName} {address.lastName}
                        </h3>
                        <p className="text-sm">
                          {address.address}
                          {address.apartment && `, ${address.apartment}`}
                        </p>
                        <p className="text-sm">
                          {address.city}, {address.state} {address.zip}
                        </p>
                        {address.phone && (
                          <p className="text-sm">Phone: {address.phone}</p>
                        )}
                        {address.isDefault && (
                          <span className="inline-block mt-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit address"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  You don't have any saved addresses yet.
                </p>
              )}
            </div>
          )}

          {/* Edit Address Modal */}
          {editingAddress && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="font-semibold text-lg mb-4">Edit Address</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="w-full p-2 border rounded-md"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="w-full p-2 border rounded-md"
                        value={form.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="w-full p-2 border rounded-md"
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Apartment (optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      className="w-full p-2 border rounded-md"
                      value={form.apartment}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="w-full p-2 border rounded-md"
                        value={form.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        className="w-full p-2 border rounded-md"
                        value={form.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        ZIP *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        className="w-full p-2 border rounded-md"
                        value={form.zip}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full p-2 border rounded-md"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEditingAddress(null)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateAddress}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full p-2 border rounded-md"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Shipping Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name*"
                className="p-2 border rounded-md"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="p-2 border rounded-md"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Address*"
              className="w-full p-2 border rounded-md mt-4"
              value={form.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apartment"
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full p-2 border rounded-md mt-2"
              value={form.apartment}
              onChange={handleChange}
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <input
                type="text"
                name="city"
                placeholder="City*"
                className="p-2 border rounded-md"
                value={form.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State*"
                className="p-2 border rounded-md"
                value={form.state}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code*"
                className="p-2 border rounded-md"
                value={form.zip}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone (optional)"
              className="w-full p-2 border rounded-md mt-4"
              value={form.phone}
              onChange={handleChange}
            />

            {user && (
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={(e) => {
                    if (
                      e.target.checked &&
                      savedAddresses.length >= MAX_ADDRESSES_PER_USER
                    ) {
                      showAddressLimitAlert();
                      setSaveAddress(false);
                    } else {
                      setSaveAddress(e.target.checked);
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor="saveAddress" className="text-sm">
                  Save this address for future use
                </label>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={form.paymentMethod === "Cash on Delivery"}
                  onChange={handleChange}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online Payment"
                  checked={form.paymentMethod === "Online Payment"}
                  onChange={handleChange}
                />
                Online Payment (Razorpay)
              </label>
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-600">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          ₹{item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={cart.length === 0}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium flex items-center justify-center"
                >
                  <Check size={18} className="mr-2" />
                  Complete Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
