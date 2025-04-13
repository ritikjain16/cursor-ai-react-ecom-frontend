import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Radio,
} from '@mui/material';
import { createOrder, verifyPayment } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import LazyImage from '../components/common/LazyImage';

const steps = ['Shipping Address', 'Review Order', 'Payment'];

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  street: Yup.string().required('Street address is required'),
  addressLine2: Yup.string(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Invalid pincode')
    .required('Pincode is required'),
  country: Yup.string().required('Country is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid phone number')
    .required('Phone number is required'),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const { items = [], totalAmount = 0 } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);

  // Calculate prices
  const shippingPrice = totalAmount > 100 ? 0 : 10;
  const taxPrice = totalAmount * 0.15;
  const finalAmount = totalAmount + shippingPrice + taxPrice;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      toast.error('Your cart is empty');
    }
  }, [items, navigate]);

  const handleNext = () => {
    if (activeStep === 0 && !shippingAddress && !isNewAddress) {
      toast.error('Please select or add a shipping address');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSelectAddress = (address) => {
    setIsNewAddress(false);
    setShippingAddress({
      ...address,
      fullName: user?.firstName + ' ' + user?.lastName,
      _id: address._id
    });
  };

  const handleAddNewAddressClick = () => {
    setIsNewAddress(true);
    setShippingAddress(null);
  };

  const handleShippingSubmit = (values) => {
    setShippingAddress({
      ...values,
      _id: 'new_address_' + Date.now()
    });
    handleNext();
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (paymentMethod) => {
    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          price: item.product.price,
          name: item.product.name,
          image: item.product.images[0]
        })),
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: shippingAddress.country || 'India',
          zipCode: shippingAddress.zipCode,
          phone: shippingAddress.phone
        },
        paymentMethod,
        totalPrice: totalAmount,
        shippingPrice,
        taxPrice,
        totalAmount: finalAmount
      };

      if (paymentMethod === 'cash_on_delivery') {
        // Create order directly for COD
        const response = await dispatch(createOrder(orderData)).unwrap();
        dispatch(clearCart());
        navigate('/order-success', { 
          state: { 
            orderId: response._id,
            orderAmount: response.totalAmount
          } 
        });
        return;
      }

      // For Razorpay payment
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      const response = await dispatch(createOrder(orderData)).unwrap();
      const { order, razorpayOrder } = response;

      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Ecommerce Store',
        description: `Order #${order._id}`,
        order_id: razorpayOrder.id,
        handler: async (paymentResponse) => {
          try {
            await dispatch(
              verifyPayment({
                orderId: order._id,
                paymentId: paymentResponse.razorpay_payment_id,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature
              })
            ).unwrap();

            dispatch(clearCart());
            navigate('/order-success', { 
              state: { 
                orderId: order._id,
                orderAmount: order.totalAmount
              } 
            });
          } catch (error) {
            toast.error('Payment verification failed');
            navigate('/order-failed', { 
              state: { 
                orderId: order._id,
                error: error.message 
              } 
            });
          }
        },
        prefill: {
          name: user.firstName,
          email: user.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#2874f0',
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled. You can try again.');
          }
        },
        notes: {
          orderId: order._id,
          shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}`
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
        navigate('/order-failed', { 
          state: { 
            orderId: order._id,
            error: response.error.description 
          } 
        });
      });
      paymentObject.open();
    } catch (error) {
      toast.error(error.message || 'Failed to create order');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Delivery Address
            </Typography>
            
            {user?.addresses?.length > 0 && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Saved Addresses
                  </Typography>
                  <Grid container spacing={2}>
                    {user.addresses.map((address) => (
                      <Grid item xs={12} key={address._id}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            cursor: 'pointer',
                            border: shippingAddress?._id === address._id ? 2 : 1,
                            borderColor: shippingAddress?._id === address._id ? 'primary.main' : 'divider'
                          }}
                          onClick={() => handleSelectAddress(address)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Radio
                                checked={shippingAddress?._id === address._id}
                                onChange={() => handleSelectAddress(address)}
                              />
                              <Typography variant="subtitle1">
                                {address.isDefault ? 'Default Address' : `Address ${user.addresses.indexOf(address) + 1}`}
                              </Typography>
                            </Box>
                            <Box sx={{ pl: 4 }}>
                              <Typography variant="body1">
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Typography>
                                {address.street}
                              </Typography>
                              <Typography color="text.secondary">
                                {address.city}, {address.state} {address.zipCode}
                              </Typography>
                              <Typography color="text.secondary">
                                {address.country}
                              </Typography>
                              <Typography color="text.secondary">
                                Phone: {address.phone}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                <Divider sx={{ my: 3 }}>
                  <Typography color="text.secondary">OR</Typography>
                </Divider>
              </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                Add New Address
              </Typography>
              {!isNewAddress && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddNewAddressClick}
                >
                  Add New Address
                </Button>
              )}
            </Box>
            
            {isNewAddress && (
              <Formik
                initialValues={{
                  fullName: user?.firstName + ' ' + user?.lastName || '',
                  street: '',
                  addressLine2: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: 'India',
                  phone: user?.phoneNumber || '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleShippingSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="fullName"
                          label="Full Name"
                          value={values.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.fullName && Boolean(errors.fullName)}
                          helperText={touched.fullName && errors.fullName}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="street"
                          label="Street Address"
                          value={values.street}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.street && Boolean(errors.street)}
                          helperText={touched.street && errors.street}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="addressLine2"
                          label="Address Line 2 (Optional)"
                          value={values.addressLine2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="city"
                          label="City"
                          value={values.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.city && Boolean(errors.city)}
                          helperText={touched.city && errors.city}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="state"
                          label="State"
                          value={values.state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.state && Boolean(errors.state)}
                          helperText={touched.state && errors.state}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="zipCode"
                          label="Pincode"
                          value={values.zipCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.zipCode && Boolean(errors.zipCode)}
                          helperText={touched.zipCode && errors.zipCode}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="country"
                          label="Country"
                          value={values.country}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.country && Boolean(errors.country)}
                          helperText={touched.country && errors.country}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="phone"
                          label="Phone Number"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setIsNewAddress(false);
                          setShippingAddress(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        Save & Continue
                      </Button>
                    </Box>
                  </Box>
                )}
              </Formik>
            )}

            {!isNewAddress && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!shippingAddress}
                >
                  Continue to Review
                </Button>
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mb: 4 }}>
              {items.map((item) => (
                <Box
                  key={`${item.product._id}-${item.size}`}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Box sx={{ width: 80, height: 80 }}>
                    <LazyImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width="100%"
                      height="100%"
                      objectFit="contain"
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleBack} sx={{ flex: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ flex: 1 }}
              >
                Proceed to Payment
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Amount: ₹{finalAmount.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, mx: 'auto', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePayment('razorpay')}
                fullWidth
              >
                Pay Online (Razorpay)
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handlePayment('cash_on_delivery')}
                fullWidth
              >
                Cash on Delivery
              </Button>
              <Button 
                variant="text" 
                onClick={handleBack}
                sx={{ mt: 1 }}
              >
                Back
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>{renderStepContent(activeStep)}</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Price Details
              </Typography>
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Price ({items.length} items)</Typography>
                  <Typography>₹{totalAmount?.toLocaleString() || '0'}</Typography>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Delivery Charges</Typography>
                  <Typography>{totalAmount > 100 ? 'Free' : '₹10'}</Typography>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Tax (15%)</Typography>
                  <Typography>₹{taxPrice.toLocaleString()}</Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Grid container justifyContent="space-between">
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h6" color="primary">
                    ₹{finalAmount.toLocaleString()}
                  </Typography>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout; 