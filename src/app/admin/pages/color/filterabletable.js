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
  Grid,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Palette,
  Filter,
  Calendar,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import ntc from 'ntcjs';
import BeautifulLoader from '../../../components/BeautifulLoader';

const FilterableTable = ({ colors = [], fetchColors }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editColorId, setEditColorId] = useState(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    dateRange: '',
  });

  useEffect(() => {
    if (Array.isArray(colors)) {
      setOriginalData(colors);
      setFilteredData(colors);
    }
  }, [colors]);

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
      filtered = filtered.filter((item) => new Date(item.createdAt || item.created_at || item.updatedAt || item.updated_at) >= cutoffDate);
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

  const handleAddNewColor = async () => {
    const ntcResult = ntc.name(newColorHex);
    const generatedName = ntcResult[1];

    setIsLoading(true);
    setIsModalOpen(false);
    try {
      const response = await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: generatedName, hex: newColorHex }),
      });

      if (response.ok) {
        fetchColors();
        resetForm();
      } else {
        console.error('Failed to add color');
      }
    } catch (error) {
      console.error('Error adding color:', error);
    }
    setIsLoading(false);
  };

  const handleUpdateColor = async () => {
    const ntcResult = ntc.name(newColorHex);
    const generatedName = ntcResult[1];

    setIsLoading(true);
    setIsModalOpen(false);
    try {
      const response = await fetch('/api/colors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editColorId, name: generatedName, hex: newColorHex }),
      });

      if (response.ok) {
        fetchColors();
        resetForm();
      } else {
        console.error('Failed to update color');
      }
    } catch (error) {
      console.error('Error updating color:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteColor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this color?')) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/colors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchColors();
      } else {
        console.error('Failed to delete color');
      }
    } catch (error) {
      console.error('Error deleting color:', error);
    }
    setIsLoading(false);
  };

  const handleModalOpen = (color) => {
    setNewColorName(color ? color.name : '');
    setNewColorHex(color ? color.hex || '#000000' : '#000000');
    setEditColorId(color ? color.id : null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewColorName('');
    setNewColorHex('#000000');
    setEditColorId(null);
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

  // Helper to get contrast color for text
  const getContrastColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
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
      {isLoading && <BeautifulLoader message="Processing..." />}

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
                      <Palette size={36} />
                      Colors Management
          </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage and organize product colors
                    </Typography>
                  </Box>
                  <Tooltip title="Add New Color" arrow>
            <IconButton
              onClick={() => handleModalOpen(null)}
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
                    placeholder="Search colors by name or hex..."
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

          {/* Colors Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} colors
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== originalData.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {originalData.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

                {/* Colors Table */}
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
                        <TableCell>Color</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Hex Value</TableCell>
                        <TableCell>Created At</TableCell>
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
                              <Palette size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No colors found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter || filters.dateRange
                                  ? 'Try adjusting your filters'
                                  : 'Add your first color to get started'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((item, index) => {
                          const colorHex = item.hex || '#000000';
                          const contrastColor = getContrastColor(colorHex);
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
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 2,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 2,
                                        bgcolor: colorHex,
                                        border: '2px solid rgba(0,0,0,0.1)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                          transform: 'scale(1.1)',
                                          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                        },
                                      }}
                                    >
                                      <Circle size={32} style={{ color: contrastColor }} />
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {item.name || 'Unnamed Color'}
                                  </Typography>
                    </TableCell>
                                <TableCell>
                                  <Chip
                                    label={colorHex.toUpperCase()}
                                    size="small"
                                    sx={{
                                      fontFamily: 'monospace',
                                      fontWeight: 600,
                                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                                      color: '#6366f1',
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
                                    <Tooltip title="Edit Color" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleModalOpen(item)}
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
                                    <Tooltip title="Delete Color" arrow>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteColor(item.id)}
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

      {/* Add/Edit Color Dialog */}
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
                  <Palette size={28} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {editColorId ? 'Edit Color' : 'Add New Color'}
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
                  Color Information
                </Typography>

                {/* Color Preview */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: 3,
                      bgcolor: newColorHex,
                      border: '3px solid rgba(99, 102, 241, 0.3)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 30px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    <Circle
                      sx={{
                        fontSize: 80,
                        color: getContrastColor(newColorHex),
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        p: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                        {newColorHex.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
            <TextField
                      fullWidth
              label="Color Name"
              value={newColorName}
              disabled
                      variant="outlined"
                      helperText="Color name is automatically generated from hex value"
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
                      label="Hex Color *"
              type="color"
                      value={newColorHex}
                      onChange={(e) => {
                        setNewColorHex(e.target.value);
                        const ntcResult = ntc.name(e.target.value);
                        setNewColorName(ntcResult[1]);
                      }}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: 60,
                          '& input[type="color"]': {
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                          },
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
                      label="Hex Value"
                      value={newColorHex.toUpperCase()}
                      onChange={(e) => {
                        const hex = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
                          setNewColorHex(hex);
                          const ntcResult = ntc.name(hex);
                          setNewColorName(ntcResult[1]);
                        }
                      }}
              variant="outlined"
                      placeholder="#000000"
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
                </Grid>
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
            onClick={editColorId ? handleUpdateColor : handleAddNewColor}
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
                {editColorId ? 'Update Color' : 'Create Color'}
          </Button>
        </DialogActions>
      </Dialog>
        </Box>
      </Fade>
    </Box>
  );
};

export default FilterableTable;
