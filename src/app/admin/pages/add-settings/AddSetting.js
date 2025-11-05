'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Fade,
  Grow,
  Slide,
  Card,
  CardContent,
} from '@mui/material';
import { Settings, X } from 'lucide-react';
import LoadingDialog from '../../../components/LoadingDialog';

const AddSetting = ({ setting = null, fetchSettings }) => {
  const [formData, setFormData] = useState({
    deliveryCharge: setting?.deliveryCharge || '',
    taxPercentage: setting?.taxPercentage || '',
    other1: setting?.other1 || 0,
    other2: setting?.other2 || 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (setting && typeof setting === 'object') {
      setFormData({
        deliveryCharge: setting?.deliveryCharge || '',
        taxPercentage: setting?.taxPercentage || '',
        other1: setting?.other1 || 0,
        other2: setting?.other2 || 0,
      });
    }
  }, [setting]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchSettings();
        router.push('/admin/pages/settings');
      } else {
        console.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', p: 3 }}>
      <LoadingDialog 
        open={isLoading} 
        message="Saving Settings..." 
        type="loading"
      />
      
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                p: 3,
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Settings size={28} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {setting?.id ? 'Edit Setting' : 'Add New Setting'}
                </Typography>
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleFormSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Grow in timeout={600}>
                    <TextField
                      fullWidth
                      label="Delivery Charge (Rs.)"
                      name="deliveryCharge"
                      type="number"
                      value={formData.deliveryCharge}
                      onChange={handleFormChange}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grow>

                  <Grow in timeout={700}>
                    <TextField
                      fullWidth
                      label="Tax Percentage (%)"
                      name="taxPercentage"
                      type="number"
                      value={formData.taxPercentage}
                      onChange={handleFormChange}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grow>

                  <Grow in timeout={800}>
                    <TextField
                      fullWidth
                      label="Cash on Delivery Charges (Rs.)"
                      name="other1"
                      type="number"
                      value={formData.other1}
                      onChange={handleFormChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grow>

                  <Grow in timeout={900}>
                    <TextField
                      fullWidth
                      label="Other Charges (Rs.)"
                      name="other2"
                      type="number"
                      value={formData.other2}
                      onChange={handleFormChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grow>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button
                      onClick={() => router.push('/admin/pages/settings')}
                      variant="outlined"
                      sx={{
                        borderColor: '#6366f1',
                        color: '#6366f1',
                        fontWeight: 600,
                        px: 4,
                        '&:hover': {
                          borderColor: '#8b5cf6',
                          background: 'rgba(99, 102, 241, 0.1)',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        fontWeight: 600,
                        px: 4,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {setting?.id ? 'Update' : 'Add'} Setting
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default AddSetting;
