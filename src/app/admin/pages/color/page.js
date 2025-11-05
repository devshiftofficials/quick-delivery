'use client';
import React, { useState, useEffect } from 'react';
import FilterableTable from './filterabletable';
import { Box } from '@mui/material';
import PageLoader from '../../../components/PageLoader';

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
    return <PageLoader message="Loading Colors..." />;
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <FilterableTable colors={colors} fetchColors={fetchColors} />
    </Box>
  );
};

export default ColorPage;
