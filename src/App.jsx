import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './store/slices/authSlice';
import AppRoutes from './routes';
import Layout from './components/layout/Layout';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

export default App; 