'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FilterableSocialMediaTable from './FilterableSocialMediaTable';
import PageLoader from '../../../components/PageLoader';

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
    return <PageLoader message="Loading Social Media..." />;
  }

  return (
    <FilterableSocialMediaTable
      socialMedia={socialMedia}
      fetchSocialMedia={fetchSocialMedia}
    />
  );
}
