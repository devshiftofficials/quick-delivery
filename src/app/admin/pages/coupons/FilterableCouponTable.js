'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Fade,
  Grow,
  Tooltip,
  TablePagination,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Ticket,
  Filter,
  Calendar,
  CheckCircle2,
  Percent,
  Code,
  Calendar as EventIcon,
  ToggleRight,
  Tag,
} from 'lucide-react';

const FilterableCouponTable = ({ coupons = [], fetchCoupons }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    expiration: '',
    isActive: true,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    discountRange: '',
  });

  useEffect(() => {
    if (Array.isArray(coupons)) {
      setOriginalData(coupons);
      setFilteredData(coupons);
    }
  }, [coupons]);

  // Apply filters
  useEffect(() => {
    let filtered = Array.isArray(originalData) ? [...originalData] : [];

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
      filtered = filtered.filter((item) => {
        if (filters.status === 'active') return item.isActive === true;
        if (filters.status === 'inactive') return item.isActive === false;
        return true;
      });
    }

    // Date range filter
    if (filters.dateRange) {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter((item) => {
        if (!item.expiration) return false;
        return new Date(item.expiration) >= cutoffDate;
      });
    }

    // Discount range filter
    if (filters.discountRange) {
      const [min, max] = filters.discountRange.split('-').map(Number);
      filtered = filtered.filter((item) => {
        const discount = item.discount || 0;
        return discount >= min && discount <= max;
      });
    }

    // Sort by newest first
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || a.updatedAt || a.updated_at || 0);
      const dateB = new Date(b.createdAt || b.created_at || b.updatedAt || b.updated_at || 0);
      return dateB - dateA;
    });

    setFilteredData(filtered);
    setPage(0);
  }, [filter, filters, originalData]);

  const handleAddNewItem = async () => {
    setIsLoading(true);
    setIsModalOpen(false);
    try {
      const couponToSubmit = {
        ...newCoupon,
        expiration: newCoupon.expiration ? new Date(newCoupon.expiration).toISOString() : null,
      };

      const url = editingCouponId ? `/api/coupons/${editingCouponId}` : '/api/coupons';
      const method = editingCouponId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(couponToSubmit),
          });

      if (!response.ok) {
        throw new Error('Failed to create or update coupon');
      }

      await response.json();
      fetchCoupons();
      resetForm();
    } catch (error) {
      console.error('Error adding or updating coupon:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
      fetchCoupons();
      } else {
        console.error('Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setNewCoupon({
      code: item.code || '',
      discount: item.discount || 0,
      expiration: item.expiration ? new Date(item.expiration).toISOString().slice(0, 10) : '',
      isActive: item.isActive !== undefined ? item.isActive : true,
    });
    setEditingCouponId(item.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewCoupon({
      code: '',
      discount: 0,
      expiration: '',
      isActive: true,
    });
    setEditingCouponId(null);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', dateRange: '', discountRange: '' });
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

  // Check if coupon is expired
  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        p: 3,
      }}
    >
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
                      <Ticket size={36} />
                      Coupons Management
          </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage discount coupons and promotional codes
                    </Typography>
                  </Box>
                  <Tooltip title="Add New Coupon" arrow>
            <IconButton
              onClick={() => {
                        resetForm();
                setIsModalOpen(true);
              }}
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
                    placeholder="Search coupons by code, discount..."
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

                  {/* Filter Toggle Button */}
                  <Tooltip title="Toggle Filters" arrow>
                    <IconButton
                      onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                      sx={{
                        bgcolor: isFiltersVisible ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                        color: isFiltersVisible ? 'white' : '#6366f1',
                        border: '2px solid #6366f1',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: 'white',
                          transform: 'scale(1.1)',
                          border: '2px solid transparent',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Filter size={20} />
                    </IconButton>
                  </Tooltip>

                  {/* Clear Filters Button */}
                  {(filter || filters.status || filters.dateRange || filters.discountRange) && (
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

                {/* Filters Panel */}
                {isFiltersVisible && (
                  <Fade in={isFiltersVisible}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#F9FAFB',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                      }}
                    >
                      <Grid container spacing={2}>
                        {/* Status Filter */}
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            select
                            label="Status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            SelectProps={{
                              native: true,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </TextField>
                        </Grid>

                        {/* Date Range Filter */}
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            select
                            label="Date Range"
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            SelectProps={{
                              native: true,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          >
                            <option value="">All Time</option>
                            <option value="1">Last 24 Hours</option>
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                          </TextField>
                        </Grid>

                        {/* Discount Range Filter */}
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            select
                            label="Discount Range"
                            value={filters.discountRange}
                            onChange={(e) => handleFilterChange('discountRange', e.target.value)}
                            SelectProps={{
                              native: true,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          >
                            <option value="">All Discounts</option>
                            <option value="0-10">0% - 10%</option>
                            <option value="11-25">11% - 25%</option>
                            <option value="26-50">26% - 50%</option>
                            <option value="51-100">51% - 100%</option>
                          </TextField>
                        </Grid>
                      </Grid>

                      {/* Active Filters Display */}
                      {(filters.status || filters.dateRange || filters.discountRange) && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 600 }}>
                            Active Filters:
                          </Typography>
                          {filters.status && (
                            <Chip
                              label={`Status: ${filters.status === 'active' ? 'Active' : 'Inactive'}`}
                              onDelete={() => handleFilterChange('status', '')}
                              color="primary"
                              size="small"
                            />
                          )}
                          {filters.dateRange && (
                            <Chip
                              label={`Last ${filters.dateRange} ${filters.dateRange === '1' ? 'Day' : 'Days'}`}
                              onDelete={() => handleFilterChange('dateRange', '')}
                              color="secondary"
                              size="small"
                            />
                          )}
                          {filters.discountRange && (
                            <Chip
                              label={`Discount: ${filters.discountRange}%`}
                              onDelete={() => handleFilterChange('discountRange', '')}
                              color="primary"
                              size="small"
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Grow>

          {/* Coupons Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} coupons
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== originalData.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {originalData.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

                {/* Coupons Table */}
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
                        <TableCell>Code</TableCell>
                        <TableCell>Discount</TableCell>
                        <TableCell>Expiration</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                      {paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Ticket size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No coupons found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter || filters.status || filters.dateRange || filters.discountRange
                                  ? 'Try adjusting your filters'
                                  : 'Add your first coupon to get started'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((item, index) => {
                          const expired = isExpired(item.expiration);
                          return (
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
                                  <Chip
                                    label={item.code}
                                    icon={<Code size={18} />}
                                    sx={{
                                      fontWeight: 700,
                                      fontFamily: 'monospace',
                                      fontSize: '0.875rem',
                                      bgcolor: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                      color: '#6366f1',
                                      border: '1px solid rgba(99, 102, 241, 0.2)',
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Percent size={18} style={{ color: '#10b981' }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                                      {item.discount}%
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Calendar size={16} style={{ color: '#9ca3af' }} />
                                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                      {item.expiration
                                        ? new Date(item.expiration).toLocaleDateString()
                                        : 'No expiration'}
                                    </Typography>
                                    {expired && (
                                      <Chip
                                        label="Expired"
                                        size="small"
                                        color="error"
                                        sx={{ ml: 1 }}
                                      />
                                    )}
                                  </Box>
                    </TableCell>
                    <TableCell>
                                  <Chip
                                    label={item.isActive ? 'Active' : 'Inactive'}
                                    size="small"
                                    color={item.isActive ? 'success' : 'default'}
                                    icon={item.isActive ? <CheckCircle2 size={16} /> : undefined}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                    <Tooltip title="Edit Coupon" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditItem(item)}
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
                                    <Tooltip title="Delete Coupon" arrow>
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
                          );
                        })
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

      {/* Add/Edit Coupon Dialog */}
          <Dialog
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              resetForm();
            }}
            maxWidth="sm"
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
                  <Ticket size={28} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {editingCouponId ? 'Edit Coupon' : 'Add New Coupon'}
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
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
            <DialogContent sx={{ p: 4, mt: 1 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#F9FAFB',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6366f1', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={20} />
                  Coupon Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
            <TextField
              fullWidth
                      label="Coupon Code *"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              variant="outlined"
                      placeholder="SAVE20, WELCOME10, etc."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Code size={20} style={{ color: '#6366f1' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontFamily: 'monospace',
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                        },
                      }}
            />
                  </Grid>

                  <Grid item xs={12}>
            <TextField
                      fullWidth
                      label="Discount Percentage *"
              type="number"
                      value={newCoupon.discount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseFloat(e.target.value) || 0 })}
              variant="outlined"
                      placeholder="0"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Percent size={20} style={{ color: '#10b981' }} />
                          </InputAdornment>
                        ),
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        inputProps: { min: 0, max: 100, step: 0.01 },
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

                  <Grid item xs={12}>
            <TextField
                      fullWidth
              label="Expiration Date"
              type="date"
              value={newCoupon.expiration}
              onChange={(e) => setNewCoupon({ ...newCoupon, expiration: e.target.value })}
                      variant="outlined"
              InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon size={20} style={{ color: '#6366f1' }} />
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
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#6b7280' }}>
                      Leave empty for no expiration date
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <FormControlLabel
                      control={
                        <Switch
                checked={newCoupon.isActive}
                onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.checked })}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ToggleRight size={24} style={{ color: newCoupon.isActive ? '#10b981' : '#9ca3af' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {newCoupon.isActive ? 'Active' : 'Inactive'}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        width: '100%',
                        justifyContent: 'space-between',
                        m: 0,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: newCoupon.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: newCoupon.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Preview Card */}
              {newCoupon.code && (
                <Grow in timeout={300}>
                  <Card
                    sx={{
                      mt: 3,
                      background: newCoupon.isActive
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(107, 114, 128, 0.1) 100%)',
                      border: `2px solid ${newCoupon.isActive ? '#6366f1' : '#9ca3af'}`,
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#6366f1' }}>
                      Preview
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Chip
                          label={newCoupon.code}
                          icon={<Code size={18} />}
                          sx={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            fontSize: '1rem',
                            bgcolor: 'white',
                            color: '#6366f1',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            mb: 1,
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Percent size={18} style={{ color: '#10b981' }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                            {newCoupon.discount}% OFF
                          </Typography>
            </Box>
          </Box>
                      <Chip
                        label={newCoupon.isActive ? 'Active' : 'Inactive'}
                        color={newCoupon.isActive ? 'success' : 'default'}
                        icon={newCoupon.isActive ? <CheckCircle2 size={16} /> : undefined}
                      />
                    </Box>
                  </Card>
                </Grow>
              )}
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
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
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
                disabled={!newCoupon.code || !newCoupon.discount}
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
                {editingCouponId ? 'Update Coupon' : 'Create Coupon'}
          </Button>
        </DialogActions>
      </Dialog>
        </Box>
      </Fade>
    </Box>
  );
};

export default FilterableCouponTable;
