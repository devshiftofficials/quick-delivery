'use client';

import React, { useEffect, useState } from 'react';
import { FiChevronRight, FiFacebook, FiInstagram, FiPhone, FiMail } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, Gift, ShoppingBag } from 'lucide-react';

const TopBar = () => {
  const router = useRouter();
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
  });
  const [loading, setLoading] = useState(true);
  const [companyDetails, setCompanyDetails] = useState({ phone: '', email: '' });

  const fetchSocialMediaLinks = async () => {
    try {
      const response = await fetch(`/api/socialfirstrecodlink/2`);
      const data = await response.json();
      console.log('Response of social media links:', data);
      if (data.status) {
        setSocialMediaLinks(data.data);
      } else {
        console.error('Failed to fetch social media links');
      }
    } catch (error) {
      console.error('Error fetching social media links:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      const response = await fetch('/api/companydetails');
      const data = await response.json();
      if (data) {
        setCompanyDetails({
          phone: data.phone || '',
          email: data.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const animationControls = useAnimation();

  useEffect(() => {
    fetchSocialMediaLinks();
    fetchCompanyDetails();
    startAnimation();
  }, [router]);

  const startAnimation = () => {
    animationControls.start({
      x: '-100%',
      transition: {
        duration: 30,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
        onRepeat: () => {
          animationControls.set({ x: '100%' });
        },
      },
    });
  };

  const handleViewDetailsClick = () => {
    router.push('/customer/pages/discounted-products');
  };

  const promoMessages = [
    { icon: Gift, text: 'Get great devices up to 50% off', color: 'from-pink-500 to-rose-500' },
    { icon: TrendingUp, text: 'New arrivals every week', color: 'from-indigo-500 to-purple-500' },
    { icon: ShoppingBag, text: 'Free shipping on orders over $50', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-2.5 md:py-3 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          {/* Left Section - Contact & Links */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm">
            {/* Contact Info */}
            {companyDetails.phone && (
              <motion.a
                href={`tel:${companyDetails.phone}`}
                className="flex items-center gap-1.5 hover:text-indigo-200 transition-colors duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPhone className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline">{companyDetails.phone}</span>
              </motion.a>
            )}
            {companyDetails.email && (
              <motion.a
                href={`mailto:${companyDetails.email}`}
                className="flex items-center gap-1.5 hover:text-indigo-200 transition-colors duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMail className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline">{companyDetails.email}</span>
              </motion.a>
            )}

            {/* Quick Links */}
            <div className="hidden md:flex items-center gap-3">
              <motion.a
                href="/customer/pages/contactus"
                className="hover:text-indigo-200 transition-colors duration-300 relative group"
                whileHover={{ scale: 1.05 }}
              >
                Contact Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </motion.a>
              <span className="text-white/40">|</span>
              <motion.a
                href="/customer/pages/aboutus"
                className="hover:text-indigo-200 transition-colors duration-300 relative group"
                whileHover={{ scale: 1.05 }}
              >
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            </div>
          </div>

          {/* Center Section - Animated Promo Messages */}
          <div className="hidden lg:flex w-full max-w-2xl overflow-hidden relative h-6">
            <motion.div
              className="flex items-center space-x-8 whitespace-nowrap absolute"
              initial={{ x: '100%' }}
              animate={animationControls}
              onMouseEnter={() => animationControls.stop()}
              onMouseLeave={() => startAnimation()}
            >
              {promoMessages.map((promo, index) => {
                const IconComponent = promo.icon;
                return (
                  <div key={index} className="flex items-center gap-3 px-4">
                    <div className={`p-1.5 rounded-full bg-gradient-to-r ${promo.color} shadow-lg`}>
                      <IconComponent className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-medium">{promo.text}</span>
                    <motion.button
                      onClick={handleViewDetailsClick}
                      className="text-white/90 hover:text-white font-semibold underline decoration-2 underline-offset-2 hover:decoration-indigo-200 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View details
                    </motion.button>
                    <FiChevronRight className="w-4 h-4 text-white/60" />
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Section - Social Media */}
          <div className="flex items-center gap-3 md:gap-4">
            {loading ? (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-xs">Loading...</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3 md:gap-4">
                <motion.a
                  href={socialMediaLinks.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiFacebook className="w-4 h-4 text-white group-hover:text-blue-300 transition-colors duration-300" />
                </motion.a>
                <motion.a
                  href={socialMediaLinks.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiInstagram className="w-4 h-4 text-white group-hover:text-pink-300 transition-colors duration-300" />
                </motion.a>
                <motion.a
                  href={socialMediaLinks.tiktok || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTiktok className="w-4 h-4 text-white group-hover:text-black transition-colors duration-300" />
                </motion.a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Promo Banner */}
      <div className="lg:hidden border-t border-white/20 bg-white/5">
        <div className="container mx-auto px-4 py-2">
          <motion.div
            className="flex items-center justify-center gap-2 text-xs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span className="font-medium">Free shipping on orders over $50</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default TopBar;
