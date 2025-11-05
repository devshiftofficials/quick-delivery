'use client';

import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';

export default function VendorRootLayout({ children }) {
  return (
    <Box 
      sx={{ 
        bgcolor: '#f8fafc',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Header - Fixed position */}
      <Header />
      
      {/* Main content area */}
      <Box
        sx={{
          ml: '270px', // Match sidebar width
          width: 'calc(100% - 270px)',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          component="main"
          sx={{
            bgcolor: '#f8fafc',
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            pt: '64px', // Padding for fixed header
            pb: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
