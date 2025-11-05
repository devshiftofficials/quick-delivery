'use client';
import React, { useState, useEffect } from 'react';
import VendorLayout from '../layout';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Image from 'next/image';
import PageLoader from '../../../components/PageLoader';

const VendorCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCategories(), fetchSubcategories()]);
      setIsLoading(false);
    };
    fetchAllData();
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

  if (isLoading) {
    return <PageLoader message="Loading Categories..." />;
  }

  return (
    <VendorLayout>
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '100%' }}>
        <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 }, py: 2, pt: 2 }}>
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
            <Paper
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Categories
              </Typography>
            </Paper>
            <Grid container spacing={2}>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                <Grid item xs={12} key={category.id}>
                  <Card
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 3,
                      boxShadow: selectedCategory?.id === category.id 
                        ? '0 8px 24px rgba(99, 102, 241, 0.3)' 
                        : '0 4px 12px rgba(0,0,0,0.08)',
                      border: selectedCategory?.id === category.id 
                        ? '2px solid #6366f1' 
                        : '1px solid rgba(99, 102, 241, 0.1)',
                      bgcolor: selectedCategory?.id === category.id 
                        ? 'rgba(99, 102, 241, 0.05)' 
                        : 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      {category.imageUrl && (
                        <Box
                          sx={{
                            mb: 2,
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }}
                        >
                          <Image
                            src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${category.imageUrl}`}
                            alt={category.name}
                            width={120}
                            height={120}
                            style={{ objectFit: 'cover', width: '100%', height: '120px' }}
                          />
                        </Box>
                      )}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: selectedCategory?.id === category.id ? '#6366f1' : '#1a202c',
                        }}
                      >
                        {category.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
              ) : (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: '#f8fafc',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      No categories found
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {selectedCategory ? `Subcategories in ${selectedCategory.name}` : 'All Subcategories'}
              </Typography>
            </Paper>
            <TableContainer 
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#1a202c' }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1a202c' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1a202c' }}>Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(filteredSubcategories) && filteredSubcategories.length > 0 ? (
                    filteredSubcategories.map((sub) => {
                    const parentCategory = categories.find((cat) => cat.id === sub.categoryId);
                    return (
                      <TableRow 
                        key={sub.id}
                        sx={{
                          '&:hover': {
                            bgcolor: 'rgba(99, 102, 241, 0.02)',
                          },
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <TableCell>
                          {sub.imageUrl && (
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              }}
                            >
                              <Image
                                src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${sub.imageUrl}`}
                                alt={sub.name}
                                width={60}
                                height={60}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              />
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a202c' }}>
                            {sub.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {parentCategory?.name || 'N/A'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" sx={{ color: '#64748b' }}>
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

