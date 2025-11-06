'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Grow,
  Slide,
  Chip,
  Tooltip,
  CircularProgress,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { Image as ImageIconLucide } from 'lucide-react';

const FilterableSliderTable = ({ sliders = [], fetchSliders }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(sliders);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editSlider, setEditSlider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sliderForm, setSliderForm] = useState({
    imgurl: '',
    link: '',
  });
  const [existingImage, setExistingImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFilteredData(
      sliders.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, sliders]);

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slider?')) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/slider/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchSliders();
      } else {
        console.error('Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setEditSlider(item);
    setSliderForm({
      imgurl: '',
      link: item.link || '',
    });
    setExistingImage(item.imgurl || '');
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setEditSlider(null);
    setSliderForm({
      imgurl: '',
      link: '',
    });
    setExistingImage('');
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSliderForm({ ...sliderForm, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSliderForm({ ...sliderForm, imgurl: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImageUrl = existingImage;

      if (fileInputRef.current?.files?.length > 0) {
        const imageBase64 = await convertToBase64(fileInputRef.current.files[0]);
        const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageBase64 }),
        });
        const result = await response.json();
        if (response.ok) {
          uploadedImageUrl = result.image_url;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      }

      const sliderData = {
        imgurl: uploadedImageUrl,
        link: sliderForm.link,
      };

      const method = editSlider ? 'PUT' : 'POST';
      const url = editSlider ? `/api/slider/${editSlider.id}` : '/api/slider';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sliderData),
      });

      if (response.ok) {
        fetchSliders();
        handleCancelEdit();
      } else {
        console.error('Failed to save slider');
        alert('Failed to save slider. Please try again.');
      }
    } catch (error) {
      console.error('Error saving slider:', error);
      alert('An error occurred while saving the slider. Please try again.');
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setEditSlider(null);
    setSliderForm({
      imgurl: '',
      link: '',
    });
    setExistingImage('');
    setImagePreview('');
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', p: 4 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Fade in timeout={800}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center',
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
                  background: 'rgba(255,255,255,0.1)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <Grow in timeout={600}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
                  <ImageIconLucide size={64} style={{ opacity: 0.9 }} />
                </Box>
              </Grow>
              <Grow in timeout={800}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, position: 'relative', zIndex: 1 }}>
                  Slider Management
                </Typography>
              </Grow>
              <Typography variant="body2" sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}>
                Manage your website sliders and banners
              </Typography>
            </Box>

            {/* Content */}
            <CardContent sx={{ p: 4 }}>
              {/* Search and Add Button */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Grow in timeout={1000}>
                  <TextField
                    placeholder="Search sliders..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
                    size="small"
                    sx={{
                      flex: 1,
                      minWidth: 250,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#6366f1' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grow>
                <Grow in timeout={1200}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                      },
                    }}
                  >
                    Add New Slider
                  </Button>
                </Grow>
              </Box>

              {/* Table */}
              <Fade in timeout={1400}>
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700, color: '#6366f1' }}>Image</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6366f1' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6366f1' }}>Link</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6366f1', textAlign: 'center' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <ImageIcon sx={{ fontSize: 64, color: '#cbd5e1' }} />
                              <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                                No sliders found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                                {filter ? 'Try adjusting your search' : 'Add your first slider to get started'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredData.map((item, index) => (
                          <Slide
                            key={item.id}
                            direction="up"
                            in
                            timeout={300 + index * 100}
                          >
                            <TableRow
                              sx={{
                                '&:hover': {
                                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                                  transform: 'scale(1.01)',
                                  transition: 'all 0.3s ease',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <TableCell>
                                {item.imgurl ? (
                                  <Avatar
                                    variant="rounded"
                                    sx={{
                                      width: 80,
                                      height: 60,
                                      borderRadius: 2,
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                  >
                                    <Image
                                      width={80}
                                      height={60}
                                      src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${item.imgurl}`}
                                      alt={`Slider ${item.id}`}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                      }}
                                    />
                                  </Avatar>
                                ) : (
                                  <Chip
                                    icon={<ImageIcon />}
                                    label="No Image"
                                    size="small"
                                    sx={{ borderRadius: 2 }}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={`#${item.id}`}
                                  size="small"
                                  sx={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                {item.link ? (
                                  <Tooltip title={item.link}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        maxWidth: 300,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      <LinkIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: '#6366f1',
                                          textDecoration: 'none',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {item.link}
                                      </Typography>
                                    </Box>
                                  </Tooltip>
                                ) : (
                                  <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                    No link
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      onClick={() => handleEditItem(item)}
                                      sx={{
                                        color: '#6366f1',
                                        '&:hover': {
                                          background: 'rgba(99, 102, 241, 0.1)',
                                          transform: 'scale(1.1)',
                                        },
                                        transition: 'all 0.3s ease',
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      onClick={() => handleDeleteItem(item.id)}
                                      sx={{
                                        color: '#ef4444',
                                        '&:hover': {
                                          background: 'rgba(239, 68, 68, 0.1)',
                                          transform: 'scale(1.1)',
                                        },
                                        transition: 'all 0.3s ease',
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          </Slide>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Fade>
            </CardContent>
          </Card>
        </Fade>

        {/* Add/Edit Modal */}
        <Dialog
          open={isModalOpen}
          onClose={handleCancelEdit}
          maxWidth="md"
          fullWidth
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'up' }}
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            },
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {editSlider ? 'Edit Slider' : 'Add New Slider'}
            </Typography>
            <IconButton
              onClick={handleCancelEdit}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
            <form onSubmit={handleFormSubmit}>
            <DialogContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Link Field */}
                <TextField
                  label="Slider Link"
                  name="link"
                  value={sliderForm.link}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                  placeholder="https://example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon sx={{ color: '#6366f1' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6366f1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                      },
                    },
                  }}
                />

                {/* Image Upload */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#64748b' }}>
                    Slider Image
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: 2,
                      borderColor: '#6366f1',
                      color: '#6366f1',
                      '&:hover': {
                        borderColor: '#7c3aed',
                        background: 'rgba(99, 102, 241, 0.05)',
                      },
                    }}
                  >
                    {imagePreview || existingImage ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      hidden
                    />
                  </Button>
                </Box>

                {/* Image Preview */}
                {(imagePreview || existingImage) && (
                  <Fade in timeout={500}>
                    <Box
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '2px solid #e0e7ff',
                      }}
                    >
                      <Image
                        width={800}
                        height={400}
                        src={
                          imagePreview
                            ? imagePreview
                            : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${existingImage}`
                        }
                        alt="Slider Preview"
                        style={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Fade>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button
                  onClick={handleCancelEdit}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  color: '#64748b',
                  '&:hover': {
                    background: 'rgba(100, 116, 139, 0.1)',
                  },
                }}
                >
                  Cancel
              </Button>
              <Button
                  type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: 2,
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                  },
                  '&:disabled': {
                    background: '#cbd5e1',
                  },
                }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Saving...' : editSlider ? 'Update Slider' : 'Add Slider'}
              </Button>
            </DialogActions>
            </form>
        </Dialog>

        {/* Loading Overlay */}
        {isLoading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                background: 'white',
                borderRadius: 3,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <CircularProgress sx={{ color: '#6366f1' }} />
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Processing...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FilterableSliderTable;
