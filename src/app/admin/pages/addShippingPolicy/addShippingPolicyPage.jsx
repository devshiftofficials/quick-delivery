'use client';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// MUI Imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Fade,
  Grow,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/system';
import { LocalShipping as ShippingIcon, Title as TitleIcon, Description as DescriptionIcon, Save as SaveIcon } from '@mui/icons-material';
import BeautifulLoader from '../../../components/BeautifulLoader';

// Dynamically import JoditEditor for SSR compatibility
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: true });

// Custom styled JoditEditor container to match MUI design
const JoditEditorWrapper = styled(Box)(({ theme }) => ({
  '& .jodit-container': {
    border: '1px solid #e0e0e0 !important',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    '& .jodit-toolbar__box': {
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: '#f9fafb',
      borderRadius: '12px 12px 0 0',
    },
    '& .jodit-status-bar': {
      borderTop: '1px solid #e0e0e0',
      backgroundColor: '#f9fafb',
      borderRadius: '0 0 12px 12px',
    },
    '& .jodit-workplace': {
      backgroundColor: '#ffffff',
    },
  },
}));

const ShippingPolicyPage = () => {
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    Title: '',
    description: '',
    Text: '',
  });
  const [shippingPolicy, setShippingPolicy] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchShippingPolicy() {
      try {
        const response = await axios.get('/api/shippingpolicy');
        if (Array.isArray(response.data) && response.data.length > 0) {
          const existingPolicy = response.data[0];
          setShippingPolicy(existingPolicy);
          setFormData({
            Title: existingPolicy.Title || '',
            description: existingPolicy.description || '',
            Text: existingPolicy.Text || '',
          });
          setEditorContent(existingPolicy.Text || '');
        }
      } catch (error) {
        console.error('Error fetching shipping policy:', error);
      } finally {
        setIsEditorReady(true);
      }
    }
    fetchShippingPolicy();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTextChange = (content) => {
    setEditorContent(content);
    setFormData({ ...formData, Text: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (shippingPolicy && shippingPolicy.id) {
        await axios.put(`/api/shippingpolicy/${shippingPolicy.id}`, formData, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        const response = await axios.post('/api/shippingpolicy', formData, {
          headers: { 'Content-Type': 'application/json' },
        });
        setShippingPolicy(response.data);
      }
      alert('Shipping policy saved successfully!');
    } catch (error) {
      console.error('Error saving shipping policy:', error);
      alert('Failed to save shipping policy.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', p: 4 }}>
      <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
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
                background: 'linear-gradient(135deg, #ff5900 0%, #e2552b 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Grow in timeout={600}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ShippingIcon sx={{ fontSize: 64, opacity: 0.9 }} />
                </Box>
              </Grow>
              <Grow in timeout={800}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  Shipping Policy Management
                </Typography>
              </Grow>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage and update your shipping policy content
        </Typography>
            </Box>

            {/* Form Content */}
            <CardContent sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          {/* Title */}
                <Grow in timeout={1000}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Title"
              name="Title"
              value={formData.Title}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TitleIcon sx={{ color: '#ff5900' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover': {
                            boxShadow: '0 2px 8px rgba(255, 89, 0, 0.15)',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 2px 8px rgba(255, 89, 0, 0.25)',
                          },
                        },
              }}
            />
          </Box>
                </Grow>

          {/* Description */}
                <Grow in timeout={1200}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon sx={{ color: '#ff5900' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover': {
                            boxShadow: '0 2px 8px rgba(255, 89, 0, 0.15)',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 2px 8px rgba(255, 89, 0, 0.25)',
                          },
                        },
              }}
            />
          </Box>
                </Grow>

                {/* Text Editor */}
                <Grow in timeout={1400}>
          <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
                      Content
            </Typography>
            {isEditorReady && (
              <JoditEditorWrapper>
                <JoditEditor
                  ref={editorRef}
                  value={editorContent}
                  onChange={handleTextChange}
                  config={{
                    readonly: false,
                    placeholder: 'Start writing your shipping policy...',
                    height: 400,
                  }}
                />
              </JoditEditorWrapper>
            )}
          </Box>
                </Grow>

          {/* Submit Button */}
                <Grow in timeout={1600}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
                    size="large"
            disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            sx={{
                      background: 'linear-gradient(135deg, #ff5900 0%, #e2552b 100%)',
              py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(255, 89, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e2552b 0%, #ff5900 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(255, 89, 0, 0.4)',
                      },
                      transition: 'all 0.3s ease',
            }}
          >
                    {isLoading ? 'Saving...' : (shippingPolicy ? 'Update Shipping Policy' : 'Save Shipping Policy')}
          </Button>
                </Grow>
        </form>
            </CardContent>
          </Card>
        </Fade>

        {/* Loading Overlay */}
        {isLoading && <BeautifulLoader message="Saving..." />}
      </Box>
    </Box>
  );
};

export default ShippingPolicyPage;
