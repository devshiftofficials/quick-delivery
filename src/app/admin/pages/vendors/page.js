'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Fade,
  Grow,
  Tooltip,
  TablePagination,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Paper,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Store,
  Filter,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Image as ImageIcon,
  Building2,
  ToggleRight,
} from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '../../../util/imageUrl';

export default function VendorsAdminPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    logo: '',
    banner: '',
    status: 'active',
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendors');
      const json = await res.json();
      if (json.status) {
        const vendorsList = json.data || [];
        setVendors(vendorsList);
        setFilteredData(vendorsList);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = Array.isArray(vendors) ? [...vendors] : [];

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
        if (filters.status === 'active') return item.status === 'active';
        if (filters.status === 'inactive') return item.status !== 'active';
        return true;
      });
    }

    // Date range filter
    if (filters.dateRange) {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter((item) => {
        const date = new Date(item.createdAt || item.created_at || item.updatedAt || item.updated_at);
        return date >= cutoffDate;
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
  }, [filter, filters, vendors]);

  const handleOpen = (vendor) => {
    if (vendor) {
      setEditingVendorId(vendor.id);
      setForm({
        name: vendor.name || '',
        slug: vendor.slug || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
        description: vendor.description || '',
        logo: vendor.logo || '',
        banner: vendor.banner || '',
        status: vendor.status || 'active',
      });
    } else {
      setEditingVendorId(null);
      setForm({
        name: '',
        slug: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        logo: '',
        banner: '',
        status: 'active',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingVendorId(null);
    setForm({
      name: '',
      slug: '',
      email: '',
      phone: '',
      address: '',
      description: '',
      logo: '',
      banner: '',
      status: 'active',
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const method = editingVendorId ? 'PUT' : 'POST';
      const url = editingVendorId ? `/api/vendors/${editingVendorId}` : '/api/vendors';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.status) {
        setOpen(false);
        resetForm();
        await fetchVendors();
      }
    } catch (error) {
      console.error('Error saving vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vendor) => {
    if (!window.confirm(`Are you sure you want to delete vendor ${vendor.name}?`)) return;
    setLoading(true);
    try {
      await fetch(`/api/vendors/${vendor.id}`, { method: 'DELETE' });
      await fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', dateRange: '' });
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', p: 3 }}>
      {/* Loading Overlay */}
      {loading && (
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
                      <Store size={36} />
                      Vendors Management
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage and organize your vendor partners
                    </Typography>
                  </Box>
                  <Tooltip title="Add New Vendor" arrow>
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
                    placeholder="Search vendors by name, email, phone..."
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
                        bgcolor: isFiltersVisible ? '#6366f1' : 'transparent',
                        color: isFiltersVisible ? 'white' : '#6366f1',
                        border: '2px solid #6366f1',
                        '&:hover': {
                          bgcolor: '#6366f1',
                          color: 'white',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Filter size={20} />
                    </IconButton>
                  </Tooltip>

                  {/* Clear Filters Button */}
                  {(filter || filters.status || filters.dateRange) && (
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
                          <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={filters.status}
                              onChange={(e) => handleFilterChange('status', e.target.value)}
                              label="Status"
                              sx={{ borderRadius: 2 }}
                            >
                              <MenuItem value="">All Status</MenuItem>
                              <MenuItem value="active">Active</MenuItem>
                              <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                          </FormControl>
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
                      </Grid>

                      {/* Active Filters Display */}
                      {(filters.status || filters.dateRange) && (
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
                        </Box>
                      )}
                    </Box>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Grow>

          {/* Vendors Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} vendors
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== vendors.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {vendors.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

                {/* Vendors Table */}
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
                        <TableCell>Logo</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created At</TableCell>
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
                              <Store size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No vendors found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter || filters.status || filters.dateRange
                                  ? 'Try adjusting your filters'
                                  : 'Add your first vendor to get started'}
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
                                <Avatar
                                  src={item.logo ? getImageUrl(item.logo) : undefined}
                                  alt={item.name}
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    bgcolor: '#6366f1',
                                  }}
                                >
                                  <Building2 size={20} />
                                </Avatar>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {item.name}
                                </Typography>
                                {item.slug && (
                                  <Chip label={item.slug} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                                )}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Mail size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {item.email || '-'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Phone size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {item.phone || '-'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={item.status === 'active' ? 'Active' : 'Inactive'}
                                  size="small"
                                  color={item.status === 'active' ? 'success' : 'default'}
                                  icon={item.status === 'active' ? <CheckCircle2 size={16} /> : undefined}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Calendar size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {item.createdAt || item.created_at
                                      ? new Date(item.createdAt || item.created_at).toLocaleDateString()
                                      : item.updatedAt || item.updated_at
                                      ? new Date(item.updatedAt || item.updated_at).toLocaleDateString()
                                      : '-'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Edit Vendor" arrow>
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
                                  <Tooltip title="Delete Vendor" arrow>
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDelete(item)}
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

          {/* Add/Edit Vendor Dialog */}
          <Dialog
            open={open}
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
                  <Store size={28} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {editingVendorId ? 'Edit Vendor' : 'Add New Vendor'}
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
                {/* Basic Information Section */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F9FAFB',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6366f1', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Building2 size={20} />
                      Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Vendor Name *"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Building2 size={20} style={{ color: '#6366f1' }} />
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
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Slug *"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/\s+/g, '-') })}
                          variant="outlined"
                          helperText="URL-friendly identifier"
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
                  </Box>
                </Grid>

                {/* Contact Information Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F9FAFB',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6366f1', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Mail size={20} />
                      Contact Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Mail size={20} style={{ color: '#6366f1' }} />
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
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone size={20} style={{ color: '#6366f1' }} />
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
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MapPin size={20} style={{ color: '#6366f1' }} />
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
                  </Box>
                </Grid>

                {/* Additional Information Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F9FAFB',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6366f1', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileText size={20} />
                      Additional Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          variant="outlined"
                          multiline
                          rows={3}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', pt: 1 }}>
                                <FileText size={20} style={{ color: '#6366f1' }} />
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
                  </Box>
                </Grid>

                {/* Media Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F9FAFB',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6366f1', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ImageIcon size={20} />
                      Media & Status
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Logo URL"
                          value={form.logo}
                          onChange={(e) => setForm({ ...form, logo: e.target.value })}
                          variant="outlined"
                          placeholder="https://example.com/logo.png"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: '#6366f1',
                              },
                            },
                          }}
                        />
                        {form.logo && (
                          <Box sx={{ mt: 2 }}>
                            <Avatar
                              src={getImageUrl(form.logo)}
                              alt="Logo Preview"
                              sx={{ width: 80, height: 80 }}
                            >
                              <Building2 size={20} />
                            </Avatar>
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Banner URL"
                          value={form.banner}
                          onChange={(e) => setForm({ ...form, banner: e.target.value })}
                          variant="outlined"
                          placeholder="https://example.com/banner.png"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: '#6366f1',
                              },
                            },
                          }}
                        />
                        {form.banner && (
                          <Box sx={{ mt: 2 }}>
                            <Box
                              sx={{
                                width: '100%',
                                height: 80,
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                position: 'relative',
                              }}
                            >
                              <Image
                                src={getImageUrl(form.banner)}
                                alt="Banner Preview"
                                width={400}
                                height={80}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={form.status === 'active'}
                              onChange={(e) =>
                                setForm({ ...form, status: e.target.checked ? 'active' : 'inactive' })
                              }
                              color="primary"
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ToggleRight size={24} style={{ color: form.status === 'active' ? '#10b981' : '#9ca3af' }} />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {form.status === 'active' ? 'Active' : 'Inactive'}
                              </Typography>
                            </Box>
                          }
                          sx={{
                            width: '100%',
                            justifyContent: 'space-between',
                            m: 0,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: form.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: form.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
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
                onClick={handleSave}
                variant="contained"
                disabled={!form.name || !form.slug}
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
                {editingVendorId ? 'Update Vendor' : 'Create Vendor'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Box>
  );
}
