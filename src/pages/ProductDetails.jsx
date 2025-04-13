import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  IconButton,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  TextField,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Security,
  AssignmentReturn,
} from '@mui/icons-material';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import LazyImage from '../components/common/LazyImage';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const { selectedProduct: product, loading, error } = useSelector(
    (state) => state.product
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Reset quantity when size changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  const getAvailableQuantity = () => {
    if (!selectedSize) return 0;
    const sizeOption = product.sizes.find(s => s.size === selectedSize);
    return sizeOption ? sizeOption.quantity : 0;
  };

  const handleQuantityChange = (value) => {
    const availableQuantity = getAvailableQuantity();
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= availableQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    dispatch(addToCart({ productId: id, quantity, size: selectedSize }));
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (wishlistItems.includes(id)) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    dispatch(addToCart({ productId: id, quantity, size: selectedSize }))
      .unwrap()
      .then(() => {
        navigate('/checkout');
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography color="error">
          {error || 'Product not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ width: '100%', mb: 2 }}>
            <LazyImage
              src={product.images[selectedImage]}
              alt={product.name}
              width="100%"
              height="400px"
              style={{ borderRadius: '8px' }}
            />
          </Box>
          <Grid container spacing={2}>
            {product.images.map((image, index) => (
              <Grid item xs={3} key={index}>
                <Box
                  sx={{
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid' : '2px solid transparent',
                    borderColor: selectedImage === index ? 'primary.main' : 'transparent',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    height: '80px',
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <LazyImage
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    width="100%"
                    height="100%"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={product.ratings?.average || 0}
                precision={0.5}
                readOnly
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                ({product.ratings?.count || 0} reviews)
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                ₹{product.price.toLocaleString()}
              </Typography>
              {product.isOnSale && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ₹{product.originalPrice.toLocaleString()}
                  </Typography>
                  <Chip
                    label={`${Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}% OFF`}
                    color="error"
                    size="small"
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Size
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.sizes.map((sizeOption) => (
                  <Button
                    key={sizeOption.size}
                    variant={selectedSize === sizeOption.size ? "contained" : "outlined"}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    disabled={sizeOption.quantity === 0}
                    sx={{ minWidth: 48, height: 48 }}
                  >
                    {sizeOption.size}
                  </Button>
                ))}
              </Box>
              {selectedSize && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {product.sizes.find(s => s.size === selectedSize)?.quantity || 0} pieces available
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || !selectedSize}
                >
                  -
                </Button>
                <Typography>{quantity}</Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleQuantityChange(1)}
                  disabled={!selectedSize || quantity >= getAvailableQuantity()}
                >
                  +
                </Button>
              </Box>
              {!selectedSize && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Please select a size first
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!selectedSize || getAvailableQuantity() === 0}
                sx={{ flex: 1 }}
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={handleBuyNow}
                disabled={!selectedSize || getAvailableQuantity() === 0}
                sx={{ flex: 1 }}
              >
                Buy Now
              </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Product Features
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocalShipping color="primary" />
                    <Typography variant="body2">Free Delivery</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Security color="primary" />
                    <Typography variant="body2">1 Year Warranty</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <AssignmentReturn color="primary" />
                    <Typography variant="body2">10 Days Return</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Description" />
              <Tab label="Specifications" />
              <Tab label="Reviews" />
            </Tabs>
            <Box sx={{ mt: 3 }}>
              {activeTab === 0 && (
                <Typography variant="body1">
                  {product.description}
                </Typography>
              )}
              {activeTab === 1 && (
                <Grid container spacing={2}>
                  {product.specifications?.map((spec, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 1,
                          bgcolor:
                            index % 2 === 0
                              ? 'background.default'
                              : 'transparent',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {spec.name}:
                        </Typography>
                        <Typography variant="body2">
                          {spec.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
              {activeTab === 2 && (
                <Box>
                  {product.reviews?.map((review) => (
                    <Paper
                      key={review._id}
                      sx={{ p: 2, mb: 2 }}
                      elevation={1}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle1">
                          {review.user.name}
                        </Typography>
                        <Rating
                          value={review.rating}
                          size="small"
                          readOnly
                        />
                      </Box>
                      <Typography variant="body2" gutterBottom>
                        {review.comment}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(review.createdAt).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails; 