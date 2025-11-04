'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to unified login page
export default function CustomerLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <p style={{ color: 'white', fontSize: '1.1rem' }}>Redirecting to login page...</p>
    </div>
  );
}