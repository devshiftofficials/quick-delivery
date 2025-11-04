'use client';
import React, { useState, useRef, useEffect } from 'react';
// Lucide Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  User,
  Shield,
  X,
  Lock,
  Filter,
  X as ClearIcon,
} from 'lucide-react';

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
  CircularProgress,
  Select as MuiSelect,
  MenuItem,
  TablePagination,
  Fade,
  Grow,
  Slide,
  Chip,
  Avatar,
  Tooltip,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Collapse,
} from '@mui/material';
import BeautifulLoader from '../../../components/BeautifulLoader';

const FilterableCustomerTable = ({ customers, fetchCustomers }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(customers || []);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    city: '',
    minDate: '',
    maxDate: '',
  });
  const [newCustomer, setNewCustomer] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    phoneno: '',
    city: '',
    image: null,
    imageUrl: '',
    role: 'CUSTOMER',
  });
  const [isAdminForm, setIsAdminForm] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Get unique cities from customers
  const cities = React.useMemo(() => {
    const citySet = new Set();
    customers?.forEach((customer) => {
      if (customer.city) {
        citySet.add(customer.city);
      }
    });
    return Array.from(citySet).sort();
  }, [customers]);

  // Filter customers based on search and filters
  useEffect(() => {
    let filtered = customers || [];

    // Text search filter
    if (filter) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter((item) => item.role?.toUpperCase() === filters.role.toUpperCase());
    }

    // Status filter
    if (filters.status !== '') {
      const statusValue = filters.status === 'active' ? 1 : 0;
      filtered = filtered.filter((item) => {
        const itemStatus = item.status === 1 || item.status === '1' || item.status === true ? 1 : 0;
        return itemStatus === statusValue;
      });
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter((item) => item.city === filters.city);
    }

    // Date range filter
    if (filters.minDate) {
      filtered = filtered.filter((item) => {
        if (!item.createdAt) return false;
        const itemDate = new Date(item.createdAt);
        const minDate = new Date(filters.minDate);
        return itemDate >= minDate;
      });
    }
    if (filters.maxDate) {
      filtered = filtered.filter((item) => {
        if (!item.createdAt) return false;
        const itemDate = new Date(item.createdAt);
        const maxDate = new Date(filters.maxDate);
        maxDate.setHours(23, 59, 59, 999); // Include the entire day
        return itemDate <= maxDate;
      });
    }

    setFilteredData(filtered);
    setPage(0);
  }, [filter, customers, filters]);

  const handleAddNewItem = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.password || !newCustomer.phoneno || !newCustomer.city) {
      alert('All fields are required');
      return;
    }
    setIsLoading(true);
    try {
      let imageUrl = '';
      if (images.length > 0) {
        const imageBase64 = await convertToBase64(images[0]);
        const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageBase64 }),
        });
        const result = await response.json();
        if (response.ok) {
          imageUrl = result.image_url;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      }

      const customerToSubmit = { ...newCustomer, imageUrl };
      const endpoint = isAdminForm ? '/api/users/admin-user' : '/api/users';

      const response = newCustomer.id
        ? await fetch(`/api/users/${newCustomer.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerToSubmit),
          })
        : await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerToSubmit),
          });

      if (response.ok) {
        fetchCustomers();
        setIsModalOpen(false);
        setNewCustomer({
          id: null,
          name: '',
          email: '',
          password: '',
          phoneno: '',
          city: '',
          image: null,
          imageUrl: '',
          role: 'CUSTOMER',
        });
        setImages([]);
        setShowPassword(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to create/update customer:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding/updating customer:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        fetchCustomers();
      } else {
        console.error('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
    setIsLoading(false);
  };

  const handleEditItem = async (item) => {
    setIsLoading(true);
    try {
      setNewCustomer(item);
      setIsAdminForm(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (id, action) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        fetchCustomers();
      } else {
        const errorData = await response.json();
        console.error('Failed to update customer status:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
    setIsLoading(false);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImages([file]);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      status: '',
      city: '',
      minDate: '',
      maxDate: '',
    });
    setFilter('');
  };

  // Paginated data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate statistics
  const totalCustomers = customers?.length || 0;
  const activeCustomers = customers?.filter(c => (c.status === 1 || c.status === '1' || c.status === true))?.length || 0;
  const inactiveCustomers = customers?.filter(c => !(c.status === 1 || c.status === '1' || c.status === true))?.length || 0;
  const adminUsers = customers?.filter(c => c.role?.toUpperCase() === 'ADMIN')?.length || 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        p: 3,
      }}
    >
      {/* Loading Overlay */}
      {isLoading && <BeautifulLoader message="Loading..." />}

      {/* Main Content */}
      <Fade in timeout={800}>
        <Box>
          {/* Header Card */}
          <Grow in timeout={600}>
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
                      Customers Management
          </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage and filter your customer database
                    </Typography>
                  </Box>
                  <Tooltip title="Add New Admin" arrow>
            <IconButton
              onClick={() => {
                setNewCustomer({
                  id: null,
                  name: '',
                  email: '',
                  password: '',
                  phoneno: '',
                  city: '',
                  image: null,
                  imageUrl: '',
                  role: 'CUSTOMER',
                });
                setIsAdminForm(true);
                setImages([]);
                setIsModalOpen(true);
              }}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
            >
                      <UserPlus size={20} />
            </IconButton>
                  </Tooltip>
          </Box>
              </CardContent>
            </Card>
          </Grow>

          {/* Statistics Cards */}
          <Fade in timeout={800}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Grow in timeout={600}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                          {totalCustomers}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Total Customers
                        </Typography>
        </Box>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          width: 56,
                          height: 56,
                        }}
                      >
                        <Users size={32} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Grow in timeout={800}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(17, 153, 142, 0.3)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(17, 153, 142, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                          {activeCustomers}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Active Customers
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          width: 56,
                          height: 56,
                        }}
                      >
                        <CheckCircle2 size={32} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Grow in timeout={1000}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(250, 112, 154, 0.3)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(250, 112, 154, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                          {inactiveCustomers}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Inactive Customers
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          width: 56,
                          height: 56,
                        }}
                      >
                        <XCircle size={32} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Grow in timeout={1200}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(48, 207, 208, 0.3)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(48, 207, 208, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                          {adminUsers}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Admin Users
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          width: 56,
                          height: 56,
                        }}
                      >
                        <Shield size={32} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Fade>

          {/* Search and Filter Bar */}
          <Grow in timeout={800}>
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  {/* Search Field */}
          <TextField
            fullWidth
            variant="outlined"
                    placeholder="Search customers by name, email, phone, city..."
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
                  {(filters.role ||
                    filters.status !== '' ||
                    filters.city ||
                    filters.minDate ||
                    filters.maxDate) && (
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
                      {/* Role Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Role</InputLabel>
                          <MuiSelect
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                            label="Role"
                          >
                            <MenuItem value="">All Roles</MenuItem>
                            <MenuItem value="CUSTOMER">Customer</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </Grid>

                      {/* Status Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <MuiSelect
                            value={filters.status === '' ? '' : filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            label="Status"
                          >
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </Grid>

                      {/* City Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>City</InputLabel>
                          <MuiSelect
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                            label="City"
                          >
                            <MenuItem value="">All Cities</MenuItem>
                            {cities.map((city) => (
                              <MenuItem key={city} value={city}>
                                {city}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </Grid>

                      {/* Date Range */}
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="From Date"
                          type="date"
                          value={filters.minDate}
                          onChange={(e) => handleFilterChange('minDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="To Date"
                          type="date"
                          value={filters.maxDate}
                          onChange={(e) => handleFilterChange('maxDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>

                    {/* Active Filters Display */}
                    {(filters.role ||
                      filters.status !== '' ||
                      filters.city ||
                      filters.minDate ||
                      filters.maxDate) && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 600 }}>
                          Active Filters:
                        </Typography>
                        {filters.role && (
                          <Chip
                            label={`Role: ${filters.role}`}
                            onDelete={() => handleFilterChange('role', '')}
                            color="primary"
                            size="small"
                          />
                        )}
                        {filters.status !== '' && (
                          <Chip
                            label={`Status: ${filters.status === 'active' ? 'Active' : 'Inactive'}`}
                            onDelete={() => handleFilterChange('status', '')}
                            color="success"
                            size="small"
                          />
                        )}
                        {filters.city && (
                          <Chip
                            label={`City: ${filters.city}`}
                            onDelete={() => handleFilterChange('city', '')}
                            color="secondary"
                            size="small"
                          />
                        )}
                        {filters.minDate && (
                          <Chip
                            label={`From: ${new Date(filters.minDate).toLocaleDateString()}`}
                            onDelete={() => handleFilterChange('minDate', '')}
                            color="default"
                            size="small"
                          />
                        )}
                        {filters.maxDate && (
                          <Chip
                            label={`To: ${new Date(filters.maxDate).toLocaleDateString()}`}
                            onDelete={() => handleFilterChange('maxDate', '')}
                            color="default"
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

          {/* Customers Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} customers
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== customers?.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {customers?.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

        {/* Table */}
                <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 1, bgcolor: 'white' }}>
          <Table stickyHeader>
            <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                          '& .MuiTableCell-head': {
                            fontWeight: 700,
                            color: '#1a202c',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
                          },
                        }}
                      >
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone No</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Updated At</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                      {paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Users size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No customers found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter || Object.values(filters).some((f) => f !== '' && f !== null)
                                  ? 'Try adjusting your filters'
                                  : 'Add your first customer to get started'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((item, index) => (
                          <Grow
                            key={item.id || index}
                            in
                            timeout={(index % rowsPerPage) * 50}
                          >
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
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      bgcolor: '#6366f1',
                                      fontSize: '0.875rem',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item.name?.charAt(0)?.toUpperCase() || 'N'}
                                  </Avatar>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {item.name || 'N/A'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{item.email || 'N/A'}</Typography>
                              </TableCell>
                              <TableCell>{item.phoneno || 'N/A'}</TableCell>
                              <TableCell sx={{ maxWidth: 150, wordBreak: 'break-word' }}>
                                {item.city || 'N/A'}
                              </TableCell>
                              <TableCell>
                                {item.role?.toUpperCase() === 'ADMIN' ? (
                                  <Chip
                                    label="Admin"
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                ) : item.role?.toUpperCase() === 'VENDOR' ? (
                                  <Chip
                                    label="Vendor"
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                  />
                                ) : (
                                  <Chip label="Customer" size="small" color="primary" variant="outlined" />
                                )}
                              </TableCell>
                              <TableCell>
                                {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A'}
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={(item.status === 1 || item.status === '1' || item.status === true) ? 'Active' : 'Inactive'}
                                  size="small"
                                  color={(item.status === 1 || item.status === '1' || item.status === true) ? 'success' : 'error'}
                                  variant={(item.status === 1 || item.status === '1' || item.status === true) ? 'filled' : 'outlined'}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Edit Customer" arrow>
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
                                  <Tooltip title="Delete Customer" arrow>
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
                                  <Tooltip title={(item.status === 1 || item.status === '1' || item.status === true) ? 'Deactivate' : 'Activate'} arrow>
                                    <IconButton
                                      onClick={() => handleStatusChange(item.id, (item.status === 1 || item.status === '1' || item.status === true) ? 'deactivate' : 'activate')}
                                      sx={{
                                        color: (item.status === 1 || item.status === '1' || item.status === true) ? '#f57c00' : '#2e7d32',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          bgcolor: (item.status === 1 || item.status === '1' || item.status === true) ? 'rgba(245, 124, 0, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                                          transform: 'scale(1.1)',
                                        },
                                      }}
                                    >
                                      {(item.status === 1 || item.status === '1' || item.status === true) ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
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
        </Box>
      </Fade>

      {/* Enhanced Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setShowPassword(false);
        }} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 40,
                height: 40,
              }}
            >
              {newCustomer.id ? <Edit size={20} /> : <UserPlus size={20} />}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {newCustomer.id ? 'Edit Customer' : 'Add New Admin'}
            </Typography>
          </Box>
          <IconButton
            onClick={() => {
              setIsModalOpen(false);
              setShowPassword(false);
            }}
            sx={{
              color: 'white',
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
        <DialogContent sx={{ p: 3, bgcolor: '#f8f9fa' }}>
          <TextField
            fullWidth
            label="Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                },
              },
            }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={20} style={{ color: '#6366f1' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                },
              },
            }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={20} style={{ color: '#6366f1' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={newCustomer.password}
            onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                },
              },
            }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} style={{ color: '#6366f1' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#6366f1' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Phone No"
            value={newCustomer.phoneno}
            onChange={(e) => setNewCustomer({ ...newCustomer, phoneno: e.target.value })}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                },
              },
            }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone size={20} style={{ color: '#6366f1' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="City"
            value={newCustomer.city}
            onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                },
              },
            }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MapPin size={20} style={{ color: '#6366f1' }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              component="label"
              variant="outlined"
            fullWidth
              startIcon={<ImageIcon size={18} />}
              sx={{
                py: 1.5,
                borderColor: '#6366f1',
                color: '#6366f1',
                '&:hover': {
                  borderColor: '#8b5cf6',
                  bgcolor: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              {images.length > 0 ? 'Change Image' : 'Upload Image'}
              <input
            type="file"
                hidden
                accept="image/*"
            onChange={handleImageChange}
          />
            </Button>
          </Box>
          {!isAdminForm && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <MuiSelect
              value={newCustomer.role}
              onChange={(e) => setNewCustomer({ ...newCustomer, role: e.target.value })}
                  label="Role"
                  sx={{ 
                    bgcolor: 'white',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                    },
                  }}
            >
                  <MenuItem value="CUSTOMER">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={16} />
                      Customer
                    </Box>
                  </MenuItem>
                  <MenuItem value="ADMIN">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Shield size={16} />
                      Admin
                    </Box>
                  </MenuItem>
                </MuiSelect>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'flex-end', gap: 2, bgcolor: '#f8f9fa' }}>
          <Button
            onClick={() => {
              setIsModalOpen(false);
              setShowPassword(false);
            }}
            variant="outlined"
            startIcon={<X size={18} />}
            sx={{
              px: 3,
              py: 1,
              borderColor: '#bdbdbd',
              color: '#757575',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#9e9e9e',
                bgcolor: '#f5f5f5',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddNewItem}
            variant="contained"
            startIcon={newCustomer.id ? <Edit size={18} /> : <Plus size={18} />}
            disabled={isLoading}
            sx={{
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
              },
              '&:disabled': {
                background: '#bdbdbd',
              },
            }}
          >
            {isLoading ? 'Processing...' : (newCustomer.id ? 'Update Customer' : 'Add Admin')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FilterableCustomerTable;