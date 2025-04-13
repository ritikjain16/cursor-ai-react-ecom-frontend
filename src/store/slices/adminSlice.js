import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/admin/dashboard/stats');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/admin/users');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/admin/products');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/admin/orders');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/admin/products/${productId}`, productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/admin/products', productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const initialState = {
  dashboardStats: null,
  users: [],
  products: [],
  orders: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      })

      // Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer; 