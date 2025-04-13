import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
} from '@mui/icons-material';
import { fetchOrders } from '../store/slices/orderSlice';
import LazyImage from '../components/common/LazyImage';

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return <CheckCircle color="success" />;
    case 'shipped':
      return <LocalShipping color="primary" />;
    case 'processing':
      return <LocalShipping color="info" />;
    case 'pending':
      return <Pending color="warning" />;
    case 'cancelled':
      return <Cancel color="error" />;
    default:
      return <Pending color="warning" />;
  }
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'success';
    case 'shipped':
      return 'primary';
    case 'processing':
      return 'info';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'warning';
  }
};

const getStatusLabel = (status, isPaid, paymentMethod) => {
  if (status === 'pending' && paymentMethod === 'razorpay' && !isPaid) {
    return 'Payment Pending';
  }

  switch (status.toLowerCase()) {
    case 'delivered':
      return 'Delivered';
    case 'shipped':
      return 'Shipped';
    case 'processing':
      return 'Processing';
    case 'pending':
      return 'Pending';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, isAuthenticated, navigate]);

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

  if (!orders.length) {
    return (
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 8,
          }}
        >
          <LocalShipping sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography variant="h5" color="text.secondary">
            No orders found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">
                        Order #{order._id.slice(-8)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={getStatusLabel(order.status, order.isPaid, order.paymentMethod)}
                          color={getStatusColor(order.status)}
                          variant="outlined"
                        />
                        {order.isPaid ? (
                          <Chip
                            icon={<CheckCircle />}
                            label="Paid"
                            color="success"
                            size="small"
                          />
                        ) : order.paymentMethod === 'razorpay' ? (
                          <Chip
                            icon={<Pending />}
                            label="Payment Pending"
                            color="warning"
                            size="small"
                          />
                        ) : null}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Ordered on:{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount: ₹{order.totalAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {order.items.map((item, index) => (
                        <Box
                          key={`${item.productId || item._id}-${index}`}
                          sx={{
                            display: 'flex',
                            gap: 2,
                            p: 2,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                          }}
                        >
                          <Box sx={{ width: 80, height: 80 }}>
                            <LazyImage
                              src={item.image}
                              alt={item.name}
                              width="100%"
                              height="100%"
                              objectFit="contain"
                            />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate(`/review/${order._id}`)
                          }
                        >
                          Write Review
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders; 