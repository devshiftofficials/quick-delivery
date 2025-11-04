'use client';
import { Box } from '@mui/material';
import FilterableTable from './FilterableTable';

const CategoriesPage = () => {
  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <FilterableTable />
    </Box>
  );
};

export default CategoriesPage;
