'use client';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Fade } from '@mui/material';

const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#ffffff',
        zIndex: 10000,
      }}
    >
      <Fade in timeout={400}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Simple Circular Progress */}
          <CircularProgress 
            size={48} 
            thickness={4}
            sx={{ 
              color: '#6366f1',
            }} 
          />

          {/* Loading Text */}
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontWeight: 500,
              fontSize: '0.95rem',
              letterSpacing: '0.5px',
            }}
          >
            {message}
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default PageLoader;
