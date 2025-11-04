'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Fade,
  Grow,
  Tooltip,
  InputAdornment,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
// Lucide Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Shield,
  Building2,
  Badge,
  Mail,
  User,
  Calendar,
} from 'lucide-react';
import BeautifulLoader from '../../../components/BeautifulLoader';

const FilterableTable = ({ data, fetchData }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newItem, setNewItem] = useState({
    id: null,
    name: '',
    branch: '',
    role: '',
    email: '',
    password: '',
  });
  const [branches, setBranches] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter data based on search input
  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setPage(0);
  }, [filter, data]);

  // Fetch branches for the dropdown
  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      const result = await response.json();
      setBranches(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches([]);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setNewItem({ ...item, password: '' }); // Don't show password when editing
    } else {
      setNewItem({
        id: null,
        name: '',
        branch: '',
        role: '',
        email: '',
        password: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setNewItem({
      id: null,
      name: '',
      branch: '',
      role: '',
      email: '',
      password: '',
    });
  };

  // Handle adding or updating an item
  const handleAddorUpdateItem = async () => {
    if (!newItem.name || !newItem.email || !newItem.role || !newItem.branch) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error',
      });
      return;
    }

    if (!newItem.id && !newItem.password) {
      setSnackbar({
        open: true,
        message: 'Password is required for new admin users',
        severity: 'error',
      });
      return;
    }

    setIsLoading(true);
    const method = newItem.id ? 'PUT' : 'POST';
    const url = newItem.id ? `/api/admin/${newItem.id}` : '/api/admin';

    try {
      const body = newItem.id
        ? { name: newItem.name, branch: newItem.branch, role: newItem.role, email: newItem.email, ...(newItem.password && { password: newItem.password }) }
        : newItem;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbar({
          open: true,
          message: newItem.id ? 'Admin user updated successfully!' : 'Admin user created successfully!',
          severity: 'success',
        });
        fetchData();
        handleClose();
      } else {
        throw new Error(result.error || 'Failed to save admin user');
      }
    } catch (error) {
      console.error('Error saving admin user:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin user?')) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Admin user deleted successfully!',
          severity: 'success',
        });
        fetchData();
      } else {
        throw new Error(result.error || 'Failed to delete admin user');
      }
    } catch (error) {
      console.error('Error deleting admin user:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'super admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'employee':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', p: 3 }}>
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
                      <Shield size={36} />
                      Admin Users Management
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manage admin users, roles, and permissions
                    </Typography>
                  </Box>
                  <Tooltip title="Add New Admin User" arrow>
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
                  placeholder="Search admin users by name, email, role, branch..."
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

          {/* Admin Users Table Card */}
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
                    Showing {paginatedData.length} of {filteredData.length} admin users
                    {filter && ` matching "${filter}"`}
                  </Typography>
                  {filteredData.length !== data.length && (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {data.length - filteredData.length} filtered out
                    </Typography>
                  )}
                </Box>

                {/* Admin Users Table */}
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
                        <TableCell>Name</TableCell>
                        <TableCell>Branch</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Email</TableCell>
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
                              <Shield size={64} style={{ color: '#9ca3af' }} />
                              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No admin users found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                {filter ? 'Try adjusting your search' : 'Add your first admin user to get started'}
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <User size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {item.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Building2 size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="body2">{item.branch || '-'}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={item.role || 'N/A'}
                                  size="small"
                                  color={getRoleColor(item.role)}
                                  icon={<Badge size={16} />}
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Mail size={16} style={{ color: '#9ca3af' }} />
                                  <Typography variant="body2">{item.email}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip title="Edit Admin User" arrow>
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
                                  <Tooltip title="Delete Admin User" arrow>
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

          {/* Add/Edit Admin User Dialog */}
          <Dialog
            open={isModalOpen}
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
                  <Shield size={28} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {newItem.id ? 'Edit Admin User' : 'Add New Admin User'}
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
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Name *"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} style={{ color: '#6366f1' }} />
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
                <FormControl fullWidth>
                  <InputLabel>Branch *</InputLabel>
                  <Select
                    value={newItem.branch}
                    onChange={(e) => setNewItem({ ...newItem, branch: e.target.value })}
                    label="Branch *"
                    startAdornment={
                      <InputAdornment position="start">
                        <Building2 size={20} style={{ color: '#6366f1', marginLeft: '8px' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6366f1',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>Select Branch</MenuItem>
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.title}>
                        {branch.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Role *</InputLabel>
                  <Select
                    value={newItem.role}
                    onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
                    label="Role *"
                    startAdornment={
                      <InputAdornment position="start">
                        <Badge size={20} style={{ color: '#6366f1', marginLeft: '8px' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6366f1',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>Select Role</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="super admin">Super Admin</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={newItem.email}
                  onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
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
                <TextField
                  fullWidth
                  label={newItem.id ? 'New Password (leave empty to keep current)' : 'Password *'}
                  type="password"
                  value={newItem.password}
                  onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                  variant="outlined"
                  required={!newItem.id}
                  sx={{
                    gridColumn: { xs: '1 / -1', md: '1 / -1' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6366f1',
                      },
                    },
                  }}
                />
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
                onClick={handleAddorUpdateItem}
                variant="contained"
                disabled={isLoading || !newItem.name || !newItem.email || !newItem.role || !newItem.branch || (!newItem.id && !newItem.password)}
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
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    {newItem.id ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  newItem.id ? 'Update User' : 'Create User'
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
};

export default FilterableTable;
