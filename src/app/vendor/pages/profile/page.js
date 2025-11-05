'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VendorLayout from '../layout';
import jwt from 'jsonwebtoken';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  Divider,
  Fade,
  Grow,
  Slide,
} from '@mui/material';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Store,
  Calendar,
} from 'lucide-react';
import PageLoader from '../../../components/PageLoader';
import LoadingDialog from '../../../components/LoadingDialog';

const VendorProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [vendorData, setVendorData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const decoded = jwt.decode(token);
        const vendorId = decoded?.vendorId || decoded?.id;

        if (vendorId) {
          const response = await fetch(`/api/vendors/${vendorId}`);
          if (response.ok) {
            const data = await response.json();
            setVendorData(data);
            setFormData({
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const decoded = jwt.decode(token);
      const vendorId = decoded?.vendorId || decoded?.id;

      if (vendorId) {
        const response = await fetch(`/api/vendors/${vendorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedData = await response.json();
          setVendorData(updatedData);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error('Error updating vendor data:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading Profile..." />;
  }

  return (
    <VendorLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', p: 2, pt: 2 }}>
        <LoadingDialog 
          open={saving} 
          message="Saving Profile..." 
          type="loading"
        />
        
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Box>
              {/* Header Card */}
              <Grow in timeout={600}>
                <Card
                  sx={{
                    mb: 3,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          border: '4px solid rgba(255,255,255,0.3)',
                          fontSize: '3rem',
                          fontWeight: 800,
                        }}
                      >
                        {vendorData?.name?.charAt(0)?.toUpperCase() || 'V'}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                          {vendorData?.name || 'Vendor User'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Store size={18} />
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Vendor
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Mail size={16} />
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {vendorData?.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={isEditing ? <Save size={20} /> : <Edit size={20} />}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        sx={{
                          background: 'white',
                          color: '#6366f1',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'rgba(255,255,255,0.9)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>

              {/* Profile Details */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Slide direction="right" in timeout={800}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          p: 2,
                          color: 'white',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Personal Information
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <User size={20} style={{ color: '#6366f1' }} />
                              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                Store Name
                              </Typography>
                            </Box>
                            {isEditing ? (
                              <TextField
                                fullWidth
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  },
                                }}
                              />
                            ) : (
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c' }}>
                                {vendorData?.name || 'Not set'}
                              </Typography>
                            )}
                          </Box>

                          <Divider />

                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Mail size={20} style={{ color: '#6366f1' }} />
                              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                Email Address
                              </Typography>
                            </Box>
                            {isEditing ? (
                              <TextField
                                fullWidth
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  },
                                }}
                              />
                            ) : (
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c' }}>
                                {vendorData?.email || 'Not set'}
                              </Typography>
                            )}
                          </Box>

                          <Divider />

                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Phone size={20} style={{ color: '#6366f1' }} />
                              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                Phone Number
                              </Typography>
                            </Box>
                            {isEditing ? (
                              <TextField
                                fullWidth
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  },
                                }}
                              />
                            ) : (
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c' }}>
                                {vendorData?.phone || 'Not set'}
                              </Typography>
                            )}
                          </Box>

                          <Divider />

                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <MapPin size={20} style={{ color: '#6366f1' }} />
                              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                Address
                              </Typography>
                            </Box>
                            {isEditing ? (
                              <TextField
                                fullWidth
                                name="address"
                                multiline
                                rows={3}
                                value={formData.address}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  },
                                }}
                              />
                            ) : (
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c' }}>
                                {vendorData?.address || 'Not set'}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Slide direction="left" in timeout={1000}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          p: 2,
                          color: 'white',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Store Details
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Paper
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: '#f8fafc',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Store size={18} style={{ color: '#6366f1' }} />
                              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                Status
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c' }}>
                              {vendorData?.status === 'active' ? 'Active' : 'Inactive'}
                            </Typography>
                          </Paper>

                          <Paper
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: '#f8fafc',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Calendar size={18} style={{ color: '#6366f1' }} />
                              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                Member Since
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c' }}>
                              {vendorData?.createdAt
                                ? new Date(vendorData.createdAt).toLocaleDateString()
                                : 'N/A'}
                            </Typography>
                          </Paper>
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<X size={20} />}
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: vendorData?.name || '',
                        email: vendorData?.email || '',
                        phone: vendorData?.phone || '',
                        address: vendorData?.address || '',
                      });
                    }}
                    sx={{
                      borderColor: '#6366f1',
                      color: '#6366f1',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#8b5cf6',
                        background: 'rgba(99, 102, 241, 0.1)',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </VendorLayout>
  );
};

export default VendorProfilePage;

