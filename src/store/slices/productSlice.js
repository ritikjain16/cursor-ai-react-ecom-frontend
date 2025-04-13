import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, subCategory, search, sort, page, limit } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/products', {
        params: {
          category,
          subCategory,
          search,
          sort,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

export const filterProducts = createAsyncThunk(
  'products/filterProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/filter', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to filter products');
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: [],
    priceRange: [0, 100000],
    sortBy: '',
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload.products) ? action.payload.products : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Filter Products
      .addCase(filterProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(filterProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer; 