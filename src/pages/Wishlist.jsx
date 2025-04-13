import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';

// Fallback image URL - replace with your actual fallback image
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCartClick = (product) => {
    if (!product.sizes || product.sizes.length === 0) {
      // If no sizes, add to cart directly with default size
      dispatch(addToCart({ productId: product._id, quantity: 1, size: 'ONE SIZE' }));
      return;
    }
    setSelectedProduct(product);
    setSelectedSize('');
    setSizeDialogOpen(true);
  };

  const handleSizeSelect = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleAddToCart = () => {
    if (selectedProduct && selectedSize) {
      dispatch(addToCart({
        productId: selectedProduct._id,
        quantity: 1,
        size: selectedSize
      }));
      setSizeDialogOpen(false);
      setSelectedProduct(null);
      setSelectedSize('');
    }
  };

  const handleCloseDialog = () => {
    setSizeDialogOpen(false);
    setSelectedProduct(null);
    setSelectedSize('');
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return FALLBACK_IMAGE;
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
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add items to your wishlist to save them for later.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
      </Typography>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'background.paper',
                }}
                onClick={() => handleRemoveFromWishlist(item._id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>

              <CardMedia
                component="img"
                height="200"
                image={getProductImage(item)}
                alt={item.name || 'Product Image'}
                sx={{ 
                  objectFit: 'contain',
                  p: 2,
                  bgcolor: 'background.default'
                }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component={RouterLink}
                  to={`/product/${item._id}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {item.name || 'Unnamed Product'}
                </Typography>

                <Typography variant="h6" color="primary" gutterBottom>
                  ₹{(item.price || 0).toLocaleString()}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCartClick(item)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={sizeDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Select Size</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Size</InputLabel>
            <Select
              value={selectedSize}
              onChange={handleSizeSelect}
              label="Size"
            >
              {selectedProduct?.sizes?.map((sizeOption) => (
                <MenuItem key={sizeOption.size} value={sizeOption.size}>
                  {sizeOption.size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddToCart}
            variant="contained"
            disabled={!selectedSize}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Wishlist; 