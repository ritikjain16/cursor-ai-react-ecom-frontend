import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit } from '@mui/icons-material';
import {
  fetchAdminOrders,
  updateOrderStatus,
} from '../../store/slices/adminSlice';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.admin);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await dispatch(updateOrderStatus({
        orderId: selectedOrder._id,
        status: selectedOrder.status
      })).unwrap();
      toast.success('Order status updated successfully');
      setOpenDialog(false);
    } catch (error) {
      toast.error(error || 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    { field: '_id', headerName: 'Order ID', width: 220 },
    {
      field: 'user',
      headerName: 'Customer',
      width: 200,
      valueGetter: (params) => {
        if (!params) return 'N/A';
        return `${params.firstName || ''} ${params.lastName || ''}`.trim() || 'N/A';
      },
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      width: 130,
      valueFormatter: (params) => {
        if (!params && params !== 0) return '₹0.00';
        return `₹${Number(params).toFixed(2)}`;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        if (!params || !params.value) return <Chip label="Unknown" color="default" size="small" />;
        return (
          <Chip
            label={params.value}
            color={getStatusColor(params.value)}
            size="small"
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Order Date',
      width: 180,
      valueFormatter: (params) => {
        if (!params) return '';
        return new Date(params).toLocaleString();
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Edit Status">
          <IconButton onClick={() => handleEditOrder(params.row)}>
            <Edit />
          </IconButton>
        </Tooltip>
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
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden', height: 'calc(100vh - 200px)' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row._id}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedOrder?.status || ''}
                label="Status"
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, status: e.target.value })
                }
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrders; 