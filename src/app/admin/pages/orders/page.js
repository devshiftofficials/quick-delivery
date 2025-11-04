'use client'
import { useState, useEffect } from 'react';
import FilterableTable from './FilterableTable';
import { Box, CircularProgress, Typography } from '@mui/material';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Handle both array and object responses
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.status === false) {
        console.error('API Error:', data.message || data.error);
        setOrders([]);
      } else {
      setOrders(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: '#ff5900' }} />
        <Typography variant="h6" sx={{ color: '#ff5900', fontWeight: 600 }}>
          Loading Orders...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <FilterableTable data={orders} fetchData={fetchData} />
    </Box>
  );
};

export default OrdersPage;
