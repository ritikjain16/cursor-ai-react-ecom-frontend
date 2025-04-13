import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Block } from '@mui/icons-material';
import { fetchAdminUsers } from '../../store/slices/adminSlice';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`/api/admin/users/${selectedUser._id}`, selectedUser);
      toast.success('User updated successfully');
      dispatch(fetchAdminUsers());
      setOpenDialog(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        toast.success('User deleted successfully');
        dispatch(fetchAdminUsers());
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      await axios.put(`/api/admin/users/${userId}/block`, { blocked: !isBlocked });
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      dispatch(fetchAdminUsers());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 100 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEditUser(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.blocked ? 'Unblock' : 'Block'}>
            <IconButton
              onClick={() => handleToggleBlock(params.row._id, params.row.blocked)}
              color={params.row.blocked ? 'error' : 'default'}
            >
              <Block />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteUser(params.row._id)}
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
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden', height: 'calc(100vh - 200px)' }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row._id}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              value={selectedUser?.firstName || ''}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, firstName: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={selectedUser?.lastName || ''}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, lastName: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={selectedUser?.email || ''}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Role"
              value={selectedUser?.role || ''}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers; 