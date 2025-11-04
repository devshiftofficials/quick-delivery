'use client'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress, Fade, Grow, Avatar } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get('/api/aboutus');
        if (response.data && response.data.length > 0) {
          setAboutData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching About Us data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f7fa',
        }}
      >
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <>
      {aboutData && (
        <>
      <Head>
            <title>{aboutData.Title} - QuickDelivery</title>
            <meta name="description" content={aboutData.description} />
      </Head>
          <Box
            sx={{
              minHeight: '100vh',
              bgcolor: '#f5f7fa',
              py: { xs: 4, md: 6 },
              px: { xs: 2, md: 4 },
            }}
          >
            <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
              <Fade in timeout={800}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    bgcolor: 'white',
                  }}
                >
                  {/* Header */}
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
                        <InfoIcon sx={{ fontSize: 64, opacity: 0.9 }} />
                      </Box>
                    </Grow>
                    <Grow in timeout={800}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                        {aboutData.Title}
                      </Typography>
                    </Grow>
                    {aboutData.description && (
                      <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                        {aboutData.description}
                      </Typography>
                    )}
                  </Box>

                  {/* Content */}
                  <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <Fade in timeout={1000}>
                      <Box
                        sx={{
                          '& p': { mb: 2, lineHeight: 1.8, color: '#374151' },
                          '& h1, & h2, & h3': { color: '#1f2937', fontWeight: 700, mb: 2, mt: 3 },
                          '& ul, & ol': { pl: 3, mb: 2 },
                          '& li': { mb: 1, lineHeight: 1.8 },
                          '& a': { color: '#667eea', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
                          '& strong': { color: '#1f2937', fontWeight: 600 },
                        }}
                        dangerouslySetInnerHTML={{ __html: aboutData.Text }}
                      />
                    </Fade>
                  </CardContent>
                </Card>
              </Fade>
            </Box>
          </Box>
        </>
      )}
      {!loading && !aboutData && (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f7fa',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading About Us content...
          </Typography>
        </Box>
      )}
    </>
  );
};

export default About;
