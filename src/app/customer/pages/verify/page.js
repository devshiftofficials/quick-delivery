'use client';
// src/app/customer/pages/verify/page.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BeautifulLoader from '../../../components/BeautifulLoader';
import { Box, Typography, Card, CardContent, Fade, Grow } from '@mui/material';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // 'success', 'error', or null
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    let isRequestSent = false;

    async function verifyEmail() {
      if (isRequestSent) return; // Prevents multiple requests
      isRequestSent = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setStatus('error');
          setMessage('No verification token provided');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          toast.success(data.message || 'Email verified successfully!');
          setTimeout(() => {
            router.push('/login');
          }, 3000); // Redirect to login after 3 seconds
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
          toast.error(data.error || 'Verification failed');
        }
        setLoading(false);
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification');
        setLoading(false);
        toast.error('An error occurred during verification');
      }
    }

    verifyEmail();
  }, [router]);

  if (loading) {
    return <BeautifulLoader message="Verifying your email..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        p: 3,
      }}
    >
      <ToastContainer />
      <Fade in timeout={800}>
        <Card
          sx={{
            maxWidth: 500,
            width: '100%',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Grow in timeout={1000}>
              <Box>
                {status === 'success' ? (
                  <>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                        mb: 3,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.05)' },
                        },
                      }}
                    >
                      <CheckCircle2 size={50} color="white" strokeWidth={2.5} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2,
                      }}
                    >
                      Email Verified!
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                      {message}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                      Redirecting to login page...
                    </Typography>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
                        mb: 3,
                      }}
                    >
                      <XCircle size={50} color="white" strokeWidth={2.5} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2,
                      }}
                    >
                      Verification Failed
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                      {message}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                      Please try again or contact support.
                    </Typography>
                  </>
                )}
              </Box>
            </Grow>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
