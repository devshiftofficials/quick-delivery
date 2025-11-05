'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Fade, 
  Grow, 
  Slide,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import { Search, Plus, Edit, X, Settings as SettingsIcon } from 'lucide-react';
import LoadingDialog from '../../../components/LoadingDialog';

const FilterableTable = ({ settings = [], fetchSettings }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(settings);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editSetting, setEditSetting] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [settingForm, setSettingForm] = useState({
    deliveryCharge: '',
    taxPercentage: '',
    other1: 0,
    other2: 0,
  });

  useEffect(() => {
    setFilteredData(
      settings.filter((item) =>
        item &&
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, settings]);

  const handleEditItem = (item) => {
    if (!item) return;
    setEditSetting(item);
    setSettingForm({
      deliveryCharge: item?.deliveryCharge ?? '',
      taxPercentage: item?.taxPercentage ?? '',
      other1: item?.other1 ?? 0,
      other2: item?.other2 ?? 0,
    });
    setIsModalVisible(true);
  };

  const handleAddNewItem = () => {
    setEditSetting(null);
    setSettingForm({
      deliveryCharge: '',
      taxPercentage: '',
      other1: 0,
      other2: 0,
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
      } else {
        console.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditSetting(null);
    setSettingForm({
      deliveryCharge: '',
      taxPercentage: '',
      other1: 0,
      other2: 0,
    });
    setIsModalVisible(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', p: 3 }}>
      <LoadingDialog 
        open={isLoading} 
        message={editSetting ? "Updating Settings..." : "Saving Settings..."} 
        type="loading"
      />
      
      <Fade in timeout={800}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            background: 'white',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              p: 3,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <SettingsIcon size={28} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  Settings Management
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => setIsSearchVisible(!isSearchVisible)}
                  sx={{
                    color: 'white',
                    background: 'rgba(255,255,255,0.2)',
                    '&:hover': { background: 'rgba(255,255,255,0.3)' },
                  }}
                >
                  <Search size={20} />
                </IconButton>
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={handleAddNewItem}
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
                  Add Setting
                </Button>
              </Box>
            </Box>
          </Box>

          <Slide direction="down" in={isSearchVisible} mountOnEnter unmountOnExit>
            <Box sx={{ p: 2, bgcolor: '#f8fafc' }}>
              <TextField
                fullWidth
                placeholder="Search settings..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} style={{ color: '#6366f1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'white',
                  },
                }}
              />
            </Box>
          </Slide>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1a202c' }}>Delivery Charge</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1a202c' }}>Tax Percentage</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1a202c' }}>Cash on Delivery</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1a202c' }}>Other Charges</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1a202c' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(filteredData) && filteredData.filter(item => item != null).map((item, index) => (
                  <Grow in timeout={(index + 1) * 100} key={item?.id || index}>
                    <TableRow
                      sx={{
                        '&:hover': {
                          bgcolor: '#f8fafc',
                          transform: 'scale(1.01)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>Rs. {item?.deliveryCharge ?? '0'}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{item?.taxPercentage ?? '0'}%</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>Rs. {item?.other1 ?? '0'}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>Rs. {item?.other2 ?? '0'}</TableCell>
                      <TableCell>
                        <Button
                          startIcon={<Edit size={16} />}
                          onClick={() => handleEditItem(item)}
                          sx={{
                            color: '#6366f1',
                            fontWeight: 600,
                            '&:hover': {
                              background: 'rgba(99, 102, 241, 0.1)',
                            },
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </Grow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Fade>

      <Dialog
        open={isModalVisible}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            fontWeight: 800,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {editSetting ? 'Edit Setting' : 'Add New Setting'}
          <IconButton
            onClick={handleCancelEdit}
            sx={{
              color: 'white',
              '&:hover': { background: 'rgba(255,255,255,0.2)' },
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleFormSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                fullWidth
                label="Delivery Charge (Rs.)"
                name="deliveryCharge"
                type="number"
                value={settingForm.deliveryCharge}
                onChange={handleFormChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Tax Percentage (%)"
                name="taxPercentage"
                type="number"
                value={settingForm.taxPercentage}
                onChange={handleFormChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Cash on Delivery Charges (Rs.)"
                name="other1"
                type="number"
                value={settingForm.other1}
                onChange={handleFormChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Other Charges (Rs.)"
                name="other2"
                type="number"
                value={settingForm.other2}
                onChange={handleFormChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCancelEdit}
            sx={{
              color: '#6b7280',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
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
            {editSetting ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FilterableTable;
