'use client';
import React, { useState, useEffect } from 'react';
import VendorLayout from '../layout';
import { Box, Container, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress } from '@mui/material';
import PageLoader from '../../../components/PageLoader';
import LoadingDialog from '../../../components/LoadingDialog';
// Lucide Icons
import { Plus, Edit, Trash2, Ruler } from 'lucide-react';

const VendorSizePage = () => {
  const [sizes, setSizes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSize, setCurrentSize] = useState({ id: null, name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      setIsInitialLoading(true);
      const response = await fetch('/api/sizes');
      const data = await response.json();
      setSizes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      setSizes([]);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleAddOrUpdateSize = async () => {
    setIsLoading(true);
    try {
      const url = currentSize.id ? `/api/sizes/${currentSize.id}` : '/api/sizes';
      const method = currentSize.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentSize.name }),
      });

      if (response.ok) {
        fetchSizes();
        setIsModalOpen(false);
        setCurrentSize({ id: null, name: '' });
      }
    } catch (error) {
      console.error('Error saving size:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSize = async (id) => {
    if (!confirm('Are you sure you want to delete this size?')) return;

    try {
      const response = await fetch(`/api/sizes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSizes();
      }
    } catch (error) {
      console.error('Error deleting size:', error);
    }
  };

  if (isInitialLoading) {
    return <PageLoader message="Loading Sizes..." />;
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
              Sizes
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => {
                setCurrentSize({ id: null, name: '' });
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
              Add Size
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(sizes) && sizes.length > 0 ? (
                sizes.map((size) => (
                <TableRow key={size.id}>
                  <TableCell>{size.id}</TableCell>
                  <TableCell>{size.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setCurrentSize(size);
                      setIsModalOpen(true);
                    }} color="primary">
                      <Edit size={18} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteSize(size.id)} color="error">
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No sizes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle>{currentSize.id ? 'Edit Size' : 'Add Size'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Size Name"
              value={currentSize.name}
              onChange={(e) => setCurrentSize({ ...currentSize, name: e.target.value })}
              fullWidth
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddOrUpdateSize} variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
        </Container>
      </Box>
    </VendorLayout>
  );
};

export default VendorSizePage;

