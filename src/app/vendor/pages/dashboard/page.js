'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VendorLayout from '../layout';
import { Box, Container, Typography, Grid, Paper, Button, Fade, Slide } from '@mui/material';
import PageLoader from '../../../components/PageLoader';
// Lucide Icons
import { Plus, Tag, Folder, Package } from 'lucide-react';
import { motion } from 'framer-motion';

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

  return (
    <VendorLayout>
      <Box sx={{ p: 3, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 } }}>
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Vendor Dashboard
          </Typography>
        </motion.div>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Fade in timeout={800}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, textAlign: 'center', minHeight: 200, background: 'white', border: '1px solid rgba(99, 102, 241, 0.1)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
              <Tag size={48} style={{ color: '#6366f1', marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ mb: 2 }}>Categories</Typography>
              <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
                {categories.map(cat => (
                  <Typography key={cat.id} variant="body1">{cat.name}</Typography>
                ))}
              </Box>
            </Paper>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Fade in timeout={1200}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, textAlign: 'center', minHeight: 200, background: 'white', border: '1px solid rgba(99, 102, 241, 0.1)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
              <Folder size={48} style={{ color: '#8b5cf6', marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ mb: 2 }}>Subcategories</Typography>
              <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
                {subcategories.map(subcat => (
                  <Typography key={subcat.id} variant="body2">{subcat.name}</Typography>
                ))}
              </Box>
            </Paper>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Slide direction="up" in timeout={1500}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, textAlign: 'center', minHeight: 200, background: 'white', border: '1px solid rgba(99, 102, 241, 0.1)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
              <Package size={48} style={{ color: '#f59e0b', marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ mb: 2 }}>Your Products</Typography>
              <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
                {products.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">No products yet.</Typography>
                ) : (
                  products.map(prod => (
                    <Typography key={prod.id} variant="body2">{prod.name}</Typography>
                  ))
                )}
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Plus size={20} />}
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => router.push('/vendor/pages/add-product')}
              >
                Add Product
              </Button>
            </Paper>
          </Slide>
        </Grid>
      </Grid>
        </Container>
      </Box>
    </VendorLayout>
  );
};

export default VendorDashboard;
