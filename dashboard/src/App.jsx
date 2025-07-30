import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import Addproduct from "./pages/crud/Addproduct";
import Updateproduct from "./pages/crud/Updateproduct.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import UserDetail from "./pages/UserDetail.jsx";
import UserUpdate from "./pages/UserUpdate.jsx";
import AddUser from "./pages/AddUser.jsx";

function Layout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="/products/addproduct" element={<Addproduct />} />
          <Route path="/products/updateproduct/:id" element={<Updateproduct />} />
          <Route path="/products/productdetail/:id" element={<ProductDetail />} />
          <Route path="/users/userdetail/:id" element={<UserDetail />} />
          <Route path="/users/userupdate/:id" element={<UserUpdate />} />
          <Route path="/users/adduser" element={<AddUser />} />


          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
