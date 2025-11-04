'use client';
import React, { useState, useEffect } from 'react';
import VendorLayout from '../layout';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Image from 'next/image';

const VendorCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      // Handle both response formats: { status, data } or direct array
      if (result.status && result.data) {
        setCategories(Array.isArray(result.data) ? result.data : []);
      } else if (Array.isArray(result)) {
        setCategories(result);
      } else if (Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/subcategories');
      const result = await response.json();
      // Handle both response formats
      if (result.status && result.data) {
        setSubcategories(Array.isArray(result.data) ? result.data : []);
      } else if (Array.isArray(result)) {
        setSubcategories(result);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const filteredSubcategories = Array.isArray(subcategories)
    ? (selectedCategory
        ? subcategories.filter((sub) => sub.categoryId === selectedCategory.id)
        : subcategories)
    : [];

  return (
    <VendorLayout>
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '100%' }}>
        <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 }, py: 3 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Categories & Subcategories
          </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>Categories</Typography>
            <Grid container spacing={2}>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                <Grid item xs={12} key={category.id}>
                  <Card
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 6 },
                      bgcolor: selectedCategory?.id === category.id ? 'primary.light' : 'background.paper',
                    }}
                  >
                    <CardContent>
                      {category.imageUrl && (
                        <CardMedia sx={{ mb: 2 }}>
                          <Image
                            src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${category.imageUrl}`}
                            alt={category.name}
                            width={100}
                            height={100}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                          />
                        </CardMedia>
                      )}
                      <Typography variant="h6">{category.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    No categories found
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedCategory ? `Subcategories in ${selectedCategory.name}` : 'All Subcategories'}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(filteredSubcategories) && filteredSubcategories.length > 0 ? (
                    filteredSubcategories.map((sub) => {
                    const parentCategory = categories.find((cat) => cat.id === sub.categoryId);
                    return (
                      <TableRow key={sub.id}>
                        <TableCell>
                          {sub.imageUrl && (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${sub.imageUrl}`}
                              alt={sub.name}
                              width={50}
                              height={50}
                              style={{ objectFit: 'cover', borderRadius: 4 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{sub.name}</TableCell>
                        <TableCell>{parentCategory?.name || 'N/A'}</TableCell>
                      </TableRow>
                    );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No subcategories found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        </Container>
      </Box>
    </VendorLayout>
  );
};

export default VendorCategoriesPage;

