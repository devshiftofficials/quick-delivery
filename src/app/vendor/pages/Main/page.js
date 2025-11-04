'use client';
import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import VendorLayout from '../layout';

// MUI Imports
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
// Lucide Icons
import {
  Package,
  TrendingUp,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

export default function VendorHome() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const decoded = jwt.decode(token);
        const vendorId = decoded?.vendorId;

        if (!vendorId) {
          setError('Vendor ID not found in token. Please log in again.');
          setLoading(false);
          return;
        }

        // Fetch vendor products
        const productsResponse = await fetch('/api/products/vendor/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          if (productsData.status && productsData.data) {
            const products = productsData.data || [];

            setStats({
              totalProducts: products.length,
              activeProducts: products.filter(p => p.stock > 0).length,
              totalRevenue: 0, // You can calculate this from orders if needed
              pendingOrders: 0, // You can fetch orders for this vendor
            });
            setError(null);
          } else {
            setError(productsData.message || 'Failed to fetch products');
          }
        } else {
          const errorData = await productsResponse.json().catch(() => ({}));
          setError(errorData.message || 'Database connection issue. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching vendor stats:', error);
        setError('Unable to connect to database. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorStats();
  }, []);

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: <Package size={32} />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
      iconBg: 'rgba(59, 130, 246, 0.1)',
      iconColor: '#3B82F6',
    },
    {
      label: 'Active Products',
      value: stats.activeProducts,
      icon: <CheckCircle2 size={32} />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      iconBg: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#10B981',
    },
    {
      label: 'Total Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={32} />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      iconBg: 'rgba(245, 158, 11, 0.1)',
      iconColor: '#F59E0B',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <TrendingUp size={32} />,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      iconBg: 'rgba(239, 68, 68, 0.1)',
      iconColor: '#EF4444',
    },
  ];

  return (
    <VendorLayout>
      <Box sx={{ width: '100%', boxSizing: 'border-box', minHeight: '100%' }}>
        <Container
          maxWidth="xl"
          sx={{
            width: '100%',
            maxWidth: '100%',
            px: { xs: 2, sm: 3 },
            py: 3,
          }}
        >
          {/* Welcome Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
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

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#64748b' }}>Loading...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center', maxWidth: '600px', mx: 'auto', mt: 2 }}>
              <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                Server error
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                {error}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                Please try refreshing the page or contact support if the issue persists.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {statCards.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
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
                            boxShadow: `0 4px 12px ${stat.iconColor}40`,
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
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </VendorLayout>
  );
}

