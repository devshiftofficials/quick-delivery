'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import FilterableCustomerTable from './FilterableCustomerTable';

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'white',
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: '#ff5900' }} />
        <Typography variant="h6" sx={{ color: '#ff5900', fontWeight: 600 }}>
          Loading Customers...
        </Typography>
      </Box>
    );
  }

  return (
    <FilterableCustomerTable
      customers={customers}
      fetchCustomers={fetchData}
    />
  );
}
