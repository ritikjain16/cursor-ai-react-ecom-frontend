import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { green } from '@mui/material/colors';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderAmount } = location.state || {};

  if (!orderId) {
    navigate('/');
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CheckCircle sx={{ fontSize: 64, color: green[500] }} />
          <Typography variant="h4" gutterBottom>
            Order Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for your purchase. Your order has been successfully placed.
          </Typography>
          
          <Box sx={{ width: '100%', my: 2 }}>
            <Divider />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Order Details:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Order ID:</Typography>
              <Typography>{orderId}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Amount Paid:</Typography>
              <Typography>₹{orderAmount?.toLocaleString() || '0'}</Typography>
            </Box>
          </Box>

          <Box sx={{ width: '100%', my: 2 }}>
            <Divider />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/orders')}
              fullWidth
            >
              View Orders
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              fullWidth
            >
              Continue Shopping
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess; 