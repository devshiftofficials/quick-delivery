'use client';
import { Box, Typography, CircularProgress, Slide } from '@mui/material';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const LoadingDialog = ({ 
  open = false, 
  message = 'Processing...', 
  type = 'loading' // 'loading', 'success', 'error'
}) => {
  if (!open) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={24} color="#22c55e" />;
      case 'error':
        return <XCircle size={24} color="#ef4444" />;
      default:
        return (
          <Box
            sx={{
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          >
            <Loader2 size={24} style={{ color: '#6366f1' }} />
          </Box>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(34, 197, 94, 0.1)';
      case 'error':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(99, 102, 241, 0.1)';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(34, 197, 94, 0.2)';
      case 'error':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'rgba(99, 102, 241, 0.2)';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return '#22c55e';
      case 'error':
        return '#ef4444';
      default:
        return '#6366f1';
    }
  };

  return (
    <>
      {/* Blurred Background Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          transition: 'opacity 0.3s ease',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Loading Dialog from Right */}
      <Slide direction="left" in={open} timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            top: 80,
            right: 24,
            zIndex: 9999,
            minWidth: 320,
            maxWidth: 400,
            background: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${getBorderColor()}`,
            overflow: 'hidden',
            animation: 'slideInRight 0.3s ease-out',
            '@keyframes slideInRight': {
              '0%': {
                transform: 'translateX(100%)',
                opacity: 0,
              },
              '100%': {
                transform: 'translateX(0)',
                opacity: 1,
              },
            },
          }}
        >
          {/* Colored Top Border */}
          <Box
            sx={{
              height: 4,
              background: type === 'success' 
                ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
                : type === 'error'
                ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            }}
          />

          {/* Content */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 3,
              background: getBackgroundColor(),
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 2,
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {type === 'loading' ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: '#6366f1',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }} 
                />
              ) : (
                getIcon()
              )}
            </Box>

            {/* Message */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: '#1e293b',
                  fontSize: '0.95rem',
                  mb: 0.5,
                }}
              >
                {message}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748b',
                  fontSize: '0.8rem',
                }}
              >
                {type === 'loading' 
                  ? 'Please wait...' 
                  : type === 'success'
                  ? 'Operation completed successfully'
                  : 'An error occurred'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Slide>
    </>
  );
};

export default LoadingDialog;

