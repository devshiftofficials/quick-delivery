'use client';
import React, { useState, useEffect } from 'react';
import FilterableTable from './filterabletable';
import { Box, CircularProgress, Typography } from '@mui/material';

const SizePage = () => {
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      if (!response.ok) {
        throw new Error('Failed to fetch sizes');
      }
      const data = await response.json();
      setSizes(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      setSizes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
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
          Loading Sizes...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <FilterableTable sizes={sizes} fetchSizes={fetchSizes} />
    </Box>
  );
};

export default SizePage;
