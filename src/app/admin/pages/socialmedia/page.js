'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import FilterableSocialMediaTable from './FilterableSocialMediaTable';

export default function SocialMediaPage() {
  const [loading, setLoading] = useState(true);
  const [socialMedia, setSocialMedia] = useState([]);

  const fetchSocialMedia = async () => {
    try {
      const res = await fetch('/api/socialmedia');
      const json = await res.json();
      if (json.status) {
        setSocialMedia(Array.isArray(json.data) ? json.data : [json.data]);
      } else {
        setSocialMedia([]);
      }
    } catch (error) {
      console.error('Error fetching social media:', error);
      setSocialMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'white',
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: '#ff5900' }} />
        <Typography variant="h6" sx={{ color: '#ff5900', fontWeight: 600 }}>
          Loading Social Media...
        </Typography>
      </Box>
    );
  }

  return (
    <FilterableSocialMediaTable
      socialMedia={socialMedia}
      fetchSocialMedia={fetchSocialMedia}
    />
  );
}
