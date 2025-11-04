'use client';
import React from 'react';
import Head from 'next/head';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Fade,
  Grow,
  Grid,
} from '@mui/material';
import { QuestionAnswer as FaqIcon, Business as BusinessIcon, SupportAgent as SupportIcon } from '@mui/icons-material';
import FaqSection from '../../components/FaqSection';

const FAQ = () => {
  return (
    <>
      <Head>
        <title>FAQ - QuickDelivery</title>
        <meta
          name="description"
          content="Frequently Asked Questions about QuickDelivery.ca. Learn more about our services, policies, and how we can help you."
        />
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
          {/* Header */}
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Grow in timeout={600}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <FaqIcon sx={{ fontSize: 64, color: '#667eea' }} />
                </Box>
              </Grow>
              <Grow in timeout={800}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  Frequently Asked Questions
                </Typography>
              </Grow>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                Find answers to your questions about QuickDelivery
              </Typography>
            </Box>
          </Fade>

          {/* FAQ Accordion */}
          <Fade in timeout={1000}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                bgcolor: 'white',
                mb: 4,
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <FaqSection />
              </CardContent>
            </Card>
          </Fade>

          {/* Additional Information Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Grow in timeout={1200}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    bgcolor: 'white',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <BusinessIcon sx={{ fontSize: 48, color: '#667eea' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#1f2937' }}>
                      About QuickDelivery
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', lineHeight: 1.8, textAlign: 'center' }}>
                      QuickDelivery is your one-stop online shopping destination. We offer a wide range of products
                      at competitive prices, ensuring you find exactly what you're looking for.
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            <Grid item xs={12} md={4}>
              <Grow in timeout={1400}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    bgcolor: 'white',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <SupportIcon sx={{ fontSize: 48, color: '#667eea' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#1f2937' }}>
                      Our Services
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', lineHeight: 1.8, textAlign: 'center' }}>
                      We provide exceptional customer service, free shipping on eligible orders, easy returns, and secure
                      payment options for your convenience.
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            <Grid item xs={12} md={4}>
              <Grow in timeout={1600}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    bgcolor: 'white',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <SupportIcon sx={{ fontSize: 48, color: '#667eea' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#1f2937' }}>
                      Contact Us
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', lineHeight: 1.8, textAlign: 'center', mb: 2 }}>
                      Need further assistance? Reach out to our customer support team.
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 600 }}>
                        Email: info@QuickDelivery.com
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 600 }}>
                        Phone: +923476781946
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default FAQ;
