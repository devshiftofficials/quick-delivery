'use client';
import React, { useState, useEffect } from 'react';
import FilterableTable from './filterabletable';
import { Box, CircularProgress, Typography } from '@mui/material';

const ColorPage = () => {
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      if (!response.ok) {
        throw new Error('Failed to fetch colors');
      }
      const data = await response.json();
      setColors(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching colors:', error);
      setColors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
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
          Loading Colors...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <FilterableTable colors={colors} fetchColors={fetchColors} />
    </Box>
  );
};

export default ColorPage;
