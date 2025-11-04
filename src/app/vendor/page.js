'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const VendorLoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'VENDOR') {
      router.push('/vendor/pages/Main');
    } else {
      // Redirect to unified login page
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <p style={{ color: 'white', fontSize: '1.1rem' }}>Redirecting...</p>
    </div>
  );
};

export default VendorLoginPage;

