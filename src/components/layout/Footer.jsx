import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              We are your one-stop shop for all your shopping needs. Quality products,
              great prices, and excellent customer service.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
                Home
              </Link>
              <Link href="/products" color="inherit" display="block" sx={{ mb: 1 }}>
                Products
              </Link>
              <Link href="/cart" color="inherit" display="block" sx={{ mb: 1 }}>
                Cart
              </Link>
              <Link href="/contact" color="inherit" display="block">
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton color="inherit">
                <Facebook />
              </IconButton>
              <IconButton color="inherit">
                <Twitter />
              </IconButton>
              <IconButton color="inherit">
                <Instagram />
              </IconButton>
              <IconButton color="inherit">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Your E-Commerce Store. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 