import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  AccountCircle,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      keepMounted
    >
      {user?.role === 'admin' && (
        <MenuItem component={RouterLink} to="/admin" onClick={handleMenuClose}>
          Admin Dashboard
        </MenuItem>
      )}
      <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
        Profile
      </MenuItem>
      <MenuItem component={RouterLink} to="/orders" onClick={handleMenuClose}>
        Orders
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMenuClose}
      keepMounted
    >
      {isAuthenticated ? (
        [
          <MenuItem key="profile-menu" component={RouterLink} to="/profile" onClick={handleMenuClose}>
            <IconButton size="large" color="inherit">
              <AccountCircle />
            </IconButton>
            Profile
          </MenuItem>,
          <MenuItem key="orders-menu" component={RouterLink} to="/orders" onClick={handleMenuClose}>
            Orders
          </MenuItem>,
          <MenuItem key="logout-menu" onClick={handleLogout}>
            Logout
          </MenuItem>
        ]
      ) : (
        [
          <MenuItem key="login-menu" component={RouterLink} to="/login" onClick={handleMenuClose}>
            Login
          </MenuItem>,
          <MenuItem key="register-menu" component={RouterLink} to="/register" onClick={handleMenuClose}>
            Register
          </MenuItem>
        ]
      )}
    </Menu>
  );

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={handleMobileMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          E-Commerce
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/wishlist"
              >
                <Badge badgeContent={wishlistItems.length} color="error">
                  <Favorite />
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/cart"
              >
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                {user?.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ ml: 1 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{ ml: 1 }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      {renderMenu}
      {renderMobileMenu}
    </AppBar>
  );
};

export default Header; 