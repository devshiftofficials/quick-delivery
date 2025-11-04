'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Select from 'react-select';

// MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormControlLabel,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select as MuiSelect,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Collapse,
  Tooltip,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Trash2,
  Edit,
  Plus,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from 'lucide-react';
import BeautifulLoader from '../../../components/BeautifulLoader';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const FilterableTable = ({
  products = [],
  fetchProducts,
  categories = [],
  subcategories = [],
  colors = [],
  sizes = [],
}) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(products);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemSlugToDelete, setItemSlugToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    vendor: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    inStock: null, // null = all, true = in stock, false = out of stock
  });

  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    subcategorySlug: '',
    colors: [],
    sizes: [],
    discount: '',
    isTopRated: false,
    images: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    sku: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Get unique vendors from products
  const vendors = React.useMemo(() => {
    const vendorSet = new Set();
    products.forEach((product) => {
      if (product.vendor && product.vendor.name) {
        vendorSet.add(product.vendor.name);
      }
    });
    return Array.from(vendorSet).map((name) => ({ value: name, label: name }));
  }, [products]);

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products;

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
        const categorySlug = item.subcategory?.category?.slug || '';
        return categorySlug === filters.category;
      });
    }

    // Subcategory filter
    if (filters.subcategory) {
      filtered = filtered.filter((item) => {
        const subcatSlug = item.subcategory?.slug || '';
        return subcatSlug === filters.subcategory;
      });
    }

    // Vendor filter
    if (filters.vendor) {
      filtered = filtered.filter((item) => {
        return item.vendor?.name === filters.vendor;
      });
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter((item) => item.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((item) => item.price <= parseFloat(filters.maxPrice));
    }

    // Stock filters
    if (filters.minStock !== '') {
      filtered = filtered.filter((item) => item.stock >= parseInt(filters.minStock) || 0);
    }
    if (filters.maxStock !== '') {
      filtered = filtered.filter((item) => item.stock <= parseInt(filters.maxStock) || 0);
    }
    if (filters.inStock !== null) {
      if (filters.inStock) {
        filtered = filtered.filter((item) => item.stock > 0);
      } else {
        filtered = filtered.filter((item) => item.stock === 0);
      }
    }

    setFilteredData(filtered);
    setPage(0);
  }, [filter, products, filters]);

  // Update subcategories when category changes
  useEffect(() => {
    if (filters.category && categories.length > 0) {
      const categoryData = Array.isArray(categories.data) ? categories.data : categories;
      const selectedCat = categoryData.find((cat) => cat.slug === filters.category);
      if (selectedCat && subcategories.length > 0) {
        const filtered = subcategories.filter(
          (subcat) => subcat.categoryId === selectedCat.id
        );
        setFilteredSubcategories(filtered);
      }
    } else {
      setFilteredSubcategories(subcategories);
    }
  }, [filters.category, categories, subcategories]);

  const handleDeleteClick = (slug) => {
    setItemSlugToDelete(slug);
    setIsPopupVisible(true);
  };

  const handleDeleteItem = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${itemSlugToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        fetchProducts();
        setIsPopupVisible(false);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setIsLoading(false);
  };

  const handleCancelDelete = () => {
    setIsPopupVisible(false);
    setItemSlugToDelete(null);
  };

  const handleEditItem = (item) => {
    setEditProduct(item);

    // Parse colors from JSON string if needed
    let productColors = [];
    if (item.colors) {
      try {
        const parsedColors = typeof item.colors === 'string' ? JSON.parse(item.colors) : item.colors;
        productColors = colors
          .filter((color) => parsedColors.includes(color.id))
      .map((color) => ({
        value: color.id,
        label: `${color.name} (${color.hex})`,
        hex: color.hex,
      }));
      } catch (e) {
        console.error('Error parsing colors:', e);
      }
    }

    // Parse sizes from JSON string if needed
    let productSizes = [];
    if (item.sizes) {
      try {
        const parsedSizes = typeof item.sizes === 'string' ? JSON.parse(item.sizes) : item.sizes;
        productSizes = sizes
          .filter((size) => parsedSizes.includes(size.id))
      .map((size) => ({ value: size.id, label: size.name }));
      } catch (e) {
        console.error('Error parsing sizes:', e);
      }
    }

    setProductForm({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      price: item.price || '',
      stock: item.stock || '',
      subcategorySlug: item.subcategory?.slug || '',
      colors: productColors,
      sizes: productSizes,
      discount: item.discount || '',
      isTopRated: item.isTopRated || false,
      images: [],
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      meta_keywords: item.meta_keywords || '',
      sku: item.sku || '',
    });
    setExistingImages(item.images?.map((img) => img.url || img) || []);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue =
      type === 'checkbox' ? checked : name === 'stock' ? Math.max(0, parseInt(value) || 0) : value;
    setProductForm({ ...productForm, [name]: newValue });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const roundToTwoDecimalPlaces = (num) => Math.round(num * 100) / 100;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const uploadedImages = await Promise.all(
        productForm.images.map(async (file) => {
          const imageBase64 = await convertToBase64(file);
          const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageBase64 }),
          });
          const result = await response.json();
          if (response.ok) return result.image_url;
          throw new Error(result.error || 'Failed to upload image');
        })
      );

      const productData = {
        ...productForm,
        stock: parseInt(productForm.stock) || 0,
        images: [...existingImages, ...uploadedImages],
        discount: productForm.discount ? productForm.discount : null,
        colors: productForm.colors.map((color) => color.value),
        sizes: productForm.sizes.map((size) => size.value),
      };

      const response = await fetch(`/api/products/${editProduct.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        fetchProducts();
        setEditProduct(null);
        setProductForm({
          name: '',
          slug: '',
          description: '',
          price: '',
          stock: '',
          subcategorySlug: '',
          colors: [],
          sizes: [],
          discount: '',
          isTopRated: false,
          images: [],
          meta_title: '',
          meta_description: '',
          meta_keywords: '',
          sku: '',
        });
        setExistingImages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
    setProductForm({
      name: '',
      slug: '',
      description: '',
      price: '',
      stock: '',
      subcategorySlug: '',
      colors: [],
      sizes: [],
      discount: '',
      isTopRated: false,
      images: [],
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      sku: '',
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductForm((prevForm) => ({
      ...prevForm,
      images: [...prevForm.images, ...files],
    }));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveImage = (index) => {
    setProductForm((prevForm) => ({
      ...prevForm,
      images: prevForm.images.filter((_, i) => i !== index),
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
      category: '',
      subcategory: '',
      vendor: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: '',
      inStock: null,
    });
    setFilter('');
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const categoryOptions = Array.isArray(categories.data) ? categories.data : categories || [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 3,
      }}
    >
      {/* Confirmation Dialog */}
      <Dialog
        open={isPopupVisible}
        onClose={handleCancelDelete}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#ef4444' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            If you delete this product, all orders related to this product will also be deleted.
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteItem} color="error" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Yes, Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Overlay */}
      {isLoading && <BeautifulLoader message="Processing..." />}

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
                      Products Management
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage and filter your product inventory
                    </Typography>
            </Box>
                  <Tooltip title="Add New Product" arrow>
                    <Button
                      variant="contained"
                      startIcon={<Plus size={18} />}
                      onClick={() => router.push('/admin/pages/add-product')}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Add Product
                    </Button>
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
                    placeholder="Search products by name, SKU, slug..."
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
                  {(filters.category ||
                    filters.subcategory ||
                    filters.vendor ||
                    filters.minPrice ||
                    filters.maxPrice ||
                    filters.minStock ||
                    filters.maxStock ||
                    filters.inStock !== null) && (
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
                          <MuiSelect
                            value={filters.category}
                            onChange={(e) => {
                              handleFilterChange('category', e.target.value);
                              handleFilterChange('subcategory', ''); // Reset subcategory
                            }}
                            label="Category"
                          >
                            <MenuItem value="">All Categories</MenuItem>
                            {categoryOptions.map((cat) => (
                              <MenuItem key={cat.id || cat.slug} value={cat.slug}>
                                {cat.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </Grid>

                      {/* Subcategory Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Subcategory</InputLabel>
                          <MuiSelect
                            value={filters.subcategory}
                            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                            label="Subcategory"
                            disabled={!filters.category}
                          >
                            <MenuItem value="">All Subcategories</MenuItem>
                            {filteredSubcategories.map((subcat) => (
                              <MenuItem key={subcat.id} value={subcat.slug}>
                                {subcat.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </Grid>

                      {/* Vendor Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Vendor</InputLabel>
                          <MuiSelect
                            value={filters.vendor}
                            onChange={(e) => handleFilterChange('vendor', e.target.value)}
                            label="Vendor"
                          >
                            <MenuItem value="">All Vendors</MenuItem>
                            {vendors.map((vendor) => (
                              <MenuItem key={vendor.value} value={vendor.value}>
                                {vendor.label}
                              </MenuItem>
                            ))}
                            <MenuItem value="admin">Admin Products</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </Grid>

                      {/* Stock Status Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Stock Status</InputLabel>
                          <MuiSelect
                            value={filters.inStock === null ? '' : filters.inStock ? 'in' : 'out'}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleFilterChange(
                                'inStock',
                                value === '' ? null : value === 'in'
                              );
                            }}
                            label="Stock Status"
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="in">In Stock</MenuItem>
                            <MenuItem value="out">Out of Stock</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </Grid>

                      {/* Price Range */}
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Min Price"
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Max Price"
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                          }}
                        />
                      </Grid>

                      {/* Stock Range */}
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Min Stock"
                          type="number"
                          value={filters.minStock}
                          onChange={(e) => handleFilterChange('minStock', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Max Stock"
                          type="number"
                          value={filters.maxStock}
                          onChange={(e) => handleFilterChange('maxStock', e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    {/* Active Filters Display */}
                    {(filters.category ||
                      filters.subcategory ||
                      filters.vendor ||
                      filters.minPrice ||
                      filters.maxPrice ||
                      filters.minStock ||
                      filters.maxStock ||
                      filters.inStock !== null) && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 600 }}>
                          Active Filters:
                        </Typography>
                        {filters.category && (
                          <Chip
                            label={`Category: ${categoryOptions.find((c) => c.slug === filters.category)?.name || filters.category}`}
                            onDelete={() => handleFilterChange('category', '')}
                            color="primary"
                            size="small"
                          />
                        )}
                        {filters.subcategory && (
                          <Chip
                            label={`Subcategory: ${filteredSubcategories.find((s) => s.slug === filters.subcategory)?.name || filters.subcategory}`}
                            onDelete={() => handleFilterChange('subcategory', '')}
                            color="primary"
                            size="small"
                          />
                        )}
                        {filters.vendor && (
                          <Chip
                            label={`Vendor: ${filters.vendor}`}
                            onDelete={() => handleFilterChange('vendor', '')}
                            color="primary"
                            size="small"
                          />
                        )}
                        {filters.minPrice && (
                          <Chip
                            label={`Min Price: Rs. ${filters.minPrice}`}
                            onDelete={() => handleFilterChange('minPrice', '')}
                            color="secondary"
                            size="small"
                          />
                        )}
                        {filters.maxPrice && (
                          <Chip
                            label={`Max Price: Rs. ${filters.maxPrice}`}
                            onDelete={() => handleFilterChange('maxPrice', '')}
                            color="secondary"
                            size="small"
                          />
                        )}
                        {filters.inStock !== null && (
                          <Chip
                            label={filters.inStock ? 'In Stock' : 'Out of Stock'}
                            onDelete={() => handleFilterChange('inStock', null)}
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

          {/* Products Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} products
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== products.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {products.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

          {/* Products Table */}
                <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 1, bgcolor: 'white' }}>
                  <Table stickyHeader>
              <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(226, 85, 43, 0.1) 100%)',
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
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Vendor</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                      {paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <ImageIcon size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No products found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter || Object.values(filters).some((f) => f !== '' && f !== null)
                                  ? 'Try adjusting your filters'
                                  : 'Add your first product to get started'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                  paginatedData.map((item, index) => (
                          <Grow
                            key={item.id || item.slug}
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
                        {item.images && item.images.length > 0 ? (
                                  <Box
                                    sx={{
                                      position: 'relative',
                                      width: 60,
                                      height: 60,
                                      borderRadius: 2,
                                      overflow: 'hidden',
                                      border: '2px solid rgba(99, 102, 241, 0.2)',
                                    }}
                                  >
                          <Image
                                      width={60}
                                      height={60}
                            src={
                                        item.images[0].url?.startsWith('https://') ||
                                        item.images[0].url?.startsWith('http://')
                                ? item.images[0].url
                                : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${item.images[0].url}`
                            }
                                      alt={item.name}
                                      style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                      }}
                          />
                                  </Box>
                        ) : (
                                  <Box
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      borderRadius: 2,
                                      bgcolor: '#e5e7eb',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <ImageIcon size={20} style={{ color: '#9ca3af' }} />
                                  </Box>
                        )}
                      </TableCell>
                      <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                  {item.slug}
                                </Typography>
                      </TableCell>
                      <TableCell>
                                <Chip label={item.sku || 'N/A'} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {item.subcategory?.category?.name || 'N/A'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                  {item.subcategory?.name || ''}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {item.vendor ? (
                                  <Chip
                                    label={item.vendor.name}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                ) : (
                                  <Chip label="Admin" size="small" color="secondary" />
                                )}
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                                  Rs. {item.price?.toLocaleString() || '0'}
                                </Typography>
                                {item.discount && (
                                  <Typography variant="caption" sx={{ color: '#ef4444' }}>
                                    {item.discount}% off
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={item.stock || 0}
                                  size="small"
                                  color={item.stock > 0 ? 'success' : 'error'}
                                  variant={item.stock > 0 ? 'filled' : 'outlined'}
                                />
                              </TableCell>
                              <TableCell align="center">
                                {item.isTopRated && (
                                  <Chip
                                    label="Top Rated"
                                    size="small"
                                    color="warning"
                                    sx={{ fontWeight: 600 }}
                                  />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Edit Product" arrow>
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
                                  <Tooltip title="Delete Product" arrow>
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDeleteClick(item.slug)}
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

      {/* Edit Product Dialog */}
      {editProduct && (
            <Dialog
              open={Boolean(editProduct)}
              onClose={handleCancelEdit}
              maxWidth="lg"
              fullWidth
              TransitionComponent={Fade}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                },
              }}
            >
              <DialogTitle
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                Edit Product
              </DialogTitle>
              <DialogContent sx={{ p: 3, mt: 2 }}>
            <form onSubmit={handleFormSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                name="name"
                value={productForm.name}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
                    </Grid>
                    <Grid item xs={12} md={6}>
              <TextField
                label="SKU number"
                name="sku"
                value={productForm.sku}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
                    </Grid>
                    <Grid item xs={12}>
              <TextField
                label="Slug"
                name="slug"
                value={productForm.slug}
                onChange={(e) =>
                  setProductForm({ ...productForm, slug: e.target.value.replace(/\s+/g, '-') })
                }
                fullWidth
                margin="normal"
                variant="outlined"
              />
                    </Grid>
                    <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <ReactQuill
                value={productForm.description}
                onChange={(value) => setProductForm({ ...productForm, description: value })}
              />
                    </Grid>
                    <Grid item xs={12} md={4}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={productForm.price}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
                    </Grid>
                    <Grid item xs={12} md={4}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={productForm.stock}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                inputProps={{ min: 0 }}
              />
                    </Grid>
                    <Grid item xs={12} md={4}>
              <TextField
                label="Discount"
                name="discount"
                type="number"
                value={productForm.discount}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    discount: roundToTwoDecimalPlaces(parseFloat(e.target.value) || 0),
                  })
                }
                fullWidth
                margin="normal"
                variant="outlined"
                inputProps={{ step: 0.01 }}
              />
                    </Grid>
                    <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isTopRated"
                    checked={productForm.isTopRated}
                    onChange={handleFormChange}
                  />
                }
                label="Top Rated"
              />
                    </Grid>
                    <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Subcategory</InputLabel>
                <MuiSelect
                  name="subcategorySlug"
                  value={productForm.subcategorySlug}
                  onChange={handleFormChange}
                  label="Subcategory"
                >
                  <MenuItem value="">Select Subcategory</MenuItem>
                  {filteredSubcategories.map((subcat) => (
                    <MenuItem key={subcat.id} value={subcat.slug}>
                      {subcat.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                        <Typography variant="subtitle1" gutterBottom>
                          Colors
                        </Typography>
                <Select
                  isMulti
                  name="colors"
                  value={productForm.colors}
                  onChange={(selected) => setProductForm({ ...productForm, colors: selected })}
                  options={colors.map((color) => ({
                    value: color.id,
                    label: `${color.name} (${color.hex})`,
                    hex: color.hex,
                  }))}
                  getOptionLabel={(color) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          backgroundColor: color.hex,
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: '10px',
                        }}
                      />
                      {color.label}
                    </div>
                  )}
                />
              </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                        <Typography variant="subtitle1" gutterBottom>
                          Sizes
                        </Typography>
                <Select
                  isMulti
                  name="sizes"
                  value={productForm.sizes}
                  onChange={(selected) => setProductForm({ ...productForm, sizes: selected })}
                  options={sizes.map((size) => ({ value: size.id, label: size.name }))}
                />
              </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
              <TextField
                label="Meta Title"
                name="meta_title"
                value={productForm.meta_title}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
                    </Grid>
                    <Grid item xs={12} md={8}>
              <TextField
                label="Meta Description"
                name="meta_description"
                value={productForm.meta_description}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                        rows={2}
              />
                    </Grid>
                    <Grid item xs={12}>
              <TextField
                label="Meta Keywords"
                name="meta_keywords"
                value={productForm.meta_keywords}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Images
                      </Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  multiple
                  style={{ display: 'block', marginTop: '8px' }}
                />
                    </Grid>
              {existingImages.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Existing Images
                        </Typography>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                            gap: 2,
                          }}
                        >
                    {existingImages.map((img, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <Image
                          width={120}
                          height={120}
                          src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${img}`}
                          alt={`Product Image ${index}`}
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <IconButton
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  bgcolor: 'rgba(239, 68, 68, 0.8)',
                                  color: 'white',
                                  '&:hover': { bgcolor: '#ef4444' },
                                }}
                          onClick={() => handleRemoveExistingImage(index)}
                        >
                                <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                      </Grid>
              )}
              {productForm.images.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          New Images
                        </Typography>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                            gap: 2,
                          }}
                        >
                    {productForm.images.map((img, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <Image
                          width={120}
                          height={120}
                          src={URL.createObjectURL(img)}
                          alt={`New Product Image ${index}`}
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <IconButton
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  bgcolor: 'rgba(239, 68, 68, 0.8)',
                                  color: 'white',
                                  '&:hover': { bgcolor: '#ef4444' },
                                }}
                          onClick={() => handleRemoveImage(index)}
                        >
                                <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                      </Grid>
              )}
                  </Grid>
            </form>
          </DialogContent>
              <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Button onClick={handleCancelEdit} color="primary" variant="outlined">
              Cancel
            </Button>
                <Button
                  onClick={handleFormSubmit}
                  color="primary"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    },
                  }}
                >
                  Update Product
            </Button>
          </DialogActions>
        </Dialog>
      )}
        </Box>
      </Fade>
    </Box>
  );
};

export default FilterableTable;
