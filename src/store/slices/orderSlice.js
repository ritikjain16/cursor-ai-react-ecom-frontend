import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Set initial status based on payment method
      const initialStatus = orderData.paymentMethod === 'razorpay' ? 'pending' : 'processing';
      const response = await orderAPI.createOrder({ ...orderData, status: initialStatus });
      toast.success('Order created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'orders/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.verifyPayment(paymentData);
      toast.success('Payment verified successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment verification failed');
      return rejectWithValue(error.response?.data || 'Payment verification failed');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getAllOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer; 