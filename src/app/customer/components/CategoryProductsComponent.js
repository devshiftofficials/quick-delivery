'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { Tag, Sparkles, Layers } from 'lucide-react';

const SubcategoryProductsComponent = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const subcategoriesResponse = await axios.get('/api/subcategories');
        const subcategoriesData = subcategoriesResponse.data;
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };
    fetchSubcategories();
  }, []);

  const fetchProducts = async (subcategoryId) => {
    try {
      const productsResponse = await axios.get(`/api/products?subcategoryId=${subcategoryId}`);
      const productsData = productsResponse.data;
      setProducts(productsData);
      setFilteredProducts(productsData.slice(0, productsPerPage));
      setCurrentPage(1);

      // Log products in the terminal including image URLs
      productsData.forEach(product => {
        const imageUrls = product.images.map(image => image.url);
        console.log(`Product ${product.id}: ${product.name}`);
        console.log(`  Image URLs: ${imageUrls.join(', ')}`);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubcategoryClick = async (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    await fetchProducts(subcategoryId);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setFilteredProducts(products.slice(startIndex, endIndex));
    setCurrentPage(nextPage);
  };

  const handlePreviousPage = () => {
    const previousPage = currentPage - 1;
    const startIndex = (previousPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setFilteredProducts(products.slice(startIndex, endIndex));
    setCurrentPage(previousPage);
  };

  const handleProductClick = (productId) => {
    router.push(`/customer/pages/products/${productId}`);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`${product.name} has been added to the cart.`);
  };

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-blue-500',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Subcategories
          </h2>
        </div>
        <p className="text-gray-600">Select a subcategory to browse products</p>
      </motion.div>

      {/* Subcategories Scrollable Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {subcategories.map((subcategory, index) => {
          const gradient = gradients[index % gradients.length];
          const isSelected = selectedSubcategory === subcategory.id;

          return (
            <motion.button
              key={subcategory.id}
              variants={itemVariants}
              className={`relative flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isSelected
                  ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => handleSubcategoryClick(subcategory.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <Tag className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                <span>{subcategory.name}</span>
              </div>
              
              {/* Glow effect when selected */}
              {isSelected && (
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-xl opacity-50 blur-md -z-10`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {selectedSubcategory && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredProducts.length ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer border border-gray-300"
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.images && product.images.length > 0 ? (
                    <motion.img
                      src={product.images && product.images[0] && product.images[0].url ? `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${product.images[0].url}` : '/logo.png'}
                      alt={product.name}
                      className="h-40 w-full object-contain mb-4 rounded"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${e.target.src}`);
                        e.target.onerror = null;
                        e.target.src = '/fallback-image.jpg'; // Replace with a path to a fallback image
                      }}
                    />
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 rounded flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">{product.name}</h3>
                      <p className="text-md font-medium text-gray-700">Rs.{product.price}</p>
                    </div>
                    <div>
                      <p className="text-md font-medium text-gray-500">QTY: {product.stock}</p>
                    </div>
                  </div>
                  {/* <button
                    className="absolute bottom-4 right-4 border border-gray-300 text-gray-700 hover:text-blue-500 hover:border-blue-500 transition-colors duration-300 rounded-full p-2 bg-white shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <FiPlus className="h-5 w-5" />
                  </button> */}
                </motion.div>
              ))
            ) : (
              <div className="text-center col-span-full py-8 text-gray-500">No products available in this subcategory.</div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={handleNextPage}
              disabled={currentPage * productsPerPage >= products.length}
            >
              <FiChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubcategoryProductsComponent;
