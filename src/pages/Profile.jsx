import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Card,
  CardContent,
  IconButton,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { updateUser } from '../store/slices/authSlice';
import api from '../services/api';

const addressValidationSchema = Yup.object({
  street: Yup.string().required('Street address is required'),
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

const profileValidationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name should be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name should be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAddressDialog = (address = null) => {
    setEditingAddress(address);
    setIsAddressDialogOpen(true);
    if (address) {
      addressFormik.setValues({
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
      });
    } else {
      addressFormik.resetForm({
        values: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
          phone: '',
        }
      });
    }
  };

  const handleCloseAddressDialog = () => {
    setEditingAddress(null);
    setIsAddressDialogOpen(false);
    addressFormik.resetForm();
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setIsSubmitting(true);
      const response = await api.put('/users/address/default', { addressId });

      dispatch(updateUser(response.data));
      toast.success('Default address updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set default address');
      setError(err.response?.data?.message || 'Failed to set default address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setIsSubmitting(true);
      await api.delete(`/users/address/${addressId}`);

      dispatch(updateUser(response.data));
      toast.success('Address deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete address');
      setError(err.response?.data?.message || 'Failed to delete address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/address/${editingAddress._id}`, editingAddress);
      // ... rest of the function
    } catch (error) {
      // ... error handling
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/address', newAddress);
      // ... rest of the function
    } catch (error) {
      // ... error handling
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/profile', formData);
      // ... rest of the function
    } catch (error) {
      // ... error handling
    }
  };

  const addressFormik = useFormik({
    initialValues: {
      street: editingAddress?.street || '',
      city: editingAddress?.city || '',
      state: editingAddress?.state || '',
      zipCode: editingAddress?.zipCode || '',
      country: editingAddress?.country || 'India',
      phone: editingAddress?.phone || '',
    },
    validationSchema: addressValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setError(null);
        setIsSubmitting(true);
        let response;

        if (editingAddress) {
          response = await api.put(`/users/address/${editingAddress._id}`, values);
          toast.success('Address updated successfully');
        } else {
          response = await api.post('/users/address', {
            ...values,
            isDefault: user?.addresses?.length === 0 // Make first address default
          });
          toast.success('Address added successfully');
        }

        // Update the entire user object in Redux
        dispatch(updateUser(response.data));
        handleCloseAddressDialog();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to save address');
        setError(err.response?.data?.message || 'Failed to save address');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const profileFormik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        setSuccess(false);
        
        const response = await api.put('/users/profile', values);

        dispatch(updateUser(response.data));
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update profile');
      }
    },
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <form onSubmit={profileFormik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={profileFormik.values.firstName}
                    onChange={profileFormik.handleChange}
                    error={profileFormik.touched.firstName && Boolean(profileFormik.errors.firstName)}
                    helperText={profileFormik.touched.firstName && profileFormik.errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={profileFormik.values.lastName}
                    onChange={profileFormik.handleChange}
                    error={profileFormik.touched.lastName && Boolean(profileFormik.errors.lastName)}
                    helperText={profileFormik.touched.lastName && profileFormik.errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    value={profileFormik.values.email}
                    onChange={profileFormik.handleChange}
                    error={profileFormik.touched.email && Boolean(profileFormik.errors.email)}
                    helperText={profileFormik.touched.email && profileFormik.errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    value={profileFormik.values.phoneNumber}
                    onChange={profileFormik.handleChange}
                    error={profileFormik.touched.phoneNumber && Boolean(profileFormik.errors.phoneNumber)}
                    helperText={profileFormik.touched.phoneNumber && profileFormik.errors.phoneNumber}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!profileFormik.dirty || profileFormik.isSubmitting}
                >
                  {profileFormik.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Address Information
            </Typography>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Saved Addresses ({user?.addresses?.length || 0})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenAddressDialog()}
                  disabled={isSubmitting}
                >
                  Add New Address
                </Button>
              </Box>

              {user?.addresses?.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No addresses saved yet. Add your first address!
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {user?.addresses?.map((address) => (
                    <Grid item xs={12} key={address._id}>
                      <Card 
                        variant="outlined"
                        sx={{
                          borderColor: address.isDefault ? 'primary.main' : 'inherit',
                          position: 'relative',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: 1
                          }
                        }}
                      >
                        {address.isDefault && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              bgcolor: 'primary.main',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderBottomLeftRadius: 4,
                              fontSize: '0.75rem'
                            }}
                          >
                            Default
                          </Box>
                        )}
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Radio
                              checked={address.isDefault}
                              onChange={() => handleSetDefaultAddress(address._id)}
                              color="primary"
                              disabled={isSubmitting || address.isDefault}
                            />
                            <Typography variant="subtitle1">
                              {address.isDefault ? 'Default Address' : 'Set as Default'}
                            </Typography>
                            <Box sx={{ ml: 'auto' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenAddressDialog(address)}
                                sx={{ mr: 1 }}
                                disabled={isSubmitting}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteAddress(address._id)}
                                disabled={isSubmitting || address.isDefault}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                          <Box sx={{ pl: 4 }}>
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
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={isAddressDialogOpen}
        onClose={handleCloseAddressDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={addressFormik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="street"
                  name="street"
                  label="Street Address"
                  value={addressFormik.values.street}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.street && Boolean(addressFormik.errors.street)}
                  helperText={addressFormik.touched.street && addressFormik.errors.street}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="city"
                  name="city"
                  label="City"
                  value={addressFormik.values.city}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.city && Boolean(addressFormik.errors.city)}
                  helperText={addressFormik.touched.city && addressFormik.errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="state"
                  name="state"
                  label="State"
                  value={addressFormik.values.state}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.state && Boolean(addressFormik.errors.state)}
                  helperText={addressFormik.touched.state && addressFormik.errors.state}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="zipCode"
                  name="zipCode"
                  label="Pincode"
                  value={addressFormik.values.zipCode}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.zipCode && Boolean(addressFormik.errors.zipCode)}
                  helperText={addressFormik.touched.zipCode && addressFormik.errors.zipCode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="country"
                  name="country"
                  label="Country"
                  value={addressFormik.values.country}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.country && Boolean(addressFormik.errors.country)}
                  helperText={addressFormik.touched.country && addressFormik.errors.country}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={addressFormik.values.phone}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.phone && Boolean(addressFormik.errors.phone)}
                  helperText={addressFormik.touched.phone && addressFormik.errors.phone}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addressFormik.handleSubmit}
            disabled={!addressFormik.dirty || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (editingAddress ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 