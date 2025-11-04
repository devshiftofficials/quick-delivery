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
  Divider,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Ruler,
  Filter,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

const FilterableTable = ({ sizes = [], fetchSizes }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSize, setCurrentSize] = useState({ id: null, name: '' });
  const [editingSizeId, setEditingSizeId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    dateRange: '',
  });

  useEffect(() => {
    if (Array.isArray(sizes)) {
      setOriginalData(sizes);
      setFilteredData(sizes);
    }
  }, [sizes]);

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

    // Date range filter
    if (filters.dateRange) {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter((item) => new Date(item.createdAt || item.updatedAt) >= cutoffDate);
    }

    // Sort by newest first
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt || 0);
      const dateB = new Date(b.createdAt || b.updatedAt || 0);
      return dateB - dateA;
    });

    setFilteredData(filtered);
    setPage(0);
  }, [filter, filters, originalData]);

  const handleAddOrUpdateSize = async () => {
    setIsLoading(true);
    setIsModalOpen(false);
    try {
      const url = editingSizeId ? `/api/sizes/${editingSizeId}` : '/api/sizes';
      const method = editingSizeId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: currentSize.name }),
      });

      if (response.ok) {
        fetchSizes();
        resetForm();
      } else {
        console.error('Failed to save size');
      }
    } catch (error) {
      console.error('Error saving size:', error);
    }
    setIsLoading(false);
  };

  const handleEditClick = (size) => {
    setCurrentSize({ id: size.id, name: size.name });
    setEditingSizeId(size.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this size?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/sizes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchSizes();
      } else {
        console.error('Failed to delete size');
      }
    } catch (error) {
      console.error('Error deleting size:', error);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setCurrentSize({ id: null, name: '' });
    setEditingSizeId(null);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ dateRange: '' });
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
                      <Ruler size={36} />
                      Sizes Management
          </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage and organize product sizes
                    </Typography>
                  </Box>
                  <Tooltip title="Add New Size" arrow>
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
                    placeholder="Search sizes by name..."
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
                  {(filter || filters.dateRange) && (
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
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {/* Date Range Filter */}
                      <TextField
                        size="small"
                        select
                        label="Date Range"
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                        SelectProps={{
                          native: true,
                        }}
                        sx={{
                          minWidth: 200,
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
                    </Box>

                    {/* Active Filters Display */}
                    {filters.dateRange && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 600 }}>
                          Active Filters:
                        </Typography>
                        {filters.dateRange && (
                          <Chip
                            label={`Last ${filters.dateRange} ${filters.dateRange === '1' ? 'Day' : 'Days'}`}
                            onDelete={() => handleFilterChange('dateRange', '')}
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

          {/* Sizes Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} sizes
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== originalData.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {originalData.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

                {/* Sizes Table */}
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
                        <TableCell>Size Name</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                      {paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Ruler size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No sizes found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter || filters.dateRange
                                  ? 'Try adjusting your filters'
                                  : 'Add your first size to get started'}
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
                                <Chip
                                  label={item.name}
                                  sx={{
                                    fontWeight: 600,
                                    bgcolor: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                    color: '#6366f1',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                  }}
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
                                  <Tooltip title="Edit Size" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(item)}
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
                                  <Tooltip title="Delete Size" arrow>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(item.id)}
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

      {/* Add/Edit Size Dialog */}
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
                  <Ruler size={28} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {editingSizeId ? 'Edit Size' : 'Add New Size'}
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
                  Size Information
                </Typography>
            <TextField
                  fullWidth
                  label="Size Name *"
              value={currentSize.name}
              onChange={(e) => setCurrentSize({ ...currentSize, name: e.target.value })}
              variant="outlined"
                  placeholder="e.g., Small, Medium, Large, XL"
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
                  Enter a unique size name for your products
                </Typography>
          </Box>
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
            onClick={handleAddOrUpdateSize}
            variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {editingSizeId ? 'Update Size' : 'Create Size'}
          </Button>
        </DialogActions>
      </Dialog>
        </Box>
      </Fade>
    </Box>
  );
};

export default FilterableTable;
