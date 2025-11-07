'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getImageUrl, getImageProps } from '../../util/imageUrl';
import { ShoppingBag, Tag, Sparkles, ArrowRight, Star, Package } from 'lucide-react';
import BeautifulLoader from '../../components/BeautifulLoader';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [productIndices, setProductIndices] = useState({});
  const [windowWidth, setWindowWidth] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        console.log('Fetching categories...');
        const categoryResponse = await axios.get('/api/categories');
        const categoriesData = categoryResponse.data.data || [];
        console.log('Categories fetched:', categoriesData);
        setCategories(categoriesData);

        console.log('Fetching subcategories...');
        const subcategoryResponse = await axios.get('/api/subcategories');
        const subcategoriesData = subcategoryResponse.data.data || [];
        console.log('Subcategories fetched:', subcategoriesData);
        setSubcategories(subcategoriesData);

        console.log('Fetching products...');
        const productsResponse = await axios.get('/api/products');
        const productsData = productsResponse.data || [];
        console.log('Products fetched:', productsData);
        setProducts(productsData);

        const initialIndices = {};
        categoriesData.forEach((category) => {
          initialIndices[category.slug] = 0;
        });
        console.log('Initial product indices:', initialIndices);
        setProductIndices(initialIndices);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories and products:', error);
        setLoading(false);
      }
    };

    fetchCategoriesAndSubcategories();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      console.log('Window resized:', window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProductClick = (slug) => {
    console.log(`Navigating to product with slug: ${slug}`);
    router.push(`/customer/pages/products/${slug}`);
  };

  const scrollRight = (categorySlug, categoryProducts) => {
    setProductIndices((prevIndices) => {
      const productsPerView = windowWidth < 640 ? 2 : 4;
      const nextIndex = Math.min(
        prevIndices[categorySlug] + 1,
        categoryProducts.length - productsPerView
      );
      console.log(`Scrolling right in category '${categorySlug}': new index ${nextIndex}`);
      return { ...prevIndices, [categorySlug]: nextIndex };
    });
  };

  const scrollLeft = (categorySlug) => {
    setProductIndices((prevIndices) => {
      const prevIndex = Math.max(prevIndices[categorySlug] - 1, 0);
      console.log(`Scrolling left in category '${categorySlug}': new index ${prevIndex}`);
      return { ...prevIndices, [categorySlug]: prevIndex };
    });
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
    return <BeautifulLoader message="Loading products..." />;
  }

  console.log('Rendering products...');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, categoryIndex) => {
            const categorySubcategories = subcategories.filter(
              (subcat) => subcat.categoryId === category.id
            );
            console.log(
              `Category '${category.name}' has ${categorySubcategories.length} subcategories.`
            );

            const categoryProducts = products.filter((product) =>
              categorySubcategories.some(
                (subcat) => subcat.slug === product.subcategorySlug
              )
            );
            console.log(`Category '${category.name}' has ${categoryProducts.length} products.`);

            if (categoryProducts.length === 0) {
              console.log(`No products found for category '${category.name}'. Skipping.`);
              return null;
            }

            const currentProductIndex = productIndices[category.slug] || 0;
            const productsPerView = windowWidth < 640 ? 2 : 4;
            const visibleProducts = categoryProducts.slice(
              currentProductIndex,
              currentProductIndex + productsPerView
            );

            return (
              <motion.div
                key={category.slug}
                variants={categoryVariants}
                className="mb-16 md:mb-20 last:mb-0"
              >
                {/* Category Header */}
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Link href={`/customer/pages/category/${category.slug}`}>
                          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-lg ring-2 ring-indigo-100 group cursor-pointer bg-gradient-to-br from-indigo-100 to-purple-100">
                            {category?.imageUrl ? (
                              <>
                                <Image
                                  width={200}
                                  height={200}
                                  {...getImageProps(
                                    category.imageUrl,
                                    category.name,
                                    {
                                      width: 200,
                                      height: 200,
                                      className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    }
                                  )}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                                <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-indigo-500" />
                              </div>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                      
                      <div>
                        <motion.h3
                          className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: categoryIndex * 0.1 }}
                        >
                          {category.name}
                        </motion.h3>
                        {category.description && (
                          <p className="text-gray-600 text-sm md:text-base max-w-2xl">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={`/customer/pages/category/${category.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="relative">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {visibleProducts.map((product, productIndex) => {
                        const originalPrice = calculateOriginalPrice(product.price, product.discount);
                        const isHovered = hoveredProduct === product.slug;

                        return (
                          <motion.div
                            key={`${category.slug}-${product.slug}-${currentProductIndex}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: productIndex * 0.05,
                            }}
                            className="group relative"
                            onMouseEnter={() => setHoveredProduct(product.slug)}
                            onMouseLeave={() => setHoveredProduct(null)}
                          >
                            <motion.div
                              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col cursor-pointer"
                              whileHover={{ y: -8, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleProductClick(product.slug)}
                            >
                              {/* Discount Badge */}
                              {product.discount && (
                                <motion.div
                                  className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <Tag className="w-3 h-3" />
                                  {product.discount.toFixed(0)}% OFF
                                </motion.div>
                              )}

                              {/* Image Container */}
                              <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
                                    {/* Overlay on hover */}
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
                                  className="absolute bottom-4 right-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white h-12 w-12 rounded-full shadow-xl flex items-center justify-center z-30 group/btn relative overflow-hidden border-2 border-white/20 backdrop-blur-sm"
                                  whileHover={{ 
                                    scale: 1.15,
                                    boxShadow: "0 15px 35px rgba(99, 102, 241, 0.6)",
                                  }}
                                  whileTap={{ scale: 0.9 }}
                                  transition={{ 
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProductClick(product.slug);
                                  }}
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
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
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
                                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 h-9 w-9 rounded-full shadow-md flex items-center justify-center z-20 hover:bg-red-50 hover:text-red-500 transition-colors"
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
                                      <span className="text-lg font-bold text-indigo-600">
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
                                  className="text-sm font-semibold text-gray-800 mb-auto line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200"
                                  onClick={() => handleProductClick(product.slug)}
                                >
                                  {product.name}
                                </h3>

                                {/* Rating (if available) */}
                                {product.rating && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-600">{product.rating}</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>

                            {/* Glow effect on hover */}
                            <motion.div
                              className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity duration-300"
                            />
                          </motion.div>
                        );
                      })}
                  </div>

                  {/* Navigation Arrows */}
                  {categoryProducts.length > productsPerView && (
                    <>
                      <motion.button
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white rounded-full p-3 shadow-xl hover:shadow-2xl border border-gray-200 z-30 group"
                        onClick={() => scrollLeft(category.slug)}
                        disabled={currentProductIndex === 0}
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: currentProductIndex === 0 ? 0.5 : 1,
                          x: 0,
                        }}
                      >
                        <FiChevronLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
                      </motion.button>

                      <motion.button
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white rounded-full p-3 shadow-xl hover:shadow-2xl border border-gray-200 z-30 group"
                        onClick={() => scrollRight(category.slug, categoryProducts)}
                        disabled={currentProductIndex + productsPerView >= categoryProducts.length}
                        whileHover={{ scale: 1.1, x: 2 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                          opacity: currentProductIndex + productsPerView >= categoryProducts.length ? 0.5 : 1,
                          x: 0,
                        }}
                      >
                        <FiChevronRight className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
