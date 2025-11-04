'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import TopCategories from './customer/components/TopCategories';
import Slider from './customer/components/Carousel';
import Customerlayout from './customer/layout';

const Products = dynamic(() => import('./customer/components/Products'), { ssr: true });
const Features = dynamic(() => import('./customer/components/Features'), { ssr: true });
const FaqSection = dynamic(() => import('./customer/components/FaqSection'), { ssr: false });
const AllProducts = dynamic(() => import('./customer/components/AllProducts'), { ssr: true });
const NewArrivals = dynamic(() => import('./customer/components/NewArrivals'), { ssr: true });

export default function CustomerPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const authToken = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (token || authToken) {
      // Redirect based on role
      if (role === 'ADMIN') {
        router.push('/admin/pages/Main');
        return;
      } else if (role === 'VENDOR') {
        router.push('/vendor/pages/Main');
        return;
      }
      // CUSTOMER role continues to show this page
    }
    setIsChecking(false);
  }, [router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <p style={{ color: 'white', fontSize: '1.1rem' }}>Loading...</p>
      </div>
    );
  }

  return (
    <Customerlayout>
      <div>
        <Slider/>
        <main className="p-4">
          <TopCategories/>
          <AllProducts/>
          <Products/>
          <Features/>
          <NewArrivals/>
          <FaqSection/>
        </main>
      </div>
    </Customerlayout>
  );
};
