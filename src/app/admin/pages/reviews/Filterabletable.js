'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Chip,
  Fade,
  Grow,
  Tooltip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  Grid,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Star,
  MessageSquare,
  User,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  MessageCircle,
} from 'lucide-react';

const FilterableReviewTable = ({ reviews = [], fetchReviews, products = [] }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    status: '',
    rating: '',
    product: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newReview, setNewReview] = useState({
    id: null,
    reviewer: '',
    rating: 5,
    comment: '',
    productId: '',
    status: 'pending',
  });

  // Apply filters
  useEffect(() => {
    let filtered = Array.isArray(reviews) ? [...reviews] : [];

    // Text search filter
    if (filter) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter((item) => item.rating === parseInt(filters.rating));
    }

    // Product filter
    if (filters.product) {
      filtered = filtered.filter((item) => item.productId === parseInt(filters.product));
    }

    // Sort by newest first
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0);
      const dateB = new Date(b.createdAt || b.created_at || 0);
      return dateB - dateA;
    });

    setFilteredData(filtered);
    setPage(0);
  }, [filter, filters, reviews]);

  const handleOpen = (item = null) => {
    if (item) {
      setNewReview({
        id: item.id,
        reviewer: item.reviewer || '',
        rating: item.rating || 5,
        comment: item.comment || '',
        productId: item.productId?.toString() || '',
        status: item.status || 'pending',
      });
    } else {
      setNewReview({
        id: null,
        reviewer: '',
        rating: 5,
        comment: '',
        productId: '',
        status: 'pending',
      });
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setNewReview({
      id: null,
      reviewer: '',
      rating: 5,
      comment: '',
      productId: '',
      status: 'pending',
    });
  };

  const handleAddNewItem = async () => {
    if (!newReview.reviewer || !newReview.productId || !newReview.rating) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      const reviewToSubmit = {
        ...newReview,
        productId: parseInt(newReview.productId, 10),
        rating: parseInt(newReview.rating, 10),
      };

      const method = newReview.id ? 'PUT' : 'POST';
      const url = newReview.id ? `/api/reviews/${newReview.id}` : '/api/reviews';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewToSubmit),
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbar({
          open: true,
          message: newReview.id ? 'Review updated successfully!' : 'Review created successfully!',
          severity: 'success',
        });
        fetchReviews();
        handleClose();
      } else {
        throw new Error(result.message || 'Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Review deleted successfully!',
          severity: 'success',
        });
        fetchReviews();
      } else {
        throw new Error(result.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', rating: '', product: '' });
    setFilter('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle2 size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#10b981';
    if (rating >= 3) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', p: 3 }}>
      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
          }}
        >
          <CircularProgress size={60} sx={{ color: '#6366f1', mb: 2 }} />
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>
            Processing...
          </Typography>
        </Box>
      )}

      {/* Main Content */}
      <Fade in timeout={600}>
        <Box>
          {/* Header Card */}
          <Grow in timeout={400}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MessageSquare size={36} />
                      Reviews Management
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage product reviews and ratings
                    </Typography>
                  </Box>
                  <Tooltip title="Add New Review" arrow>
                    <IconButton
                      onClick={() => handleOpen(null)}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Plus size={20} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grow>

          {/* Search and Filter Bar */}
          <Grow in timeout={800}>
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  {/* Search Field */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search reviews by reviewer, comment, product..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={20} style={{ color: '#6366f1' }} />
                        </InputAdornment>
                      ),
                      endAdornment: filter && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setFilter('')}>
                            <X size={18} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flex: { xs: '1 1 100%', md: '1 1 auto' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  {(filters.status || filters.rating || filters.product || filter) && (
                    <Button
                      variant="outlined"
                      startIcon={<X size={18} />}
                      onClick={clearFilters}
                      sx={{ borderRadius: 2 }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Box>

                {/* Filters Row */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      label="Status"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Rating</InputLabel>
                    <Select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      label="Rating"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">All Ratings</MenuItem>
                      <MenuItem value="5">5 Stars</MenuItem>
                      <MenuItem value="4">4 Stars</MenuItem>
                      <MenuItem value="3">3 Stars</MenuItem>
                      <MenuItem value="2">2 Stars</MenuItem>
                      <MenuItem value="1">1 Star</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={filters.product}
                      onChange={(e) => handleFilterChange('product', e.target.value)}
                      label="Product"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">All Products</MenuItem>
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Active Filters Display */}
                {(filters.status || filters.rating || filters.product) && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 600 }}>
                      Active Filters:
                    </Typography>
                    {filters.status && (
                      <Chip
                        label={`Status: ${filters.status}`}
                        onDelete={() => handleFilterChange('status', '')}
                        color="primary"
                        size="small"
                      />
                    )}
                    {filters.rating && (
                      <Chip
                        label={`Rating: ${filters.rating} Stars`}
                        onDelete={() => handleFilterChange('rating', '')}
                        color="secondary"
                        size="small"
                      />
                    )}
                    {filters.product && (
                      <Chip
                        label={`Product: ${products.find(p => p.id === parseInt(filters.product))?.name || 'N/A'}`}
                        onDelete={() => handleFilterChange('product', '')}
                        color="info"
                        size="small"
                      />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grow>

          {/* Reviews Table Card */}
          <Grow in timeout={1000}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 0 }}>
                {/* Results Summary */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#FAFAFA',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366f1' }}>
                    Showing {paginatedData.length} of {filteredData.length} reviews
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== reviews.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {reviews.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

                {/* Reviews Table */}
                <TableContainer component={Box} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 1, maxHeight: '70vh', bgcolor: 'white' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          '& .MuiTableCell-head': {
                            fontWeight: 700,
                            color: '#1a202c',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            bgcolor: '#F9FAFB',
                            borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
                          },
                        }}
                      >
                        <TableCell>ID</TableCell>
                        <TableCell>Reviewer</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Comment</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <MessageSquare size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No reviews found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter || filters.status || filters.rating || filters.product
                                  ? 'Try adjusting your filters'
                                  : 'Add your first review to get started'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((item, index) => (
                          <Grow key={item.id} in timeout={(index % rowsPerPage) * 50}>
                            <TableRow
                              sx={{
                                transition: 'all 0.2s ease',
                                borderBottom: '1px solid rgba(0,0,0,0.06)',
                                '&:hover': {
                                  bgcolor: 'rgba(99, 102, 241, 0.05)',
                                  transform: 'scale(1.01)',
                                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                                },
                              }}
                            >
                              <TableCell sx={{ fontWeight: 600 }}>{item.id}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#6366f1' }}>
                                    <User size={18} />
                                  </Avatar>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {item.reviewer}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <ShoppingBag size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="body2">
                                    {item.product?.name || 'N/A'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Rating value={item.rating || 0} readOnly size="small" />
                                  <Chip
                                    label={item.rating}
                                    size="small"
                                    sx={{
                                      bgcolor: `${getRatingColor(item.rating)}20`,
                                      color: getRatingColor(item.rating),
                                      fontWeight: 700,
                                      minWidth: 40,
                                    }}
                                  />
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Tooltip title={item.comment || 'No comment'} arrow>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      maxWidth: 200,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      color: item.comment ? '#1a202c' : '#9ca3af',
                                    }}
                                  >
                                    {item.comment || 'No comment'}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={item.status || 'pending'}
                                  size="small"
                                  color={getStatusColor(item.status)}
                                  icon={getStatusIcon(item.status)}
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Calendar size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {item.createdAt
                                      ? new Date(item.createdAt).toLocaleDateString()
                                      : item.created_at
                                      ? new Date(item.created_at).toLocaleDateString()
                                      : '-'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Edit Review" arrow>
                                    <IconButton
                                      color="primary"
                                      onClick={() => handleOpen(item)}
                                      sx={{
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                                          transform: 'scale(1.1) rotate(5deg)',
                                        },
                                      }}
                                    >
                                      <Edit size={18} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Review" arrow>
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDeleteItem(item.id)}
                                      sx={{
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                                          transform: 'scale(1.1) rotate(-5deg)',
                                        },
                                      }}
                                    >
                                      <Trash2 size={18} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          </Grow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    '& .MuiTablePagination-toolbar': {
                      px: 2,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grow>

          {/* Add/Edit Review Dialog */}
          <Dialog
            open={isModalOpen}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            TransitionComponent={Fade}
            BackdropProps={{
              sx: {
                backdropFilter: 'blur(8px)',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              },
            }}
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MessageSquare size={28} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {newReview.id ? 'Edit Review' : 'Add New Review'}
                </Typography>
              </Box>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: 'white',
                  position: 'relative',
                  zIndex: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'rotate(90deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4, mt: 1, bgcolor: 'white' }}>
              <Grid container spacing={3}>
                {/* Reviewer Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Reviewer Name *"
                    value={newReview.reviewer}
                    onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={20} style={{ color: '#6366f1' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#6366f1',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Product Selection */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Product *</InputLabel>
                    <Select
                      value={newReview.productId}
                      onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })}
                      label="Product *"
                      startAdornment={
                        <InputAdornment position="start">
                          <ShoppingBag size={20} style={{ color: '#6366f1', marginLeft: '8px' }} />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                        },
                      }}
                    >
                      <MenuItem value="">Select Product</MenuItem>
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Rating */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F9FAFB',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6366f1', mb: 1 }}>
                      Rating *
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Rating
                        value={newReview.rating}
                        onChange={(event, newValue) => {
                          setNewReview({ ...newReview, rating: newValue || 5 });
                        }}
                        size="large"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: getRatingColor(newReview.rating),
                          },
                        }}
                      />
                      <Chip
                        label={`${newReview.rating} Star${newReview.rating !== 1 ? 's' : ''}`}
                        sx={{
                          bgcolor: `${getRatingColor(newReview.rating)}20`,
                          color: getRatingColor(newReview.rating),
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={newReview.status}
                      onChange={(e) => setNewReview({ ...newReview, status: e.target.value })}
                      label="Status"
                      sx={{
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                        },
                      }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Comment */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    variant="outlined"
                    multiline
                    rows={4}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', pt: 1 }}>
                          <MessageCircle size={20} style={{ color: '#6366f1' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#6366f1',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                borderTop: '1px solid rgba(0,0,0,0.05)',
                bgcolor: '#FAFAFA',
                display: 'flex',
                gap: 2,
              }}
            >
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: '#6b7280',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#4b5563',
                    bgcolor: 'rgba(107, 114, 128, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNewItem}
                variant="contained"
                disabled={isLoading || !newReview.reviewer || !newReview.productId || !newReview.rating}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: '#9ca3af',
                    color: 'white',
                  },
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    {newReview.id ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  newReview.id ? 'Update Review' : 'Create Review'
                )}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%', borderRadius: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Box>
  );
};

export default FilterableReviewTable;
