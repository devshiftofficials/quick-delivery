'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VendorLayout from '../layout';
import { Box, Container, Typography, Grid, Card, CardContent, Grow, Fade } from '@mui/material';
import PageLoader from '../../../components/PageLoader';
// Lucide Icons
import { Plus, Tag, Folder, Package, Store } from 'lucide-react';

const VendorDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const catRes = await fetch('/api/categories');
        const subcatRes = await fetch('/api/subcategories');
        const prodRes = await fetch('/api/products/vendor/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const catData = await catRes.json();
        const subcatData = await subcatRes.json();
        const prodData = await prodRes.json();
        setCategories(Array.isArray(catData) ? catData : (catData.data || []));
        setSubcategories(Array.isArray(subcatData) ? subcatData : (subcatData.data || []));
        setProducts(prodData.status && prodData.data ? prodData.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (loading) {
    return <PageLoader message="Loading Dashboard..." />;
  }

  const stats = [
    {
      label: 'Total Categories',
      value: categories.length,
      icon: <Tag size={32} />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      iconBg: 'rgba(99, 102, 241, 0.2)',
      iconColor: '#6366f1',
    },
    {
      label: 'Total Subcategories',
      value: subcategories.length,
      icon: <Folder size={32} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      iconBg: 'rgba(245, 87, 108, 0.2)',
      iconColor: '#f5576c',
    },
    {
      label: 'Your Products',
      value: products.length,
      icon: <Package size={32} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      iconBg: 'rgba(79, 172, 254, 0.2)',
      iconColor: '#4facfe',
    },
  ];

  return (
    <VendorLayout>
      <Box
        sx={{
          pt: 3,
          minHeight: '100vh',
          bgcolor: 'white',
          position: 'relative',
        }}
      >
        <Container maxWidth="xl" sx={{ px: 3, position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                }}
              >
                Vendor Dashboard
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in timeout={(index + 1) * 200}>
                  <Card
                    sx={{
                      p: 0,
                      borderRadius: 3,
                      background: stat.gradient,
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        transition: 'all 0.5s ease',
                      },
                      '&:hover::before': {
                        transform: 'scale(1.5)',
                        opacity: 0.5,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              opacity: 0.9,
                              mb: 1,
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              fontSize: '0.75rem',
                            }}
                          >
                            {stat.label}
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{
                              fontWeight: 'bold',
                              mb: 1,
                              fontSize: { xs: '2rem', md: '2.5rem' },
                            }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {stat.icon}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </VendorLayout>
  );
};

export default VendorDashboard;
