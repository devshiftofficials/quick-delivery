'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import BeautifulLoader from '../../../../components/BeautifulLoader';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getImageProps } from '../../../../util/imageUrl';
import { FiShoppingCart, FiHeart, FiFilter, FiSortAsc } from 'react-icons/fi';
import { Package, Tag, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../store/cartSlice';

const SubcategoryPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [highestPrice, setHighestPrice] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const fetchProductsAndSubcategory = async () => {
      setIsLoading(true);
      try {
        // Fetch products by subcategory slug
        const productsResponse = await axios.get(`/api/productbysubcatslug/${slug}`);
        let productsData = productsResponse.data;
        
        // Handle different response formats
        if (Array.isArray(productsData)) {
          setProducts(productsData);
          setFilteredProducts(productsData);
        } else if (productsData?.data && Array.isArray(productsData.data)) {
          setProducts(productsData.data);
          setFilteredProducts(productsData.data);
        } else if (productsData?.products && Array.isArray(productsData.products)) {
          setProducts(productsData.products);
          setFilteredProducts(productsData.products);
        } else {
          // Fallback: try fetching all products and filter
          const allProductsResponse = await axios.get('/api/products');
          const allProducts = Array.isArray(allProductsResponse.data) 
            ? allProductsResponse.data 
            : allProductsResponse.data?.data || [];
          
          const filtered = allProducts.filter(product => 
            product.subcategorySlug === slug || 
            product.subcategory?.slug === slug
          );
          setProducts(filtered);
          setFilteredProducts(filtered);
        }

        // Calculate max price
        const currentProducts = Array.isArray(productsData) ? productsData : 
          (productsData?.data || productsData?.products || []);
        const maxProductPrice = currentProducts.length > 0 
          ? Math.max(...currentProducts.map(product => product.price || 0), 0)
          : 0;
        setHighestPrice(maxProductPrice);
        setMaxPrice(maxProductPrice || 1000000);

        // Fetch subcategory details
        const subcategoryResponse = await axios.get(`/api/subcatdetail/${slug}`);
        if (subcategoryResponse.data && subcategoryResponse.data.status) {
          setSubcategory(subcategoryResponse.data.data);
        } else if (subcategoryResponse.data && !subcategoryResponse.data.status) {
          setSubcategory(subcategoryResponse.data);
        }
      } catch (error) {
        console.error('Error fetching subcategory or products data:', error.message);
        // Try fallback method
        try {
          const allProductsResponse = await axios.get('/api/products');
          const allProducts = Array.isArray(allProductsResponse.data) 
            ? allProductsResponse.data 
            : allProductsResponse.data?.data || [];
          
          const filtered = allProducts.filter(product => 
            product.subcategorySlug === slug || 
            product.subcategory?.slug === slug
          );
          setProducts(filtered);
          setFilteredProducts(filtered);
        } catch (fallbackError) {
          console.error('Fallback fetch also failed:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProductsAndSubcategory();
    }
  }, [slug]);

  const handleProductClick = (productSlug) => {
    if (productSlug) {
      router.push(`/customer/pages/products/${productSlug}`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    alert(`${product.name} has been added to the cart.`);
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

  const handleFilter = () => {
    const filtered = products.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );
    setFilteredProducts(filtered);
  };

  const handleSort = (option) => {
    let sortedProducts = [...filteredProducts];
    if (option === "A-Z") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "Z-A") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (option === "Price Low to High") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === "Price High to Low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(sortedProducts);
    setSortOption(option);
  };

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
      },
    },
  };

  if (isLoading) {
    return <BeautifulLoader message="Loading subcategory..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-6 h-6 text-indigo-600" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {subcategory ? subcategory.name : 'Subcategory Products'}
            </h2>
          </div>
          {subcategory?.description && (
            <p className="text-gray-600 text-lg">{subcategory.description}</p>
          )}
        </motion.div>

        {/* Filters and Sorting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>

            {/* Filters */}
            <div className={`flex flex-col sm:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="Min"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 0)}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="Max"
                  />
                </div>
                <div className="flex items-end">
                  <motion.button
                    onClick={handleFilter}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply Filter
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => handleSort(e.target.value)}
                className="w-full lg:w-auto border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="">Select Sort</option>
                <option value="A-Z">Alphabetically A-Z</option>
                <option value="Z-A">Alphabetically Z-A</option>
                <option value="Price Low to High">Price: Low to High</option>
                <option value="Price High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
          >
            {filteredProducts.map((product, index) => {
              const originalPrice = calculateOriginalPrice(product.price, product.discount);
              const isHovered = hoveredProduct === product.id;

              return (
                <motion.div
                  key={product.id || index}
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
                    {/* Discount Badge */}
                    {product.discount && (
                      <motion.div
                        className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Tag className="w-3 h-3 inline mr-1" />
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
                        className="absolute bottom-3 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-10 w-10 rounded-full shadow-lg flex items-center justify-center z-20"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleAddToCart(e, product)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiShoppingCart className="w-5 h-5" />
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
                      <h3
                        className="text-sm md:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors"
                        style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {product.name}
                      </h3>

                      {/* Price Section */}
                      <div className="mt-auto">
                        {product.discount ? (
                          <div className="flex items-center gap-2">
                            <p className="text-lg md:text-xl font-bold text-indigo-600">
                              Rs.{formatPrice(originalPrice)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              Rs.{formatPrice(product.price)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg md:text-xl font-bold text-gray-900">
                            Rs.{formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity duration-300"
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
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No products found for this subcategory.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or check back later.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryPage;
