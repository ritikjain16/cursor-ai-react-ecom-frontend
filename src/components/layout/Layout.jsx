import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Toolbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
          px: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 