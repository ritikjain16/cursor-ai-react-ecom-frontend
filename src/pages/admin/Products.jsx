import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../store/slices/adminSlice';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.admin);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isNewProduct, setIsNewProduct] = React.useState(false);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    setIsNewProduct(true);
    setSelectedProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      images: [],
    });
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setIsNewProduct(false);
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (isNewProduct) {
        await dispatch(createProduct(selectedProduct)).unwrap();
        toast.success('Product added successfully');
      } else {
        await dispatch(updateProduct({
          productId: selectedProduct._id,
          productData: selectedProduct
        })).unwrap();
        toast.success('Product updated successfully');
      }
      setOpenDialog(false);
      dispatch(fetchAdminProducts());
    } catch (error) {
      toast.error(error || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success('Product deleted successfully');
        dispatch(fetchAdminProducts());
      } catch (error) {
        toast.error(error || 'Failed to delete product');
      }
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 220 },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.images[0]}
          alt={params.row.name}
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
      ),
    },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'category', headerName: 'Category', width: 130 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEditProduct(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteProduct(params.row._id)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Product Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', height: 'calc(100vh - 200px)' }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row._id}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isNewProduct ? 'Add New Product' : 'Edit Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={selectedProduct?.name || ''}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={selectedProduct?.category || ''}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, category: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={selectedProduct?.price || ''}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, price: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={selectedProduct?.stock || ''}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, stock: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={selectedProduct?.description || ''}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URLs (comma-separated)"
                value={selectedProduct?.images?.join(', ') || ''}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    images: e.target.value.split(',').map((url) => url.trim()),
                  })
                }
                helperText="Enter image URLs separated by commas"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            {isNewProduct ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProducts; 