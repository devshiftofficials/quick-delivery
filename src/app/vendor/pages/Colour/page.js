'use client';
import React, { useState, useEffect } from 'react';
import VendorLayout from '../layout';
import { Box, Container, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress } from '@mui/material';
import PageLoader from '../../../components/PageLoader';
import LoadingDialog from '../../../components/LoadingDialog';
// Lucide Icons
import { Plus, Edit, Trash2, Palette } from 'lucide-react';

const VendorColourPage = () => {
  const [colors, setColors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState({ id: null, name: '', hex: '#000000' });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      setIsInitialLoading(true);
      const response = await fetch('/api/colors');
      const data = await response.json();
      setColors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching colors:', error);
      setColors([]);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleAddOrUpdateColor = async () => {
    setIsLoading(true);
    try {
      const url = currentColor.id ? `/api/colors/${currentColor.id}` : '/api/colors';
      const method = currentColor.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentColor.name, hex: currentColor.hex }),
      });

      if (response.ok) {
        fetchColors();
        setIsModalOpen(false);
        setCurrentColor({ id: null, name: '', hex: '#000000' });
      }
    } catch (error) {
      console.error('Error saving color:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteColor = async (id) => {
    if (!confirm('Are you sure you want to delete this color?')) return;

    try {
      const response = await fetch(`/api/colors/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchColors();
      }
    } catch (error) {
      console.error('Error deleting color:', error);
    }
  };

  if (isInitialLoading) {
    return <PageLoader message="Loading Colors..." />;
  }

  return (
    <VendorLayout>
      <LoadingDialog 
        open={isLoading} 
        message="Processing..." 
        type="loading"
      />
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '100%' }}>
        <Container maxWidth="lg" sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 }, py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Colors
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => {
                setCurrentColor({ id: null, name: '', hex: '#000000' });
                setIsModalOpen(true);
              }}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Add Color
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              background: 'white',
            }}
          >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Hex</TableCell>
                <TableCell>Preview</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(colors) && colors.length > 0 ? (
                colors.map((color) => (
                  <TableRow key={color.id}>
                    <TableCell>{color.id}</TableCell>
                    <TableCell>{color.name}</TableCell>
                    <TableCell>{color.hex || 'N/A'}</TableCell>
                    <TableCell>
                      {color.hex && (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: color.hex,
                            border: '1px solid #ccc',
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => {
                        setCurrentColor(color);
                        setIsModalOpen(true);
                      }} color="primary">
                        <Edit size={18} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteColor(color.id)} color="error">
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No colors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </TableContainer>

          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle>{currentColor.id ? 'Edit Color' : 'Add Color'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Color Name"
              value={currentColor.name}
              onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              label="Hex Code"
              type="color"
              value={currentColor.hex}
              onChange={(e) => setCurrentColor({ ...currentColor, hex: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddOrUpdateColor} variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </VendorLayout>
  );
};

export default VendorColourPage;

