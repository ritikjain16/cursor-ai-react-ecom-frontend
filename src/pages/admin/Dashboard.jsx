import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  People,
  ShoppingBag,
  LocalShipping,
  AttachMoney,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchDashboardStats } from '../../store/slices/adminSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats: stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

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

  if (!stats) {
    return null;
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Icon sx={{ fontSize: 40, color }} />
          <Box ml={2}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const recentOrdersData = {
    labels: stats.recentOrders.map(order => 
      new Date(order.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Order Amount',
        data: stats.recentOrders.map(order => order.totalAmount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={People}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={ShoppingBag}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={LocalShipping}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toFixed(2)}`}
            icon={AttachMoney}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <Box height={300}>
              <Line
                data={recentOrdersData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Selling Products
            </Typography>
            {stats.topProducts.map((item) => (
              <Box
                key={item.product._id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      marginRight: 16,
                    }}
                  />
                  <Typography variant="body1">{item.product.name}</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {item.totalSold} sold
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 