'use client';
import { useEffect, useState } from 'react';
import { Box, Fade } from '@mui/material';
import FilterableSliderTable from './filterabletable';
import PageLoader from '../../../components/PageLoader';

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
    return <PageLoader message="Loading Sliders..." />;
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <FilterableSliderTable sliders={data} fetchSliders={fetchData} />
      </Box>
    </Fade>
  );
};

export default SliderPage;
