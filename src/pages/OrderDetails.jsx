import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  LocationOn,
  Payment,
} from '@mui/icons-material';
import { fetchOrderById } from '../store/slices/orderSlice';
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
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'Delivered';
    case 'shipped':
      return 'Shipped';
    case 'processing':
      return 'Processing';
    case 'pending':
      return paymentMethod === 'razorpay' && !isPaid ? 'Payment Pending' : 'Processing';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedOrder: order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography>Order not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Order Details</Typography>
        <Button variant="outlined" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Order Status and Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Order #{order._id.slice(-8)}</Typography>
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
            <Typography variant="body2" color="text.secondary">
              Ordered on: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Paper>
        </Grid>

        {/* Shipping Address */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOn color="primary" />
              <Typography variant="h6">Shipping Address</Typography>
            </Box>
            <Typography>{order.shippingAddress.street}</Typography>
            <Typography>{order.shippingAddress.city}</Typography>
            <Typography>{order.shippingAddress.state}, {order.shippingAddress.zipCode}</Typography>
            <Typography>{order.shippingAddress.country}</Typography>
            <Typography sx={{ mt: 1 }}>Phone: {order.shippingAddress.phone}</Typography>
          </Paper>
        </Grid>

        {/* Payment Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Payment color="primary" />
              <Typography variant="h6">Payment Information</Typography>
            </Box>
            <Typography>Method: {order.paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</Typography>
            {order.isPaid && (
              <>
                <Typography>Paid on: {new Date(order.paidAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</Typography>
                {order.paymentResult?.razorpay?.paymentId && (
                  <Typography>Payment ID: {order.paymentResult.razorpay.paymentId}</Typography>
                )}
              </>
            )}
          </Paper>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Items</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {order.items.map((item, index) => (
                <React.Fragment key={item._id || index}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ width: 80, height: 80 }}>
                      <LazyImage
                        src={item.image}
                        alt={item.name}
                        width="80px"
                        height="80px"
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {item.size}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  {index < order.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Items Price:</Typography>
                <Typography>₹{order.totalPrice.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Shipping:</Typography>
                <Typography>₹{order.shippingPrice.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Tax:</Typography>
                <Typography>₹{order.taxPrice.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ₹{order.totalAmount.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetails; 