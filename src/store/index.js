import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import wishlistReducer from './slices/wishlistSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    admin: adminReducer,
  },
});

export default store; 