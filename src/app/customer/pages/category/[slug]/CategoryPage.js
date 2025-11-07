'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import BeautifulLoader from '../../../../components/BeautifulLoader';
import Image from 'next/image';
import { getImageProps } from '../../../../util/imageUrl';
import { Tag, Sparkles, ArrowRight, Layers } from 'lucide-react';

// Function to fetch subcategories by category slug
const fetchSubcategoriesByCategorySlug = async (categorySlug) => {
  try {
    const response = await axios.get(`/api/subcategories/${categorySlug}`);
    console.log('Full API response:', response);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

const CategoryPage = ({ categoryData }) => {
  const { slug } = useParams();
  const router = useRouter();
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);

  useEffect(() => {
    console.log("Category Data in CategoryPage:", categoryData);

    const fetchSubcategories = async () => {
      try {
        const subcategoriesData = await fetchSubcategoriesByCategorySlug(slug);
        console.log("Subcategories Data before setting state:", subcategoriesData);
        setSubcategories(subcategoriesData);
        console.log("Subcategories State after setting:", subcategories);
      } catch (err) {
        setError('Failed to fetch subcategories');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchSubcategories();
    }
  }, [slug, categoryData]);

  const handleSubcategoryClick = (subcategorySlug) => {
    router.push(`/customer/pages/subcategories/${subcategorySlug}`);
  };

  // Gradient colors for subcategory cards
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-blue-500',
    'from-rose-500 to-pink-500',
    'from-amber-500 to-orange-500',
  ];

  const bgGradients = [
    'from-blue-50 to-cyan-50',
    'from-purple-50 to-pink-50',
    'from-green-50 to-emerald-50',
    'from-orange-50 to-red-50',
    'from-indigo-50 to-purple-50',
    'from-teal-50 to-blue-50',
    'from-rose-50 to-pink-50',
    'from-amber-50 to-orange-50',
  ];

  if (isLoading) {
    return <BeautifulLoader message="Loading category..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  console.log("Subcategories State in render:", subcategories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            <Layers className="w-6 h-6 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Explore Subcategories
            </span>
            <Layers className="w-6 h-6 text-indigo-600" />
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {categoryData?.name || 'Category'} Subcategories
          </motion.h2>
          
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover our wide range of subcategories and find exactly what you're looking for
          </motion.p>
        </motion.div>

        {/* Subcategories Grid */}
        {subcategories && subcategories.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {subcategories.map((subcategory, index) => {
              const gradient = gradients[index % gradients.length];
              const bgGradient = bgGradients[index % bgGradients.length];
              const isHovered = hoveredSubcategory === subcategory.id;

              return (
                <motion.div
                  key={subcategory.id}
                  variants={itemVariants}
                  className="group relative"
                  onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                  onMouseLeave={() => setHoveredSubcategory(null)}
                >
                  <motion.div
                    className={`bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 cursor-pointer h-full flex flex-col`}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubcategoryClick(subcategory.slug)}
                  >
                    {/* Gradient overlay on hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    {/* Image Container */}
                    <div className="relative h-40 md:h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                      {subcategory.imageUrl ? (
                        <motion.div
                          className="relative w-full h-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Image
                            {...getImageProps(
                              `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${subcategory.imageUrl}`,
                              subcategory.name,
                              {
                                width: 400,
                                height: 400,
                                className: "w-full h-full object-cover",
                              }
                            )}
                          />
                          {/* Overlay gradient on hover */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        </motion.div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Tag className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                        </div>
                      )}

                      {/* Shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: isHovered ? '100%' : '-100%' }}
                        transition={{
                          duration: 0.6,
                          ease: 'easeInOut',
                        }}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex-1 flex flex-col justify-center">
                      <motion.h3
                        className="text-base md:text-lg font-bold text-gray-900 text-center group-hover:text-indigo-600 transition-colors duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        {subcategory.name}
                      </motion.h3>
                      
                      {/* View More Indicator */}
                      <motion.div
                        className="flex items-center justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
                      >
                        <span className="text-xs font-medium text-indigo-600">View Products</span>
                        <ArrowRight className="w-3 h-3 text-indigo-600" />
                      </motion.div>
                    </div>

                    {/* Decorative corner accent */}
                    <motion.div
                      className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 rounded-bl-full transition-opacity duration-300`}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
              <Tag className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No subcategories available for this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
