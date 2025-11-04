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
  InputAdornment,
  TablePagination,
  Paper,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Music,
  Image as PinterestIcon,
  Link,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const SocialMediaPlatforms = [
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
  { key: 'twitter', label: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { key: 'tiktok', label: 'TikTok', icon: Music, color: '#000000' },
  { key: 'pinterest', label: 'Pinterest', icon: PinterestIcon, color: '#BD081C' },
];

export default function FilterableSocialMediaTable({ socialMedia, fetchSocialMedia }) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [form, setForm] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    pinterest: '',
  });

  // Apply filters
  useEffect(() => {
    let filtered = Array.isArray(socialMedia) ? [...socialMedia] : [];

    // Text search filter
    if (filter) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Sort by newest first
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0);
      const dateB = new Date(b.createdAt || b.created_at || 0);
      return dateB - dateA;
    });

    setFilteredData(filtered);
    setPage(0);
  }, [filter, socialMedia]);

  const handleOpen = (item) => {
    if (item) {
      setEditingId(item.id);
      setForm({
        facebook: item.facebook || '',
        instagram: item.instagram || '',
        twitter: item.twitter || '',
        tiktok: item.tiktok || '',
        pinterest: item.pinterest || '',
      });
    } else {
      setEditingId(null);
      setForm({
        facebook: '',
        instagram: '',
        twitter: '',
        tiktok: '',
        pinterest: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      facebook: '',
      instagram: '',
      twitter: '',
      tiktok: '',
      pinterest: '',
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/socialmedia/${editingId}` : '/api/socialmedia';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const json = await res.json();
      if (json.status) {
        setSnackbar({
          open: true,
          message: editingId ? 'Social media links updated successfully!' : 'Social media links created successfully!',
          severity: 'success',
        });
        setOpen(false);
        resetForm();
        await fetchSocialMedia();
      } else {
        setSnackbar({
          open: true,
          message: json.message || 'Failed to save social media links.',
          severity: 'error',
          });
        }
      } catch (error) {
      console.error('Error saving social media:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while saving the data.',
        severity: 'error',
      });
      } finally {
      setLoading(false);
      }
    };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete this social media entry?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/socialmedia/${item.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status) {
        setSnackbar({
          open: true,
          message: 'Social media entry deleted successfully!',
          severity: 'success',
        });
        await fetchSocialMedia();
      } else {
        setSnackbar({
          open: true,
          message: json.message || 'Failed to delete social media entry.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting social media:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while deleting the data.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const validateUrl = (url) => {
    if (!url) return true; // Empty URLs are allowed
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isFormValid = () => {
    return SocialMediaPlatforms.every((platform) => validateUrl(form[platform.key]));
  };

  const hasAtLeastOneLink = () => {
    return SocialMediaPlatforms.some((platform) => form[platform.key]?.trim() !== '');
  };

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
                      <Share2 size={36} />
                      Social Media Management
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage your social media links and profiles
        </Typography>
                  </Box>
                  <Tooltip title="Add New Social Media Entry" arrow>
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

          {/* Search Bar */}
          <Grow in timeout={800}>
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
                  placeholder="Search social media entries..."
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
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grow>

          {/* Social Media Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} entries
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== socialMedia.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {socialMedia.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

                {/* Social Media Table */}
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
                        <TableCell>Platforms</TableCell>
                        <TableCell>Links Preview</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
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
                              <Share2 size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No social media entries found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter
                                  ? 'Try adjusting your search'
                                  : 'Add your first social media entry to get started'}
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
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {SocialMediaPlatforms.map((platform) => {
                                    const Icon = platform.icon;
                                    const url = item[platform.key];
                                    return url ? (
                                      <Tooltip key={platform.key} title={`${platform.label}: ${url}`} arrow>
                                        <Chip
                                          icon={<Icon sx={{ color: platform.color }} />}
                                          label={platform.label}
                                          size="small"
                                          sx={{
                                            bgcolor: `${platform.color}15`,
                                            border: `1px solid ${platform.color}30`,
                                            color: platform.color,
                                            fontWeight: 600,
                                          }}
                                        />
                                      </Tooltip>
                                    ) : null;
                                  })}
                                  {SocialMediaPlatforms.every((platform) => !item[platform.key]) && (
                                    <Chip label="No links" size="small" variant="outlined" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxWidth: 300 }}>
                                  {SocialMediaPlatforms.map((platform) => {
                                    const url = item[platform.key];
                                    if (!url) return null;
                                    return (
                                      <Box
                                        key={platform.key}
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1,
                                          py: 0.5,
                                        }}
                                      >
                                        <Link size={14} style={{ color: '#9ca3af' }} />
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: '#6366f1',
                                            textDecoration: 'none',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer',
                                            '&:hover': {
                                              textDecoration: 'underline',
                                            },
                                          }}
                                          component="a"
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {url}
                                        </Typography>
                                      </Box>
                                    );
                                  })}
                                  {SocialMediaPlatforms.every((platform) => !item[platform.key]) && (
                                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                      No links configured
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Calendar size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {item.createdAt
                                      ? new Date(item.createdAt).toLocaleDateString()
                                      : item.created_at
                                      ? new Date(item.created_at).toLocaleDateString()
                                      : '-'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Calendar size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                    {item.updatedAt
                                      ? new Date(item.updatedAt).toLocaleDateString()
                                      : item.updated_at
                                      ? new Date(item.updated_at).toLocaleDateString()
                                      : '-'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Edit Entry" arrow>
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
                                  <Tooltip title="Delete Entry" arrow>
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

          {/* Add/Edit Social Media Dialog */}
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
                  <Share2 size={28} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {editingId ? 'Edit Social Media Links' : 'Add New Social Media Links'}
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
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Enter the full URLs for each social media platform. Leave empty if not applicable.
              </Alert>
              <Grid container spacing={3}>
                {SocialMediaPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  const value = form[platform.key];
                  const isValid = validateUrl(value);
                  
                  return (
                    <Grid item xs={12} key={platform.key}>
                      <TextField
                        fullWidth
                        label={`${platform.label} URL`}
                        value={value}
                        onChange={(e) => setForm({ ...form, [platform.key]: e.target.value })}
                        variant="outlined"
                        type="url"
                        placeholder={`https://${platform.label.toLowerCase()}.com/yourprofile`}
                        error={!isValid && value !== ''}
                        helperText={
                          !isValid && value !== ''
                            ? 'Please enter a valid URL'
                            : value
                            ? 'Valid URL'
                            : 'Optional'
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon sx={{ color: platform.color }} />
                            </InputAdornment>
                          ),
                          endAdornment: value && isValid && (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                component="a"
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: platform.color }}
                              >
                                <ExternalLink size={16} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: platform.color,
                            },
                          },
                        }}
                      />
                    </Grid>
                  );
                })}
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
                disabled={!isFormValid() || !hasAtLeastOneLink() || loading}
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
                {loading ? (
              <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    {editingId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
                  editingId ? 'Update Links' : 'Create Links'
            )}
          </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%', borderRadius: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Box>
  );
}
