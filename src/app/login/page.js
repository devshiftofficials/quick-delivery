'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// MUI Imports
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Grow,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';

// Lucide Icons
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  Shield,
  ShoppingBag,
  User,
  UserPlus,
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const authToken = localStorage.getItem('authToken');
    if (token || authToken) {
      const userRole = localStorage.getItem('role');
      if (userRole === 'ADMIN') {
        router.push('/admin/pages/Main');
      } else if (userRole === 'VENDOR') {
        router.push('/vendor/pages/Main');
      } else if (userRole === 'CUSTOMER') {
        router.push('/');
      }
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token - use 'token' for admin/vendor, 'authToken' for customer
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        
        if (user.vendorId) {
          localStorage.setItem('vendorId', user.vendorId);
        }

        setSnackbar({
          open: true,
          message: 'Login successful! Redirecting...',
          severity: 'success',
        });

        // Redirect based on role
        setTimeout(() => {
          if (user.role === 'ADMIN') {
            router.push('/admin/pages/Main');
          } else if (user.role === 'VENDOR') {
            router.push('/vendor/pages/Main');
          } else if (user.role === 'CUSTOMER') {
            router.push('/');
          } else {
            setError('Unknown role. Please contact support.');
          }
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to log in. Please try again.');
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to log in. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      const errorMessage = error.response?.data?.message || 'Failed to log in. Please check your credentials and try again.';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        position: 'relative',
        overflow: 'hidden',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: 'translateY(-20px) translateX(20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          animation: 'float 8s ease-in-out infinite 2s',
        }}
      />

      <Fade in timeout={800}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 450,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Grow in timeout={1000}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                    mb: 2,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }}
                >
                  <LogIn size={40} color="white" strokeWidth={2.5} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    letterSpacing: 0.5,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Sign in to your account to continue
                </Typography>
              </Box>
            </Grow>

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#ef4444',
                  },
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <Grow in timeout={1200}>
                <Box>
                  {/* Email Field */}
                  <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                    sx={{
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: '#f8fafc',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#f1f5f9',
                        },
                        '&.Mui-focused': {
                          background: 'white',
                          boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                        },
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#6366f1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6366f1',
                          borderWidth: 2,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={20} style={{ color: '#6366f1' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Password Field */}
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: '#f8fafc',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#f1f5f9',
                        },
                        '&.Mui-focused': {
                          background: 'white',
                          boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                        },
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#6366f1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6366f1',
                          borderWidth: 2,
                        },
                      },
                    }}
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
                            sx={{ color: '#64748b' }}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      mb: 2,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        opacity: 0.7,
                      },
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                        <Typography>Signing in...</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LogIn size={20} />
                        <Typography>Sign In</Typography>
                      </Box>
                    )}
                  </Button>

                  {/* Register Button */}
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    onClick={handleRegister}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#6366f1',
                      color: '#6366f1',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#8b5cf6',
                        color: '#8b5cf6',
                        background: 'rgba(99, 102, 241, 0.05)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UserPlus size={20} />
                      <Typography>Create New Account</Typography>
                    </Box>
                  </Button>
                </Box>
              </Grow>
            </form>

            {/* Footer Info */}
            <Grow in timeout={1400}>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Works for Admin, Vendor & Customer
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Shield size={16} style={{ color: '#6366f1' }} />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Admin
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ShoppingBag size={16} style={{ color: '#8b5cf6' }} />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Vendor
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} style={{ color: '#ec4899' }} />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Customer
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grow>
          </CardContent>
        </Card>
      </Fade>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;

