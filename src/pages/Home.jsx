import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
  Rating,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  FilterList,
  Sort,
} from '@mui/icons-material';
import { fetchProducts } from '../store/slices/productSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import LazyImage from '../components/common/LazyImage';

const Home = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');

  const { products, loading, error } = useSelector((state) => state.product);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleWishlist = (productId) => {
    if (wishlistItems.includes(productId)) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(productId));
    }
  };

  const filterDrawer = (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Price Range
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>₹{priceRange[0]}</Typography>
            <Typography>₹{priceRange[1]}</Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>
          Categories
        </Typography>
        <FormGroup>
          {['Electronics', 'Fashion', 'Home', 'Books'].map((category) => (
            <FormControlLabel
              key={`category-${category}`}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
              }
              label={category}
            />
          ))}
        </FormGroup>

        <Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>
          Sort By
        </Typography>
        <List>
          {[
            'Price: Low to High',
            'Price: High to Low',
            'Popularity',
            'Newest First',
          ].map((item) => (
            <ListItem
              button
              key={`sort-${item}`}
              selected={sortBy === item}
              onClick={() => setSortBy(item)}
            >
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

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

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          startIcon={<FilterList />}
          onClick={() => setDrawerOpen(true)}
          sx={{ mr: 2 }}
        >
          Filters
        </Button>
        <Button startIcon={<Sort />}>Sort</Button>
      </Box>

      <Grid container spacing={3}>
        {(Array.isArray(products) ? products : [])?.map((product) => (
          <Grid item key={`product-${product._id}`} xs={12} sm={6} md={4} lg={3}>
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
                  zIndex:1
                }}
                onClick={() => toggleWishlist(product._id)}
              >
                {wishlistItems.includes(product._id) ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>

              <Box sx={{ height: 200, p: 2 }}>
                <LazyImage
                  src={product.images[0]}
                  alt={product.name}
                  width="100%"
                  height="100%"
                  objectFit="contain"
                />
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component={Link}
                  to={`/product/${product._id}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating
                    value={product.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({product.numReviews})
                  </Typography>
                </Box>

                <Typography variant="h6" color="primary" gutterBottom>
                  ₹{product.price.toLocaleString()}
                </Typography>

                {product.originalPrice > product.price && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      ₹{product.originalPrice.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % off
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filterDrawer}
    </Container>
  );
};

export default Home; 