'use client'
import { useState, useEffect } from 'react';
import FilterableTable from './FilterableTable';
import { Box } from '@mui/material';
import PageLoader from '../../../components/PageLoader';

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
    return <PageLoader message="Loading Orders..." />;
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <FilterableTable data={orders} fetchData={fetchData} />
    </Box>
  );
};

export default OrdersPage;
