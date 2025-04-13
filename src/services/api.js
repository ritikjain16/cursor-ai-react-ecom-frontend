import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/users/signup', userData),
  login: (credentials) => api.post('/users/login', credentials),
  logout: () => api.post('/users/logout'),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/users/reset-password', { token, password }),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwords) => api.put('/users/change-password', passwords),
};

// Product APIs
export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  searchProducts: (query) => api.get('/products/search', { params: { query } }),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity, size) => api.post('/cart', { productId, quantity, size }),
  updateCartItem: (itemId, quantity, size) => api.put(`/cart/${itemId}`, { quantity, size }),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// Order APIs
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getAllOrders: () => api.get('/orders/myorders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  verifyPayment: ({ orderId, paymentId, razorpayOrderId, signature }) => 
    api.post(`/orders/${orderId}/verify-payment`, {
      razorpay_payment_id: paymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: signature
    }),
};

// Payment APIs
export const paymentAPI = {
  createPaymentIntent: (amount) => api.post('/payments/create-intent', { amount }),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
};

// Wishlist APIs
export const wishlistAPI = {
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (productId) => api.post('/users/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`),
};

// Category APIs
export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
};

export default api; 