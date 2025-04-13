import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import Wishlist from '../pages/Wishlist';
import OrderSuccess from '../pages/OrderSuccess';
import OrderFailed from '../pages/OrderFailed';

// Admin Pages
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* Protected Routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-failed"
        element={
          <ProtectedRoute>
            <OrderFailed />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 