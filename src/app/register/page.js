'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  CircularProgress, InputAdornment, IconButton, Fade, Grow,
  Alert, Snackbar, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import {
  Mail, Lock, User, Phone, MapPin, Eye, EyeOff,
  UserPlus, ShoppingBag, ArrowLeft
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phoneno: '', city: '', role: 'CUSTOMER', base64: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        // No token, stay on register page
        return;
      }

      try {
        // Decode the token to check if it's expired
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        
        // Check if token is expired
        if (decoded.exp && decoded.exp < currentTime) {
          // Token is expired, clear it and stay on register page
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('vendorId');
          return;
        }

        // Token is valid, redirect based on role
        const role = localStorage.getItem('role');
        if (role === 'ADMIN') router.push('/admin/pages/Main');
        else if (role === 'VENDOR') router.push('/vendor/pages/Main');
        else if (role === 'CUSTOMER') router.push('/');
      } catch (error) {
        // Token is invalid or malformed, clear it and stay on register page
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('vendorId');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && value !== '' && !/^[A-Za-z\s]*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+92')) value = '+92' + value.replace(/^0+/, '');
    setFormData((prev) => ({ ...prev, phoneno: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, base64: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (base64) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });
      const result = await response.json();
      if (response.ok) return result.image_url;
      throw new Error(result.error || 'Failed to upload image');
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+92\d{10}$/;
    if (!phoneRegex.test(formData.phoneno)) {
      toast.error('Phone number must be in the format +92xxxxxxxxxx with exactly 10 digits.');
      return;
    }

    // Validate role
    if (!formData.role || (formData.role !== 'CUSTOMER' && formData.role !== 'VENDOR')) {
      toast.error('Please select a valid account type.');
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = '';
      if (formData.base64) {
        try {
          uploadedImageUrl = await uploadImage(formData.base64);
        } catch (imageError) {
          console.error('Image upload error:', imageError);
          // Continue without image if upload fails
          uploadedImageUrl = '';
        }
      }
      
      const formDataToSend = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phoneno: formData.phoneno.trim(),
        city: formData.city.trim(),
        role: formData.role, // Ensure role is CUSTOMER or VENDOR
        imageUrl: uploadedImageUrl || null,
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();
      
      if (response.ok && data.status) {
        const successMessage = formData.role === 'VENDOR' 
          ? 'Vendor account created successfully! Please check your email to verify your account.'
          : 'Registration successful! Please check your email to verify your account.';
        
        setSnackbar({ open: true, message: successMessage, severity: 'success' });
        toast.success(successMessage);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const errorMsg = data.message || 'Failed to register. Please try again.';
        setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      const errorMsg = error.message || 'An unexpected error occurred. Please try again.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
      backgroundSize: '400% 400%', animation: 'gradient 15s ease infinite',
      position: 'relative', overflow: 'hidden', py: 4,
      '@keyframes gradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
    }}>
      <Fade in timeout={800}>
        <Card sx={{
          width: '100%', maxWidth: 500, borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          },
        }}>
          <CardContent sx={{ p: 4 }}>
            <Grow in timeout={1000}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Button startIcon={<ArrowLeft size={20} />} onClick={() => router.push('/login')}
                  sx={{ position: 'absolute', top: 16, left: 16, color: '#64748b', textTransform: 'none',
                    '&:hover': { background: 'rgba(99, 102, 241, 0.1)' },
                  }}>Back to Login</Button>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)', mb: 2,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.05)' } },
                }}>
                  <UserPlus size={40} color="white" strokeWidth={2.5} />
                </Box>
                <Typography variant="h4" sx={{
                  fontWeight: 800, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  mb: 1, letterSpacing: 0.5,
                }}>Create Account</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Register as Customer or Vendor
                </Typography>
              </Box>
            </Grow>
            <form onSubmit={handleSubmit}>
              <Grow in timeout={1200}>
                <Box>
                  <FormControl fullWidth sx={{ mb: 2.5 }}>
                    <InputLabel>Account Type</InputLabel>
                    <Select name="role" value={formData.role} onChange={handleChange} label="Account Type" required
                      sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1', borderWidth: 2 },
                      }}>
                      <MenuItem value="CUSTOMER">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <User size={18} style={{ color: '#ec4899' }} />
                          <Typography>Customer</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="VENDOR">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ShoppingBag size={18} style={{ color: '#8b5cf6' }} />
                          <Typography>Vendor</Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange}
                    fullWidth required sx={{ mb: 2.5 }}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><User size={20} style={{ color: '#6366f1' }} /></InputAdornment>) }}
                  />
                  <TextField label="Email Address" type="email" name="email" value={formData.email}
                    onChange={handleChange} fullWidth required sx={{ mb: 2.5 }}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><Mail size={20} style={{ color: '#6366f1' }} /></InputAdornment>) }}
                  />
                  <TextField label="Password" type={showPassword ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleChange} fullWidth required sx={{ mb: 2.5 }}
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><Lock size={20} style={{ color: '#6366f1' }} /></InputAdornment>),
                      endAdornment: (<InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>),
                    }}
                  />
                  <TextField label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    fullWidth required sx={{ mb: 2.5 }}
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><Lock size={20} style={{ color: '#6366f1' }} /></InputAdornment>),
                      endAdornment: (<InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>),
                    }}
                  />
                  <TextField label="Phone Number" name="phoneno" value={formData.phoneno}
                    onChange={handlePhoneChange} fullWidth required placeholder="+92xxxxxxxxxx" sx={{ mb: 2.5 }}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><Phone size={20} style={{ color: '#6366f1' }} /></InputAdornment>) }}
                  />
                  <TextField label="City/Address" name="city" value={formData.city} onChange={handleChange}
                    fullWidth required sx={{ mb: 2.5 }}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><MapPin size={20} style={{ color: '#6366f1' }} /></InputAdornment>) }}
                  />
                  <input accept="image/*" style={{ display: 'none' }} id="image-upload" type="file" onChange={handleImageChange} />
                  <label htmlFor="image-upload">
                    <Button component="span" variant="outlined" fullWidth sx={{
                      mb: 3, py: 1.5, borderColor: '#6366f1', color: '#6366f1', textTransform: 'none',
                      '&:hover': { borderColor: '#8b5cf6', background: 'rgba(99, 102, 241, 0.05)' },
                    }}>
                      {formData.base64 ? 'Image Selected ' : 'Upload Profile Image (Optional)'}
                    </Button>
                  </label>
                  <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{
                    py: 1.5, borderRadius: 2, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)', fontSize: '1rem', fontWeight: 600,
                    textTransform: 'none', mb: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)', transform: 'translateY(-2px)',
                    },
                    '&:disabled': { opacity: 0.7 },
                  }}>
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                        <Typography>Creating Account...</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserPlus size={20} />
                        <Typography>Create Account</Typography>
                      </Box>
                    )}
                  </Button>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Already have an account?{' '}
                      <Button onClick={() => router.push('/login')} sx={{
                        color: '#6366f1', textTransform: 'none', fontWeight: 600, p: 0, minWidth: 'auto',
                        '&:hover': { background: 'transparent', textDecoration: 'underline' },
                      }}>Sign In</Button>
                    </Typography>
                  </Box>
                </Box>
              </Grow>
            </form>
          </CardContent>
        </Card>
      </Fade>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{
          width: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ToastContainer />
    </Box>
  );
};

export default RegisterPage;
