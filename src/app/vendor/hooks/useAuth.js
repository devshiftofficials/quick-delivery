'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Run once on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // optional: store user info

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.warn('Failed to parse user from localStorage');
        }
      }
    } else {
      // No token → redirect to login
      router.push('/admin');
    }

    setLoading(false);
  }, [router]);

  // Optional: expose login/logout helpers
  const login = (newToken, userData = null) => {
    localStorage.setItem('token', newToken);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/admin');
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
  };
};

export default useAuth;