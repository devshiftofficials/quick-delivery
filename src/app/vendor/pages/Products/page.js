'use client';
import React, { useState, useEffect } from 'react';
import VendorLayout from '../layout';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

// MUI Imports
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Container,
} from '@mui/material';
// Lucide Icons
import { Search, Trash2, Edit, Plus } from 'lucide-react';
import Image from 'next/image';

const VendorProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProducts();
  }, [router]);

  useEffect(() => {
    if (Array.isArray(products)) {
      setFilteredData(
        products.filter((item) =>
          item && Object.values(item).some((val) =>
            String(val || '').toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    } else {
      setFilteredData([]);
    }
    setPage(0);
  }, [filter, products]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products/vendor/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status && data.data) {
          setProducts(data.data || []);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch products');
          setProducts([]);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Database connection issue. Please try again.');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Unable to connect to database. Please check your connection.');
      setProducts([]);
    }
  };


  const handleAddProduct = () => {
    router.push('/vendor/pages/add-product');
  };

  const handleEditProduct = (product) => {
    router.push(`/vendor/pages/add-product?id=${product.id}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/vendor/update/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <VendorLayout>
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '100%' }}>
        <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 }, py: 3 }}>
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
            My Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleAddProduct}
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
            Add Product
          </Button>
        </Box>

        {error && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          placeholder="Search products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} style={{ color: '#6366f1' }} />
              </InputAdornment>
            ),
          }}
        />

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
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                paginatedData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.images && Array.isArray(product.images) && product.images[0] && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${product.images[0].url}`}
                          alt={product.name}
                          width={50}
                          height={50}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {product.vendor ? product.vendor.name : 'N/A'}
                    </TableCell>
                    <TableCell>Rs. {product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditProduct(product)} color="primary">
                        <Edit size={18} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteProduct(product.id)} color="error">
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
        </Container>
      </Box>
    </VendorLayout>
  );
};

export default VendorProductsPage;

