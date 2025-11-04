'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// MUI Imports
import {
  Box,
  Paper,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TablePagination,
  Card,
  CardContent,
  Chip,
  Fade,
  Grow,
  Collapse,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  X,
  Folder,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import BeautifulLoader from '../../../components/BeautifulLoader';

const FilterableTable = ({ subcategories = [], fetchSubcategories, categories = [] }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    slug: '',
    categoryId: '',
    imageUrl: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingSubcategorySlug, setEditingSubcategorySlug] = useState(null); // Track if we're editing
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    dateRange: '',
  });

  useEffect(() => {
    if (Array.isArray(subcategories)) {
      setFilteredData(subcategories);
    }
    if (Array.isArray(categories) && categories.length > 0) {
      setCategoriesList(Array.isArray(categories.data) ? categories.data : categories);
    } else {
      fetchCategories();
    }
  }, [subcategories, categories]);

  // Apply filters
  useEffect(() => {
    let filtered = Array.isArray(subcategories) ? [...subcategories] : [];

    // Text search filter
    if (filter) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((item) => {
        const categoryId = item.categoryId || item.category?.id;
        return String(categoryId) === String(filters.category);
      });
    }

    // Date range filter
    if (filters.dateRange) {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter((item) => new Date(item.createdAt) >= cutoffDate);
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFilteredData(filtered);
    setPage(0);
  }, [filter, filters, subcategories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setCategoriesList(result.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error.message);
    }
  };

  const handleAddNewItem = async () => {
    setIsModalOpen(false);
    setIsLoading(true);
    try {
      let imageUrl = newSubcategory.imageUrl;

      if (image) {
        const imageBase64 = await convertToBase64(image);
        const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageBase64 }),
        });

        const result = await response.json();
        if (response.ok) {
          imageUrl = result.image_url;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      }

      const updatedSlug = newSubcategory.slug ? newSubcategory.slug : generateSlug(newSubcategory.name);

      const subcategoryToSubmit = {
        ...newSubcategory,
        slug: updatedSlug,
        categoryId: parseInt(newSubcategory.categoryId, 10),
        imageUrl,
      };

      // Only update if we're actually editing an existing subcategory
      const response = editingSubcategorySlug
        ? await fetch(`/api/subcategories/${editingSubcategorySlug}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subcategoryToSubmit),
          })
        : await fetch('/api/subcategories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subcategoryToSubmit),
          });

      const result = await response.json();

      if (response.ok) {
        fetchSubcategories();
        resetForm();
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
      } else {
        console.error('Failed to add/update subcategory:', result.message);
      }
    } catch (error) {
      console.error('Error adding or updating subcategory:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (slug) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/subcategories/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete subcategory');
      }

      fetchSubcategories();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setNewSubcategory({
      ...item,
      slug: item.slug,
      image: null,
      imageUrl: item.imageUrl || '',
      categoryId: item.categoryId || item.category?.id || '',
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      meta_keywords: item.meta_keywords || '',
    });
    setImage(null);
    setImagePreview(null);
    setEditingSubcategorySlug(item.slug); // Set the slug we're editing
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Clean up preview URL when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }
  };
  }, [imagePreview]);

  // Clean up preview when modal closes
  useEffect(() => {
    if (!isModalOpen && imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  }, [isModalOpen, imagePreview]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const resetForm = () => {
    setNewSubcategory({
      name: '',
      slug: '',
      categoryId: '',
      imageUrl: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    });
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setEditingSubcategorySlug(null); // Reset edit mode
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', dateRange: '' });
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

  // Get image URL helper
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null; // Return null to show placeholder icon
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${imageUrl}`;
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
                      <ArrowRight size={36} />
                      SubCategories Management
          </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage and organize your product subcategories
                    </Typography>
                  </Box>
                  <Tooltip title="Add New Subcategory" arrow>
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
                    placeholder="Search subcategories by name, slug, category..."
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
                  {(filter || filters.category || filters.dateRange) && (
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
                      {/* Category Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Category</InputLabel>
                          <Select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            label="Category"
                            sx={{
                              borderRadius: 2,
                            }}
                          >
                            <MenuItem value="">All Categories</MenuItem>
                            {categoriesList.map((cat) => (
                              <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </MenuItem>
                            ))}
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
                    {(filters.category || filters.dateRange) && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 600 }}>
                          Active Filters:
                        </Typography>
                        {filters.category && (
                          <Chip
                            label={`Category: ${categoriesList.find((c) => String(c.id) === String(filters.category))?.name || filters.category}`}
                            onDelete={() => handleFilterChange('category', '')}
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
                </Collapse>
              </CardContent>
            </Card>
          </Grow>

          {/* SubCategories Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} subcategories
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== subcategories.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {subcategories.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

                {/* SubCategories Table */}
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
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Slug</TableCell>
                        <TableCell>Category</TableCell>
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
                              <ArrowRight size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No subcategories found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter || filters.category || filters.dateRange
                                  ? 'Try adjusting your filters'
                                  : 'Add your first subcategory to get started'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                paginatedData.map((item, index) => (
                          <Grow key={item.id || item.slug} in timeout={(index % rowsPerPage) * 50}>
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
                                    position: 'relative',
                                    width: 70,
                                    height: 70,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '2px solid rgba(99, 102, 241, 0.2)',
                                    bgcolor: '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                      borderColor: '#6366f1',
                                    },
                                  }}
                                >
                                  {getImageUrl(item.imageUrl) ? (
                                    <>
                        <Image
                                        width={70}
                                        height={70}
                                        src={getImageUrl(item.imageUrl)}
                          alt={item.name}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                        }}
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          if (e.target.nextSibling) {
                                            e.target.nextSibling.style.display = 'flex';
                                          }
                                        }}
                        />
                                      <Box
                                        sx={{
                                          display: 'none',
                                          width: '100%',
                                          height: '100%',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          bgcolor: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                        }}
                                      >
                                        <ArrowRight size={32} style={{ color: '#6366f1' }} />
                                      </Box>
                                    </>
                                  ) : (
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        width: '100%',
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                      }}
                                    >
                                      <Folder size={32} style={{ color: '#6366f1' }} />
                                    </Box>
                      )}
                                </Box>
                    </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {item.name}
                                </Typography>
                    </TableCell>
                              <TableCell>
                                <Chip label={item.slug} size="small" variant="outlined" />
                    </TableCell>
                              <TableCell>
                                {item.category ? (
                                  <Chip
                                    label={item.category.name}
                                    size="small"
                                    color="primary"
                                    icon={<Folder size={16} />}
                                  />
                                ) : (
                                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                    N/A
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Calendar size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Edit Subcategory" arrow>
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
                                  <Tooltip title="Delete Subcategory" arrow>
                        <IconButton
                                      color="error"
                          onClick={() => handleDeleteItem(item.slug)}
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

          {/* Add/Edit Subcategory Dialog */}
          <Dialog
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              resetForm();
            }}
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
                  <ArrowRight size={28} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {editingSubcategorySlug ? 'Edit Subcategory' : 'Add New Subcategory'}
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F9FAFB',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6366f1', mb: 2 }}>
                      Basic Information
                    </Typography>
              <TextField
                fullWidth
                      label="Subcategory Name *"
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                variant="outlined"
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                        },
                      }}
                    />
              <TextField
                fullWidth
                      label="Slug *"
                value={newSubcategory.slug}
                onChange={(e) => {
                  const updatedSlug = e.target.value.replace(/\s+/g, '-');
                  setNewSubcategory({ ...newSubcategory, slug: updatedSlug });
                }}
                variant="outlined"
                      helperText="URL-friendly identifier (auto-generated from name)"
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                        },
                      }}
                    />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Category *</InputLabel>
                <Select
                  value={newSubcategory.categoryId}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
                        label="Category *"
                        sx={{
                          borderRadius: 2,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366f1',
                            },
                          },
                        }}
                >
                  <MenuItem value="">Select Category</MenuItem>
                        {categoriesList.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
                  </Box>
            </Grid>

              <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F9FAFB',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ImageIcon size={20} />
                      Subcategory Image
                </Typography>
                    {(imagePreview || (newSubcategory.imageUrl && getImageUrl(newSubcategory.imageUrl))) && (
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: 150,
                            height: 150,
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '2px solid rgba(99, 102, 241, 0.3)',
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)',
                            },
                          }}
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : newSubcategory.imageUrl && getImageUrl(newSubcategory.imageUrl) ? (
                            <>
                <Image
                                width={150}
                                height={150}
                                src={getImageUrl(newSubcategory.imageUrl)}
                  alt={newSubcategory.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = 'flex';
                                  }
                                }}
                />
                              <Box
                                sx={{
                                  display: 'none',
                                  width: '100%',
                                  height: '100%',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                }}
                              >
                                <ArrowRight size={48} style={{ color: '#6366f1' }} />
                              </Box>
                            </>
                          ) : null}
                        </Box>
                      </Box>
                    )}
                    <Box
                      sx={{
                        border: '2px dashed #6366f1',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        bgcolor: 'rgba(99, 102, 241, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                          borderColor: '#8b5cf6',
                        },
                      }}
                    >
              <input
                type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="subcategory-image-upload"
                      />
                      <label htmlFor="subcategory-image-upload">
                        <Button
                          component="span"
                          variant="outlined"
                          startIcon={<ImageIcon size={18} />}
                          sx={{
                            borderColor: '#6366f1',
                            color: '#6366f1',
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: '#8b5cf6',
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {newSubcategory.imageUrl ? 'Change Image' : 'Upload Image'}
                        </Button>
                      </label>
                      <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#6b7280' }}>
                        If no image is uploaded, a placeholder icon will be used
                      </Typography>
                    </Box>
                  </Box>
            </Grid>

            <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F9FAFB',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle2 size={20} />
                      SEO Meta Information
                    </Typography>
              <TextField
                fullWidth
                label="Meta Title"
                value={newSubcategory.meta_title}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, meta_title: e.target.value })}
                variant="outlined"
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                        },
                      }}
                    />
              <TextField
                fullWidth
                label="Meta Description"
                value={newSubcategory.meta_description}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, meta_description: e.target.value })}
                variant="outlined"
                multiline
                rows={3}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                        },
                      }}
                    />
              <TextField
                fullWidth
                label="Meta Keywords"
                value={newSubcategory.meta_keywords}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, meta_keywords: e.target.value })}
                variant="outlined"
                      placeholder="keyword1, keyword2, keyword3"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                        },
                      }}
              />
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
                {editingSubcategorySlug ? 'Update Subcategory' : 'Create Subcategory'}
            </Button>
            </DialogActions>
          </Dialog>
          </Box>
      </Fade>
    </Box>
  );
};

export default FilterableTable;
