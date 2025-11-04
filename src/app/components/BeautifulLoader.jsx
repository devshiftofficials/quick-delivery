'use client';
import { Box, Typography } from '@mui/material';
import { Fade, Zoom } from '@mui/material';

const BeautifulLoader = ({ message = 'Loading...', fullScreen = true }) => {
  return (
    <Box
      sx={{
        position: fullScreen ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        background: fullScreen
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)'
          : 'transparent',
        backgroundSize: fullScreen ? '400% 400%' : 'auto',
        animation: fullScreen ? 'gradient 15s ease infinite' : 'none',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      {/* Animated Background Elements */}
      {fullScreen && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              animation: 'float 6s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                '50%': { transform: 'translateY(-20px) translateX(20px)' },
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              animation: 'float 8s ease-in-out infinite 2s',
            }}
          />
        </>
      )}

      {/* Main Loading Content */}
      <Fade in timeout={800}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Animated Spinner */}
          <Zoom in timeout={1000}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Outer rotating ring */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '4px solid #6366f1',
                  borderRight: '4px solid #8b5cf6',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              {/* Inner pulsing circle */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.2)', opacity: 0.7 },
                  },
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                }}
              />
            </Box>
          </Zoom>

          {/* Loading Text */}
          <Fade in timeout={1500}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: fullScreen
                    ? 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)'
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: '1.5rem',
                  letterSpacing: 1,
                }}
              >
                {message}
              </Typography>
              {/* Animated dots */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  justifyContent: 'center',
                  mt: 1,
                }}
              >
                {[0, 1, 2].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: fullScreen ? 'rgba(255, 255, 255, 0.8)' : '#6366f1',
                      animation: `bounce 1.4s ease-in-out infinite ${index * 0.2}s`,
                      '@keyframes bounce': {
                        '0%, 80%, 100%': { transform: 'scale(0)', opacity: 0.5 },
                        '40%': { transform: 'scale(1)', opacity: 1 },
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Fade>
        </Box>
      </Fade>
    </Box>
  );
};

export default BeautifulLoader;

