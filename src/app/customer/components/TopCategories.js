'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getImageProps } from '../../util/imageUrl';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';

const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/categories');
        console.log('Fetched Categories Response:', response.data);
        
        // Handle different response structures
        let categoriesData = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data?.status && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        }
        
        console.log('Processed Categories:', categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    router.push(`/customer/pages/category/${categorySlug}`);
  };

  const gradientColors = [
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-blue-500 via-cyan-500 to-teal-500',
    'from-green-500 via-emerald-500 to-lime-500',
    'from-yellow-500 via-orange-500 to-red-500',
    'from-pink-500 via-rose-500 to-red-500',
    'from-violet-500 via-purple-500 to-indigo-500',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Shop by Category
            </span>
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Explore Our Categories
          </motion.h2>
          
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover a wide range of products organized just for you
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : Array.isArray(categories) && categories.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
          >
            {categories.map((category, index) => {
              // Use slug or id as fallback for key
              const categoryKey = category.slug || category.id || `category-${index}`;
              const categorySlug = category.slug || category.id;
              const categoryName = category.name || 'Category';
              const gradient = gradientColors[index % gradientColors.length];
              const isHovered = hoveredCategory === categorySlug;

              if (!category) return null;

              return (
                <motion.div
                  key={categoryKey}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="group relative"
                  onMouseEnter={() => setHoveredCategory(categorySlug)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => handleCategoryClick(categorySlug)}
                >
                  {/* Card Container */}
                  <motion.div
                    className="relative min-h-[280px] md:min-h-[320px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 flex flex-col"
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Gradient Overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    {/* Image Container */}
                    <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                      {category?.imageUrl ? (
                        <motion.div
                          className="relative w-full h-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Image
                            width={400}
                            height={400}
                            {...getImageProps(category.imageUrl, categoryName, {
                              className: "w-full h-full object-cover",
                            })}
                            alt={categoryName}
                          />
                          {/* Overlay gradient on hover */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        </motion.div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <ShoppingBag className="w-20 h-20 md:w-24 md:h-24 text-gray-400" />
                        </div>
                      )}

                      {/* Shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-4 md:p-5 relative">
                      <motion.h3
                        className="text-base md:text-lg font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2"
                        layout
                      >
                        {categoryName}
                      </motion.h3>
                      
                      {category.tagline && (
                        <motion.p
                          className="text-xs md:text-sm text-gray-500 line-clamp-1 mb-3"
                          initial={{ opacity: 0.7 }}
                          animate={{ opacity: isHovered ? 1 : 0.7 }}
                        >
                          {category.tagline}
                        </motion.p>
                      )}

                      {/* View More Button */}
                      <motion.div
                        className="flex items-center gap-2 text-indigo-600 font-semibold text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>

                    {/* Decorative corner accent */}
                    <motion.div
                      className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 rounded-bl-full transition-opacity duration-300`}
                    />
                  </motion.div>

                  {/* Glow effect on hover */}
                  <motion.div
                    className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl -z-10 transition-opacity duration-300`}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No categories available</p>
            <p className="text-gray-400 text-sm mt-2">Categories will appear here once they are added</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TopCategories;
