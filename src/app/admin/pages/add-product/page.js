'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// MUI Imports
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Fade,
  Grow,
  Chip,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Image as ImageIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// React Quill (dynamically imported as in your code)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const AddProductPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [newProduct, setNewProduct] = useState({
    id: null,
    name: '',
    slug: '',
    richDescription: '',
    price: '',
    stock: '',
    categorySlug: '',
    subcategoryId: '',
    colors: [],
    sizes: [],
    image: [],
    imageUrl: '',
    discount: '',
    isTopRated: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    sku: '',
  });

  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchSizes();

    if (productId) {
      fetchProductData(productId);
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchSubcategories = async (categorySlug) => {
    try {
      const response = await fetch(`/api/subcategories/${categorySlug}`);
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      setFilteredSubcategories(data?.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setFilteredSubcategories([]);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      if (!response.ok) throw new Error('Failed to fetch colors');
      const data = await response.json();
      const mappedColors = data.map((color) => ({
        value: color.id,
        label: `${color.name} (${color.hex})`,
        hex: color.hex,
      }));
      setColors(mappedColors);
    } catch (error) {
      console.error('Error fetching colors:', error);
      setColors([]);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      if (!response.ok) throw new Error('Failed to fetch sizes');
      const data = await response.json();
      const mappedSizes = data.map((size) => ({
        value: size.id,
        label: size.name,
      }));
      setSizes(mappedSizes);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      setSizes([]);
    }
  };

  const fetchProductData = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product data');
      const raw = await response.json();
      const data = raw?.data?.product || raw?.data || raw;

      const parsedColors = Array.isArray(data.colors)
        ? data.colors.map((color) => ({
            value: color.id,
            label: `${color.name} (${color.hex})`,
            hex: color.hex,
          }))
        : [];
      const parsedSizes = Array.isArray(data.sizes)
        ? data.sizes.map((size) => ({
            value: size.id,
            label: size.name,
          }))
        : [];

      setNewProduct({
        ...data,
        colors: parsedColors,
        sizes: parsedSizes,
      });
      const images = data.images || [];
      const processedImages = Array.isArray(images) 
        ? images
            .map((i) => {
            const url = i.url || i;
            return url && typeof url === 'string' ? url.replace(/^\//, '') : null;
            })
            .filter(Boolean)
        : [];
      setExistingImages(processedImages);

      const categorySlug = data?.subcategory?.category?.slug || data?.categorySlug;
      if (categorySlug) await fetchSubcategories(categorySlug);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
    setIsLoading(false);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newProduct.name.trim()) newErrors.name = 'Product name is required';
    if (!newProduct.slug.trim()) newErrors.slug = 'Slug is required';
    if (!newProduct.richDescription.trim()) newErrors.richDescription = 'Description is required';
    if (!newProduct.price || parseFloat(newProduct.price) <= 0)
      newErrors.price = 'Valid price is required';
    if (newProduct.stock === '' || parseInt(newProduct.stock) < 0)
      newErrors.stock = 'Valid stock quantity is required';
    if (!newProduct.categorySlug) newErrors.categorySlug = 'Category is required';
    if (!newProduct.subcategoryId) newErrors.subcategoryId = 'Subcategory is required';
    if (!newProduct.sku.trim()) newErrors.sku = 'SKU is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNewItem = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const existingProductResponse = await fetch(`/api/products/${newProduct.slug}`);
      const existingData = await existingProductResponse.json();

      if (existingData.status === false) {
        alert('Product with this slug already exists.');
        setIsLoading(false);
        return;
      }

      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          const imageBase64 = await convertToBase64(img);
          const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageBase64 }),
          });
          const result = await response.json();
          if (response.ok) return result.image_url;
          throw new Error(result.error || 'Failed to upload image');
        })
      );

      const imageUrls = uploadedImages.filter(Boolean).map((filename) => filename.replace(/^\//, ''));

      const productToSubmit = {
        ...newProduct,
        description: newProduct.richDescription,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        subcategoryId: newProduct.subcategoryId,
        vendorId: null,
        colors: JSON.stringify(newProduct.colors.map((color) => color.value)),
        sizes: JSON.stringify(newProduct.sizes.map((size) => size.value)),
        images: imageUrls,
        discount: newProduct.discount ? roundToTwoDecimalPlaces(parseFloat(newProduct.discount)) : null,
        isTopRated: newProduct.isTopRated,
        meta_title: newProduct.meta_title,
        meta_description: newProduct.meta_description,
        meta_keywords: newProduct.meta_keywords,
        sku: newProduct.sku,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSubmit),
      });

      if (response.ok) {
        router.push('/admin/pages/Products');
      } else {
        const errorData = await response.json();
        console.error('Failed to create product:', errorData.message);
        alert(`Failed to create product: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert(`Error adding product: ${error.message}`);
    }

    setIsLoading(false);
  };

  const roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
            {images.length > 0 ? 'Uploading images...' : 'Processing...'}
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
                boxShadow: '0 8px 30px rgba(255, 89, 0, 0.3)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Tooltip title="Go Back" arrow>
                    <IconButton
                      onClick={() => router.push('/admin/pages/Products')}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          {newProduct.id ? 'Edit Product' : 'Add New Product'}
        </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {newProduct.id
                        ? 'Update product information and save changes'
                        : 'Fill in the form below to add a new product to your inventory'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grow>

          {/* Form Content */}
          <Grow in timeout={800}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'white',
              }}
            >
              {/* Product Details Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon sx={{ color: '#6366f1' }} />
          Product Details
        </Typography>
                <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
                  {/* Category */}
          <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.categorySlug}>
                      <InputLabel>Category *</InputLabel>
              <Select
                value={newProduct.categorySlug}
                onChange={(e) => {
                  const categorySlug = e.target.value;
                  setNewProduct({ ...newProduct, categorySlug, subcategoryId: '' });
                          setErrors({ ...errors, categorySlug: '' });
                  fetchSubcategories(categorySlug);
                }}
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
                {Array.isArray(categories.data) &&
                  categories.data.map((category) => (
                    <MenuItem key={category.slug} value={category.slug}>
                      {category.name}
                    </MenuItem>
                  ))}
              </Select>
                      {errors.categorySlug && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                          {errors.categorySlug}
                        </Typography>
                      )}
            </FormControl>
          </Grid>

                  {/* Subcategory */}
          {filteredSubcategories.length > 0 && (
            <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.subcategoryId}>
                        <InputLabel>Subcategory *</InputLabel>
                <Select
                  value={newProduct.subcategoryId || ''}
                          onChange={(e) => {
                            setNewProduct({ ...newProduct, subcategoryId: e.target.value });
                            setErrors({ ...errors, subcategoryId: '' });
                          }}
                          label="Subcategory *"
                          sx={{
                            borderRadius: 2,
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#6366f1',
                              },
                            },
                          }}
                >
                  <MenuItem value="">Select Subcategory</MenuItem>
                  {filteredSubcategories.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </Select>
                        {errors.subcategoryId && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                            {errors.subcategoryId}
                          </Typography>
                        )}
              </FormControl>
            </Grid>
          )}

                  {/* Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
                      label="Product Name *"
              value={newProduct.name}
                      onChange={(e) => {
                        setNewProduct({ ...newProduct, name: e.target.value });
                        setErrors({ ...errors, name: '' });
                      }}
              variant="outlined"
              placeholder="Enter product name"
                      error={!!errors.name}
                      helperText={errors.name}
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

                  {/* Slug */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
                      label="Slug *"
              value={newProduct.slug}
              onChange={(e) => {
                const slugValue = e.target.value.replace(/\s+/g, '-');
                setNewProduct({ ...newProduct, slug: slugValue });
                        setErrors({ ...errors, slug: '' });
              }}
              variant="outlined"
                      placeholder="product-slug-name"
                      error={!!errors.slug}
                      helperText={errors.slug || 'URL-friendly identifier (auto-generated from name)'}
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

                  {/* SKU */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
                      label="SKU Number *"
              value={newProduct.sku}
                      onChange={(e) => {
                        setNewProduct({ ...newProduct, sku: e.target.value });
                        setErrors({ ...errors, sku: '' });
                      }}
              variant="outlined"
                      placeholder="PROD-001"
                      error={!!errors.sku}
                      helperText={errors.sku}
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

                  {/* Price */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
                      label="Price (Rs.) *"
              type="number"
              value={newProduct.price}
                      onChange={(e) => {
                        setNewProduct({ ...newProduct, price: e.target.value });
                        setErrors({ ...errors, price: '' });
                      }}
              variant="outlined"
                      placeholder="0.00"
                      error={!!errors.price}
                      helperText={errors.price}
              inputProps={{ min: 0, step: 0.01 }}
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

                  {/* Stock */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
                      label="Stock Quantity *"
              type="number"
              value={newProduct.stock !== null ? newProduct.stock.toString() : ''}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                        if (value >= 0) {
                          setNewProduct({ ...newProduct, stock: value });
                          setErrors({ ...errors, stock: '' });
                        }
              }}
              variant="outlined"
                      placeholder="0"
                      error={!!errors.stock}
                      helperText={errors.stock}
              inputProps={{ min: 0 }}
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

                  {/* Discount */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Discount (%)"
              type="number"
              value={newProduct.discount ? roundToTwoDecimalPlaces(newProduct.discount) : ''}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  discount: e.target.value ? parseFloat(e.target.value) : '',
                })
              }
              variant="outlined"
                      placeholder="0.00"
              inputProps={{ min: 0, max: 100, step: 0.01 }}
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

                  {/* Top Rated */}
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newProduct.isTopRated}
                  onChange={(e) => setNewProduct({ ...newProduct, isTopRated: e.target.checked })}
                          sx={{
                            color: '#6366f1',
                            '&.Mui-checked': {
                              color: '#6366f1',
                            },
                          }}
                />
              }
                      label={
                        <Typography sx={{ fontWeight: 600, color: newProduct.isTopRated ? '#6366f1' : 'inherit' }}>
                          Top Rated Product
                        </Typography>
                      }
            />
          </Grid>

                  {/* Colors */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Colors</InputLabel>
              <Select
                multiple
                value={newProduct.colors}
                onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                label="Colors"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((color) => (
                              <Chip
                                key={color.value}
                                label={color.label.split(' (')[0]}
                                size="small"
                                sx={{
                                  bgcolor: color.hex || '#ccc',
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        sx={{
                          borderRadius: 2,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366f1',
                            },
                          },
                        }}
              >
                {colors.map((color) => (
                  <MenuItem key={color.value} value={color}>
                    <Checkbox checked={newProduct.colors.some((c) => c.value === color.value)} />
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: color.hex || '#ccc',
                                mr: 1,
                                border: '2px solid rgba(0,0,0,0.1)',
                              }}
                            />
                    {color.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

                  {/* Sizes */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Sizes</InputLabel>
              <Select
                multiple
                value={newProduct.sizes}
                onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                label="Sizes"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((size) => (
                              <Chip key={size.value} label={size.label} size="small" color="primary" />
                            ))}
                          </Box>
                        )}
                        sx={{
                          borderRadius: 2,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366f1',
                            },
                          },
                        }}
              >
                {sizes.map((size) => (
                  <MenuItem key={size.value} value={size}>
                    <Checkbox checked={newProduct.sizes.some((s) => s.value === size.value)} />
                    {size.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
              </Box>

              {/* Description Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Description *
        </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    border: errors.richDescription ? '2px solid #ef4444' : '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    '& .ql-container': {
                      borderRadius: '0 0 8px 8px',
                    },
                    '& .ql-toolbar': {
                      borderRadius: '8px 8px 0 0',
                    },
                  }}
                >
        <ReactQuill
          value={newProduct.richDescription}
                    onChange={(value) => {
                      setNewProduct({ ...newProduct, richDescription: value });
                      setErrors({ ...errors, richDescription: '' });
                    }}
                    style={{ height: '250px', marginBottom: '50px' }}
                    placeholder="Enter detailed product description..."
                  />
                </Box>
                {errors.richDescription && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                    {errors.richDescription}
                  </Typography>
                )}
              </Box>

              {/* SEO Meta Fields Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  SEO Meta Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
        <TextField
          fullWidth
          label="Meta Title"
          value={newProduct.meta_title}
          onChange={(e) => setNewProduct({ ...newProduct, meta_title: e.target.value })}
          variant="outlined"
                      placeholder="SEO optimized title"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
        />
                  </Grid>
                  <Grid item xs={12}>
        <TextField
          fullWidth
          label="Meta Description"
          value={newProduct.meta_description}
          onChange={(e) => setNewProduct({ ...newProduct, meta_description: e.target.value })}
          variant="outlined"
                      placeholder="Brief description for search engines"
          multiline
          rows={3}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
        />
                  </Grid>
                  <Grid item xs={12}>
        <TextField
          fullWidth
          label="Meta Keywords"
          value={newProduct.meta_keywords}
          onChange={(e) => setNewProduct({ ...newProduct, meta_keywords: e.target.value })}
          variant="outlined"
                      placeholder="keyword1, keyword2, keyword3"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
        />
                  </Grid>
                </Grid>
              </Box>

              {/* Images Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ImageIcon sx={{ color: '#6366f1' }} />
                  Product Images
        </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Upload Button */}
                <Card
                  sx={{
                    mb: 3,
                    border: '2px dashed #6366f1',
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 89, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 89, 0, 0.1)',
                      borderColor: '#8b5cf6',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <input
          type="file"
                      ref={fileInputRef}
          onChange={handleImageChange}
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload-input"
                    />
                    <label htmlFor="image-upload-input">
                      <Button
                        component="span"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        sx={{
                          borderColor: '#6366f1',
                          color: '#6366f1',
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: '#8b5cf6',
                            bgcolor: 'rgba(255, 89, 0, 0.1)',
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Upload Images
                      </Button>
                    </label>
                    <Typography variant="body2" sx={{ mt: 2, color: '#6b7280' }}>
                      Select multiple images for your product
                    </Typography>
                  </CardContent>
                </Card>

                {/* Existing Images */}
        {existingImages.length > 0 && (
                  <Grow in timeout={600}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1a202c' }}>
              Existing Images
            </Typography>
            <Grid container spacing={2}>
              {existingImages.map((img, index) => (
                          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                            <Box
                              sx={{
                                position: 'relative',
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '2px solid rgba(255, 89, 0, 0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 8px 20px rgba(255, 89, 0, 0.3)',
                                },
                              }}
                            >
                    <Image
                                width={200}
                                height={200}
                                src={
                                  img
                                    ? `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}${img}`
                                    : '/placeholder-image.png'
                                }
                      alt={`Product Image ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '150px',
                                  objectFit: 'cover',
                                }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${e.target.src}`);
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveExistingImage(index)}
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  bgcolor: 'rgba(239, 68, 68, 0.9)',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: '#ef4444',
                                    transform: 'scale(1.1) rotate(90deg)',
                                  },
                                  transition: 'all 0.3s ease',
                                }}
                    >
                                <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
                  </Grow>
        )}

                {/* New Images Preview */}
        {images.length > 0 && (
                  <Grow in timeout={800}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1a202c' }}>
                        New Images ({images.length})
            </Typography>
            <Grid container spacing={2}>
              {images.map((img, index) => (
                          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                            <Box
                              sx={{
                                position: 'relative',
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '2px solid rgba(16, 185, 129, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                                },
                              }}
                            >
                    <Image
                                width={200}
                                height={200}
                      src={URL.createObjectURL(img)}
                      alt={`New Image ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '150px',
                                  objectFit: 'cover',
                                }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  bgcolor: 'rgba(239, 68, 68, 0.9)',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: '#ef4444',
                                    transform: 'scale(1.1) rotate(90deg)',
                                  },
                                  transition: 'all 0.3s ease',
                                }}
                    >
                                <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
                  </Grow>
        )}
              </Box>

        {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  mt: 4,
                  pt: 3,
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                }}
              >
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/pages/Products')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
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
            variant="contained"
                  onClick={handleAddNewItem}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 15px rgba(255, 89, 0, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      boxShadow: '0 6px 20px rgba(255, 89, 0, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
          >
                  {newProduct.id ? 'Update Product' : 'Create Product'}
          </Button>
        </Box>
      </Paper>
          </Grow>
        </Box>
      </Fade>
    </Box>
  );
};

const AddProductPage = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <CircularProgress sx={{ color: '#6366f1' }} />
        </Box>
      }
    >
      <AddProductPageContent />
    </Suspense>
  );
};

export default AddProductPage;
