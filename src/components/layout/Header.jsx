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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  AccountCircle,
  Menu as MenuIcon,
  LocalShipping,
  Dashboard,
  Logout,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
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
        <>
          <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
            <IconButton size="large" color="inherit">
              <AccountCircle />
            </IconButton>
            Profile
          </MenuItem>
          <MenuItem component={RouterLink} to="/orders" onClick={handleMenuClose}>
            <IconButton size="large" color="inherit">
              <LocalShipping />
            </IconButton>
            Orders
          </MenuItem>
          {user?.role === 'admin' && (
            <MenuItem component={RouterLink} to="/admin" onClick={handleMenuClose}>
              <IconButton size="large" color="inherit">
                <Dashboard />
              </IconButton>
              Admin Dashboard
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>
            <IconButton size="large" color="inherit">
              <Logout />
            </IconButton>
            Logout
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem component={RouterLink} to="/login" onClick={handleMenuClose}>
            Login
          </MenuItem>
          <MenuItem component={RouterLink} to="/register" onClick={handleMenuClose}>
            Register
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="fixed">
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          E-Commerce
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/wishlist"
                size={isMobile ? "small" : "medium"}
              >
                <Badge badgeContent={wishlistItems.length} color="error">
                  <Favorite />
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/cart"
                size={isMobile ? "small" : "medium"}
              >
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
                size={isMobile ? "small" : "medium"}
              >
                {user?.avatar ? (
                  <Avatar 
                    src={user.avatar} 
                    sx={{ 
                      width: isMobile ? 24 : 32, 
                      height: isMobile ? 24 : 32 
                    }} 
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </>
          ) : (
            <>
              {!isMobile && (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
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