'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Fade,
  Grow,
  Alert,
  Grid,
} from '@mui/material';
import { ContactMail as ContactIcon, Send as SendIcon } from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [contactUsData, setContactUsData] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Your message has been sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchContactUs = async () => {
      try {
        const response = await axios.get('/api/contactus');
        if (response.data && response.data.length > 0) {
          setContactUsData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching Contact Us data:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContactUs();
  }, []);

  return (
        <>
          <Head>
        <title>Contact Us - QuickDelivery</title>
          </Head>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f5f7fa',
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Grid container spacing={4}>
            {/* Contact Information */}
            {contactUsData && (
              <Grid item xs={12} md={6}>
                <Fade in timeout={800}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      bgcolor: 'white',
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        p: 4,
                        textAlign: 'center',
                      }}
                    >
                      <Grow in timeout={600}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <ContactIcon sx={{ fontSize: 64, opacity: 0.9 }} />
                        </Box>
                      </Grow>
                      <Grow in timeout={800}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                          {contactUsData.Title}
                        </Typography>
                      </Grow>
                    </Box>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Fade in timeout={1000}>
                        <Box
                          sx={{
                            '& p': { mb: 2, lineHeight: 1.8, color: '#374151' },
                            '& h1, & h2, & h3': { color: '#1f2937', fontWeight: 700, mb: 2, mt: 3 },
                            '& a': { color: '#667eea', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
                          }}
                          dangerouslySetInnerHTML={{ __html: contactUsData.Text }}
                        />
                      </Fade>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            )}

            {/* Contact Form */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    bgcolor: 'white',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      p: 3,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Send us a Message
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    {success && (
                      <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                      </Alert>
                    )}
                    {error && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                      </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                        sx={{ mb: 3 }}
                        variant="outlined"
              />
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                        sx={{ mb: 3 }}
                        variant="outlined"
              />
                      <TextField
                        fullWidth
                        label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                        multiline
                        rows={6}
                        sx={{ mb: 3 }}
                        variant="outlined"
                      />
                      <Button
              type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
              disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
            >
              {loading ? 'Sending...' : 'Send Message'}
                      </Button>
          </form>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Contact;
