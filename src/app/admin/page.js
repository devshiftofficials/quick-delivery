'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /admin to /login for login page
export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
