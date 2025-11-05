'use client';
import React, { useState, useEffect } from 'react';
import VendorLayout from '../layout';
import { Box, Container, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import PageLoader from '../../../components/PageLoader';
import LoadingDialog from '../../../components/LoadingDialog';
// Lucide Icons
import { Edit, Settings } from 'lucide-react';

const VendorSettingPage = () => {
  const [settings, setSettings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editSetting, setEditSetting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [settingForm, setSettingForm] = useState({
    deliveryCharge: '',
    taxPercentage: '',
    other1: 0,
    other2: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsInitialLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditSetting(item);
    setSettingForm({
      deliveryCharge: item.deliveryCharge,
      taxPercentage: item.taxPercentage,
      other1: item.other1,
      other2: item.other2,
    });
    setIsModalVisible(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSettingForm({ ...settingForm, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = editSetting ? 'PUT' : 'POST';
      const url = editSetting ? `/api/settings/${editSetting.id}` : '/api/settings';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingForm),
      });

      if (response.ok) {
        fetchSettings();
        setIsModalVisible(false);
        setEditSetting(null);
        setSettingForm({
          deliveryCharge: '',
          taxPercentage: '',
          other1: 0,
          other2: 0,
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return <PageLoader message="Loading Settings..." />;
  }

  return (
    <VendorLayout>
      <LoadingDialog 
        open={isLoading} 
        message="Processing..." 
        type="loading"
      />
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '100%' }}>
        <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 }, py: 2, pt: 2 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Settings
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              background: 'white',
              width: '100%',
              overflowX: 'auto',
            }}
          >
            <Table sx={{ minWidth: 650, width: '100%' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Delivery Charge</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Tax Percentage</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Cash on Delivery Charges</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Other Charges</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {settings.length > 0 ? (
                  settings.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.deliveryCharge}</TableCell>
                      <TableCell>{item.taxPercentage}</TableCell>
                      <TableCell>{item.other1}</TableCell>
                      <TableCell>{item.other2}</TableCell>
                      <TableCell>
                        <Button
                          startIcon={<Edit size={18} />}
                          onClick={() => handleEditItem(item)}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: '#6366f1',
                            color: '#6366f1',
                            '&:hover': {
                              borderColor: '#8b5cf6',
                              background: 'rgba(99, 102, 241, 0.1)',
                            },
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                      No settings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog 
            open={isModalVisible} 
            onClose={() => setIsModalVisible(false)} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, pb: 2 }}>
              {editSetting ? 'Edit Setting' : 'Add Setting'}
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Delivery Charge"
                  name="deliveryCharge"
                  type="number"
                  value={settingForm.deliveryCharge}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  variant="outlined"
                />
                <TextField
                  label="Tax Percentage"
                  name="taxPercentage"
                  type="number"
                  value={settingForm.taxPercentage}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  variant="outlined"
                />
                <TextField
                  label="Cash on Delivery Charges"
                  name="other1"
                  type="number"
                  value={settingForm.other1}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Other Charges"
                  name="other2"
                  type="number"
                  value={settingForm.other2}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button 
                onClick={() => setIsModalVisible(false)}
                variant="outlined"
                sx={{ color: '#64748b', borderColor: '#e2e8f0' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleFormSubmit} 
                variant="contained" 
                disabled={isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </VendorLayout>
  );
};

export default VendorSettingPage;
