'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import FilterableTable from './FilterableTable';

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin');
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
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
          Loading Admin Users...
        </Typography>
      </Box>
    );
  }

  return <FilterableTable data={data} fetchData={fetchData} />;
}
