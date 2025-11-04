'use client';
import { useEffect, useState } from 'react';
import FilterableTable from './FilterableTable';
import { Box, CircularProgress, Typography } from '@mui/material';

const SubcategoriesPage = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch subcategories from the API
  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/subcategories');
      const result = await response.json();

      if (result.status) {
        setSubcategories(result.data || []); // Extracting data array from result
      } else {
        console.error('Failed to fetch subcategories:', result.message);
        setSubcategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();

      if (result.status) {
        setCategories(result.data || []); // Extracting data array from result
      } else if (Array.isArray(result)) {
        setCategories(result);
      } else if (result.data) {
        setCategories(result.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Fetch both subcategories and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchSubcategories(), fetchCategories()]);
      setIsLoading(false);
    };
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
          Loading Subcategories...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
        <FilterableTable
        subcategories={subcategories}
        fetchSubcategories={fetchSubcategories}
        categories={categories}
        />
    </Box>
  );
};

export default SubcategoriesPage;
