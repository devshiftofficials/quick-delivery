'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Fade,
  Grow,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Help as HelpIcon } from '@mui/icons-material';
import axios from 'axios';

const FaqSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('/api/faq');
        setFaqs(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
          {faqs.map((faq, index) => (
        <Grow in timeout={(index + 1) * 100} key={faq.id}>
          <Accordion
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:before': { display: 'none' },
              '&.Mui-expanded': {
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)',
              },
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.15)',
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: '#667eea', fontSize: 28 }} />
              }
              sx={{
                bgcolor: '#f9fafb',
                borderRadius: 2,
                px: 3,
                py: 2,
                '&.Mui-expanded': {
                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                },
              }}
              >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <HelpIcon sx={{ color: '#667eea', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {faq.question}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, py: 3 }}>
              <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grow>
      ))}
    </Box>
  );
};

export default FaqSection;
