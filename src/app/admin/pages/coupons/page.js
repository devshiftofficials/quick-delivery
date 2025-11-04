'use client';
import React, { useState, useEffect } from 'react';
import FilterableCouponTable from './FilterableCouponTable';
import { Box, CircularProgress, Typography } from '@mui/material';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons');
      if (!response.ok) {
        throw new Error('Failed to fetch coupons');
      }
      const data = await response.json();
      setCoupons(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
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
          Loading Coupons...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <FilterableCouponTable coupons={coupons} fetchCoupons={fetchCoupons} />
    </Box>
  );
};

export default CouponsPage;
