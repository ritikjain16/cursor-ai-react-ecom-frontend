import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';
import { toast } from 'react-toastify';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, size }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity, size);
      toast.success('Item added to cart');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      toast.success('Cart updated');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await cartAPI.removeFromCart(itemId);
      toast.success('Item removed from cart');
      return itemId;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart();
      toast.success('Cart cleared');
      return null;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItems = state.items.filter(item => item._id !== action.payload);
        state.items = updatedItems;
        state.totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = updatedItems.reduce((total, item) => total + (item.quantity * item.product.price), 0);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;