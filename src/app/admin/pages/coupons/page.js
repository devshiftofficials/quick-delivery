'use client';
import React, { useState, useEffect } from 'react';
import FilterableCouponTable from './FilterableCouponTable';
import { Box } from '@mui/material';
import PageLoader from '../../../components/PageLoader';

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
    return <PageLoader message="Loading Coupons..." />;
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <FilterableCouponTable coupons={coupons} fetchCoupons={fetchCoupons} />
    </Box>
  );
};

export default CouponsPage;
