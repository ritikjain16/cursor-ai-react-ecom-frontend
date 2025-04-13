import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import LazyImage from '../components/common/LazyImage';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalItems, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(itemId));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!items.length) {
    return (
      <Container sx={{ mt: 10, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h5">Your cart is empty</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart ({totalItems} items)
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Grid item xs={12} key={`${item.product._id}-${item.size}`}>
              <Card>
                <Box sx={{ display: 'flex', p: 2 }}>
                  <Box sx={{ width: 120, height: 120 }}>
                    <LazyImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width="120px"
                      height="120px"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, ml: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Size: {item.size}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveItem(item._id)}
                        sx={{ ml: 'auto' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal ({totalItems} items)</Typography>
                <Typography>₹{totalAmount.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>{totalAmount > 100 ? 'Free' : '₹10'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax (15%)</Typography>
                <Typography>₹{(totalAmount * 0.15).toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ₹{(totalAmount + (totalAmount > 100 ? 0 : 10) + (totalAmount * 0.15)).toLocaleString()}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 