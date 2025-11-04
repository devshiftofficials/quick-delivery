'use client';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Fade } from '@mui/material';
import FilterableSliderTable from './filterabletable';

const SliderPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/slider');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
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
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f7fa',
        }}
      >
        <CircularProgress sx={{ color: '#ff5900' }} />
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
        <FilterableSliderTable sliders={data} fetchSliders={fetchData} />
      </Box>
    </Fade>
  );
};

export default SliderPage;
