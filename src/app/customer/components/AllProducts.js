'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BeautifulLoader from '../../components/BeautifulLoader';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { getImageProps } from '../../util/imageUrl';
import { FiShoppingCart, FiHeart, FiChevronRight } from 'react-icons/fi';
import { Star, Tag, Award, Package } from 'lucide-react';

const TopRatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/topRated');
        const productsData = response.data?.data || response.data || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top-rated products:', error);
        setProducts([]);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (slug) => {
    if (slug) {
    router.push(`/customer/pages/products/${slug}`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    alert(`${product.name} has been added to the cart.`);
  };

  const showMoreProducts = () => {
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 12);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const calculateOriginalPrice = (price, discount) => {
    if (typeof price === 'number' && typeof discount === 'number') {
      return price - price * (discount / 100);
    }
    return price;
  };

  if (loading) {
    return <BeautifulLoader message="Loading top-rated products..." />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-amber-50/30 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
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
            <Award className="w-6 h-6 text-amber-600" />
            <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
              Customer Favorites
            </span>
            <Award className="w-6 h-6 text-amber-600" />
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Top Rated Products
          </motion.h2>
          
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Handpicked favorites loved by our customers
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
            >
              {products.slice(0, visibleProducts).map((product, index) => {
                const originalPrice = calculateOriginalPrice(product.price, product.discount);
                const isHovered = hoveredProduct === product.id;
                const productKey = product.slug || product.id || `product-${index}`;

                return (
                  <motion.div
                    key={productKey}
                    variants={cardVariants}
                    className="group relative"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                      <motion.div
                        className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col cursor-pointer"
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleProductClick(product.slug)}
                      >
                        {/* Top Rated Badge */}
                        <motion.div
                          className="absolute top-3 right-3 z-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.05, type: 'spring' }}
                        >
                          <Star className="w-3 h-3 fill-white" />
                          TOP
                        </motion.div>

                        {/* Discount Badge */}
              {product.discount && (
                          <motion.div
                            className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                          >
                            <Tag className="w-3 h-3" />
                            {product.discount.toFixed(0)}% OFF
                          </motion.div>
                        )}

                        {/* Image Container */}
                        <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                          {product.images && product.images.length > 0 && product.images[0]?.url ? (
                            <motion.div
                              className="relative w-full h-full"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.4 }}
                            >
                              <Image
                                {...getImageProps(
                                  product.images[0].url,
                                  product.name || 'Product',
                                  {
                                    width: 400,
                                    height: 400,
                                    className: "w-full h-full object-contain p-2"
                                  }
                                )}
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              />
                            </motion.div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <Package className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />
                            </div>
                          )}

                          {/* Quick Add Button */}
                          <motion.button
                            className="absolute bottom-4 right-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white h-12 w-12 rounded-full shadow-xl flex items-center justify-center z-30 relative overflow-hidden border-2 border-white/20 backdrop-blur-sm"
                            whileHover={{ 
                              scale: 1.15,
                              boxShadow: "0 15px 35px rgba(245, 158, 11, 0.6)",
                            }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            }}
                            onClick={(e) => handleAddToCart(e, product)}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ 
                              opacity: isHovered ? 1 : 0, 
                              scale: isHovered ? 1 : 0.8,
                              y: isHovered ? 0 : 10 
                            }}
                            style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
                          >
                            {/* Background gradient animation */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full"
                              animate={{
                                rotate: [0, 360],
                              }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              style={{ opacity: 0.9 }}
                            />
                            
                            {/* Shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                              animate={{
                                x: ['-150%', '150%'],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 2.5,
                                ease: "easeInOut",
                              }}
                            />
                            
                            {/* Pulse ring effect */}
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-white/60"
                              animate={{
                                scale: [1, 1.4, 1.4],
                                opacity: [0.6, 0, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                            />
                            
                            {/* Icon with proper z-index */}
                            <div className="relative z-10">
                              <FiShoppingCart className="w-5 h-5 text-white drop-shadow-lg" />
                            </div>
                          </motion.button>

                          {/* Wishlist Button */}
                          <motion.button
                            className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 h-9 w-9 rounded-full shadow-md flex items-center justify-center z-20 hover:bg-red-50 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiHeart className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex-1 flex flex-col">
                          {/* Price Section */}
                          <div className="mb-2">
                            {product.discount ? (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-lg font-bold text-amber-600">
                                  Rs.{formatPrice(originalPrice)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  Rs.{formatPrice(product.price)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                Rs.{formatPrice(product.price)}
                              </span>
                            )}
                          </div>

                          {/* Product Name */}
                          <h3
                            className="text-sm font-semibold text-gray-800 mb-auto line-clamp-2 group-hover:text-amber-600 transition-colors duration-200"
                            onClick={() => handleProductClick(product.slug)}
                          >
                            {product.name?.toUpperCase() || 'Product Name'}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mt-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating || 5)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            {product.rating && (
                              <span className="text-xs text-gray-600 ml-1">
                                ({product.rating})
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity duration-300"
                      />
                    </motion.div>
                );
              })}
            </motion.div>

            {/* Show More Button */}
            {visibleProducts < products.length && (
              <motion.div
                className="text-center mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            onClick={showMoreProducts}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Show More Products</span>
                  <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No top-rated products available</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for top-rated products!</p>
          </motion.div>
      )}
    </div>
    </section>
  );
};

export default TopRatedProducts;
