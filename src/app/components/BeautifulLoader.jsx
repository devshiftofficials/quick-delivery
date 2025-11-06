'use client';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Fade, Zoom, Slide } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, ShoppingBag } from 'lucide-react';

const BeautifulLoader = ({ 
  message = 'Loading...', 
  fullScreen = true,
  showDebug = false,
  debugMessages = []
}) => {
  return (
    <Box
      sx={{
        position: fullScreen ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Blurred Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </Box>

      {/* Main Loader Content */}
      <Fade in timeout={600}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Logo Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)',
                position: 'relative',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <ShoppingBag className="w-10 h-10 text-white" strokeWidth={2.5} />
              </motion.div>
              
              {/* Pulsing ring */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: '50%',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            </Box>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                letterSpacing: 1,
                mb: 1,
              }}
            >
              {message}
            </Typography>
            
            {/* Animated dots */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </Box>
          </motion.div>

          {/* Sparkle Icons */}
          <Box sx={{ position: 'relative', width: 200, height: 20, mt: 2 }}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${i * 25}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles 
                  className="w-4 h-4 text-indigo-400" 
                  style={{ filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.6))' }}
                />
              </motion.div>
            ))}
          </Box>
        </Box>
      </Fade>

      {/* Debug Panel - Left Side */}
      <AnimatePresence>
        {showDebug && (
          <Slide direction="right" in={showDebug} timeout={400}>
            <Paper
              elevation={8}
              sx={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: { xs: '280px', sm: '320px' },
                maxWidth: '90vw',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(99, 102, 241, 0.1)',
                boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
                zIndex: 10000,
                p: 3,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {/* Debug Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  pb: 2,
                  borderBottom: '2px solid rgba(99, 102, 241, 0.1)',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Loader2 className="w-5 h-5 text-white" />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1rem',
                    }}
                  >
                    Debug Panel
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Loading Status
                  </Typography>
                </Box>
              </Box>

              {/* Debug Messages */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {debugMessages.length > 0 ? (
                  debugMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                          border: '1px solid rgba(99, 102, 241, 0.1)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={msg.type || 'INFO'}
                            size="small"
                            sx={{
                              background: msg.type === 'ERROR' 
                                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                : msg.type === 'SUCCESS'
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
                            {new Date().toLocaleTimeString()}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#1e293b',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                          }}
                        >
                          {msg.message}
                        </Typography>
                      </Paper>
                    </motion.div>
                  ))
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      color: '#94a3b8',
                    }}
                  >
                    <Typography variant="body2">No debug messages</Typography>
                  </Box>
                )}
              </Box>

              {/* Debug Footer */}
              <Box
                sx={{
                  pt: 2,
                  borderTop: '1px solid rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.7, transform: 'scale(1.2)' },
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  System Active
                </Typography>
              </Box>
            </Paper>
          </Slide>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default BeautifulLoader;
