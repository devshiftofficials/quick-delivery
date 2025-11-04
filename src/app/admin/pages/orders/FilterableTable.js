'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// MUI Imports
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
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
  Button,
  TablePagination,
  Chip,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Fade,
  Grow,
  Collapse,
  Tooltip,
  Grid,
  CircularProgress,
  Divider,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Plus,
  Filter,
  X,
  Eye,
  TrendingUp,
} from 'lucide-react';
import BeautifulLoader from '../../../components/BeautifulLoader';

const FilterableTable = ({ data = [], fetchData }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [newItem, setNewItem] = useState({
    id: null,
    userId: '',
    total: '',
    status: '',
    orderItems: [],
    image: null,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    minTotal: '',
    maxTotal: '',
    dateRange: '',
  });

  const router = useRouter();

  // Apply filters
  useEffect(() => {
    let filtered = Array.isArray(data) ? [...data] : [];

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

    // Payment method filter
    if (filters.paymentMethod) {
      filtered = filtered.filter((item) => item.paymentMethod === filters.paymentMethod);
    }

    // Total range filter
    if (filters.minTotal) {
      filtered = filtered.filter((item) => parseFloat(item.total) >= parseFloat(filters.minTotal));
    }
    if (filters.maxTotal) {
      filtered = filtered.filter((item) => parseFloat(item.total) <= parseFloat(filters.maxTotal));
    }

    // Date range filter (basic - can be enhanced)
    if (filters.dateRange) {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter((item) => new Date(item.createdAt) >= cutoffDate);
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));

    setFilteredData(filtered);
    setPage(0);
  }, [filter, data, filters]);

  const handleRowClick = (id) => {
    router.push(`/admin/pages/orders/${id}`);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      paymentMethod: '',
      minTotal: '',
      maxTotal: '',
      dateRange: '',
    });
    setFilter('');
  };

  const handleAddNewItem = async () => {
    setIsFetching(true);
    const formData = new FormData();
    formData.append('userId', newItem.userId);
    formData.append('total', newItem.total);
    formData.append('status', newItem.status);
    newItem.orderItems.forEach((item, index) => {
      formData.append(`orderItems[${index}][productId]`, item.productId);
      formData.append(`orderItems[${index}][quantity]`, item.quantity);
      formData.append(`orderItems[${index}][price]`, item.price);
    });
    if (newItem.image) {
      formData.append('image', newItem.image);
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      await fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding new item:', error);
    }
    setIsFetching(false);
  };

  const handleDeleteItem = async (id) => {
    setIsFetching(true);
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setIsFetching(false);
  };

  const handleEditItem = (item) => {
    setNewItem(item);
    setIsModalOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Get unique payment methods
  const paymentMethods = [...new Set(data.map((item) => item.paymentMethod).filter(Boolean))];
  const statuses = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'];

  // Calculate statistics
  const totalOrders = filteredData.length;
  const totalRevenue = filteredData.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
  const pendingOrders = filteredData.filter((order) => order.status === 'PENDING').length;
  const completedOrders = filteredData.filter((order) => order.status === 'COMPLETED').length;

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      PAID: 'info',
      SHIPPED: 'primary',
      COMPLETED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
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
      {isFetching && <BeautifulLoader message="Processing..." />}

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
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                      Orders Management
          </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage and track all customer orders
                    </Typography>
          </Box>
                  <TrendingUp size={48} style={{ opacity: 0.3 }} />
        </Box>
              </CardContent>
            </Card>
          </Grow>

          {/* Statistics Cards */}
          <Grow in timeout={600}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {totalOrders}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      Rs. {totalRevenue.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(245, 158, 11, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Pending Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {pendingOrders}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Completed Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {completedOrders}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
                    placeholder="Search orders by ID, customer name, total..."
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
                  {(filters.status ||
                    filters.paymentMethod ||
                    filters.minTotal ||
                    filters.maxTotal ||
                    filters.dateRange) && (
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
                <Collapse in={isFiltersVisible}>
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
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            label="Status"
                          >
                            <MenuItem value="">All Statuses</MenuItem>
                            {statuses.map((status) => (
                              <MenuItem key={status} value={status}>
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Payment Method Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Payment Method</InputLabel>
                          <Select
                            value={filters.paymentMethod}
                            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                            label="Payment Method"
                          >
                            <MenuItem value="">All Methods</MenuItem>
                            {paymentMethods.map((method) => (
                              <MenuItem key={method} value={method}>
                                {method}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Total Range */}
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Min Total"
                          type="number"
                          value={filters.minTotal}
                          onChange={(e) => handleFilterChange('minTotal', e.target.value)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Max Total"
                          type="number"
                          value={filters.maxTotal}
                          onChange={(e) => handleFilterChange('maxTotal', e.target.value)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                          }}
                        />
                      </Grid>

                      {/* Date Range Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Date Range</InputLabel>
                          <Select
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            label="Date Range"
                          >
                            <MenuItem value="">All Time</MenuItem>
                            <MenuItem value="1">Last 24 Hours</MenuItem>
                            <MenuItem value="7">Last 7 Days</MenuItem>
                            <MenuItem value="30">Last 30 Days</MenuItem>
                            <MenuItem value="90">Last 90 Days</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Active Filters Display */}
                    {(filters.status ||
                      filters.paymentMethod ||
                      filters.minTotal ||
                      filters.maxTotal ||
                      filters.dateRange) && (
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
                        {filters.paymentMethod && (
                          <Chip
                            label={`Payment: ${filters.paymentMethod}`}
                            onDelete={() => handleFilterChange('paymentMethod', '')}
                            color="secondary"
                            size="small"
                          />
                        )}
                        {filters.minTotal && (
                          <Chip
                            label={`Min: Rs. ${filters.minTotal}`}
                            onDelete={() => handleFilterChange('minTotal', '')}
                            color="info"
                            size="small"
                          />
                        )}
                        {filters.maxTotal && (
                          <Chip
                            label={`Max: Rs. ${filters.maxTotal}`}
                            onDelete={() => handleFilterChange('maxTotal', '')}
                            color="info"
                            size="small"
                          />
                        )}
                        {filters.dateRange && (
                          <Chip
                            label={`Last ${filters.dateRange} ${filters.dateRange === '1' ? 'Day' : 'Days'}`}
                            onDelete={() => handleFilterChange('dateRange', '')}
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Grow>

          {/* Orders Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} orders
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== data.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {data.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

                {/* Orders Table */}
                <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 1, maxHeight: '70vh', bgcolor: 'white' }}>
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
                        <TableCell>Customer</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                      {paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No orders found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter || Object.values(filters).some((f) => f !== '' && f !== null)
                                  ? 'Try adjusting your filters'
                                  : 'No orders available'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                paginatedData.map((item, index) => (
                          <Grow
                            key={item.id}
                            in
                            timeout={(index % rowsPerPage) * 50}
                          >
                  <TableRow
                              sx={{
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                borderBottom: '1px solid rgba(0,0,0,0.06)',
                                '&:hover': {
                                  bgcolor: 'rgba(99, 102, 241, 0.05)',
                                  transform: 'scale(1.01)',
                                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                                },
                              }}
                    onClick={() => handleRowClick(item.id)}
                  >
                              <TableCell sx={{ fontWeight: 600 }}>{item.id}</TableCell>
                    <TableCell>
                      {item.user ? (
                        <>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.user.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                      ID: {item.userId}
                                    </Typography>
                        </>
                      ) : (
                        'No User Associated'
                      )}
                    </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                                  Rs. {parseFloat(item.total || 0).toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={item.status}
                                  color={getStatusColor(item.status)}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={item.paymentMethod || 'N/A'}
                                  variant="outlined"
                                  size="small"
                                />
                              </TableCell>
                    <TableCell>
                                <Typography variant="body2">
                                  {new Date(item.createdAt || item.updatedAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                  {new Date(item.createdAt || item.updatedAt).toLocaleTimeString()}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="View Details" arrow>
                                  <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(item.id);
                        }}
                                    sx={{
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                                        transform: 'scale(1.1) rotate(5deg)',
                                      },
                                    }}
                                  >
                                    <Eye size={18} />
                                  </IconButton>
                                </Tooltip>
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
              </Box>
      </Fade>
    </Box>
  );
};

export default FilterableTable;
