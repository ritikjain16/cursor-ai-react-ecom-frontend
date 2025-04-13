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
import { Error } from '@mui/icons-material';
import { red } from '@mui/material/colors';

const OrderFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, error } = location.state || {};

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
          <Error sx={{ fontSize: 64, color: red[500] }} />
          <Typography variant="h4" gutterBottom>
            Payment Failed
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We're sorry, but there was an issue processing your payment.
            Please try again or choose a different payment method.
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
            {error && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography color="error.dark">
                  Error: {error}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ width: '100%', my: 2 }}>
            <Divider />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/checkout`)}
              fullWidth
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/cart')}
              fullWidth
            >
              Return to Cart
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/')}
              fullWidth
            >
              Continue Shopping
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            If you continue to experience issues, please contact our support team.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderFailed; 