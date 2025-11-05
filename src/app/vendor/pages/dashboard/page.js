'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VendorLayout from '../layout';
import { Box, Container, Typography, Grid, Card, CardContent, Grow, Fade } from '@mui/material';
import PageLoader from '../../../components/PageLoader';
// Lucide Icons
import { Tag, Folder, Package, TrendingUp, DollarSign, CheckCircle2, ShoppingCart } from 'lucide-react';

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

  const activeProducts = products.filter(p => p.stock > 0).length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockProducts = products.filter(p => p.stock === 0 || !p.stock).length;

  const stats = [
    {
      label: 'Total Categories',
      value: categories.length,
      icon: <Tag size={32} />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
    {
      label: 'Total Subcategories',
      value: subcategories.length,
      icon: <Folder size={32} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      label: 'Your Products',
      value: products.length,
      icon: <Package size={32} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      label: 'Active Products',
      value: activeProducts,
      icon: <CheckCircle2 size={32} />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      label: 'Low Stock Items',
      value: lowStockProducts,
      icon: <TrendingUp size={32} />,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
    {
      label: 'Out of Stock',
      value: outOfStockProducts,
      icon: <ShoppingCart size={32} />,
      gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    },
  ];

  return (
    <VendorLayout>
      <Box
        sx={{
          pt: 2,
          minHeight: '100vh',
          bgcolor: 'white',
          position: 'relative',
        }}
      >
        <Container maxWidth="xl" sx={{ px: 3, py: 2, pt: 2, position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Welcome Back!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#64748b',
                  fontSize: '1rem',
                }}
              >
                Here's an overview of your store performance
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in timeout={(index + 1) * 200}>
                  <Card
                    sx={{
                      background: 'white',
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2,
                            background: stat.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            flexShrink: 0,
                          }}
                        >
                          <Box sx={{ color: 'white' }}>
                            {stat.icon}
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#64748b',
                              fontSize: '0.875rem',
                              mb: 0.5,
                              fontWeight: 500,
                            }}
                          >
                            {stat.label}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              background: stat.gradient,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontSize: '1.75rem',
                              lineHeight: 1.2,
                            }}
                          >
                            {stat.value}
                          </Typography>
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
