'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import { MdExpandMore } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setCart } from '../../store/cartSlice';
// import { setCart } from '@/app/store/cartSlice';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import { getImageUrl, getImageProps } from '../../util/imageUrl';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingBag, Tag } from 'lucide-react';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]); // Add this state
  const [isMegaDropdownOpen, setIsMegaDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [totalQuantityOfItems, setTotalQuantityOfItems] = useState(0);

  
useEffect(() => {
  if (cartItems.length > 0) {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalQuantityOfItems(totalQuantity);
  }
}, [cartItems]);

  console.log("All cart items are: ",cartItems);
  // Refs for dropdowns
  const megaDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  // Fetch Categories and Subcategories
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        // Fetch categories
        const categoryResponse = await fetch('/api/categories');
        const categoriesData = await categoryResponse.json();

        if (categoriesData.status && Array.isArray(categoriesData.data)) {
          setCategories(categoriesData.data); // Set categories from 'data'
        } else {
          console.error('Categories data is not an array:', categoriesData);
        }

        // Fetch all subcategories
        const subcategoryResponse = await fetch('/api/subcategories');
        const subcategoriesData = await subcategoryResponse.json();

        console.log('Subcategories data fetched:', subcategoriesData);

        if (subcategoriesData.status && Array.isArray(subcategoriesData.data)) {
          setSubcategories(subcategoriesData.data); // Set subcategories from 'data'
        } else {
          console.error('Subcategories data is not an array:', subcategoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
        setCategories([]);
        setSubcategories([]);
      }
    };

    fetchCategoriesAndSubcategories();

    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch(setCart(storedCart));

    // Event listeners for closing dropdowns
    const handleClickOutsideMega = (event) => {
      if (
        megaDropdownRef.current &&
        !megaDropdownRef.current.contains(event.target) &&
        !event.target.closest('#department-button')
      ) {
        setIsMegaDropdownOpen(false);
      }
    };

    const handleClickOutsideProfile = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideMega);
    document.addEventListener('mousedown', handleClickOutsideProfile);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMega);
      document.removeEventListener('mousedown', handleClickOutsideProfile);
    };
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push('/'); // Redirect to the home page if the search query is empty
    } else {
      const searchPageUrl = `/customer/pages/allproducts?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
      router.push(searchPageUrl);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMegaDropdown = () => {
    setIsMegaDropdownOpen(!isMegaDropdownOpen);
  };

  const handleCategoryHover = (category) => {
    setHoveredCategory(category);
    
    // Filter subcategories by categorySlug
    const filteredSubcategories = subcategories.filter(
      (subcategory) => subcategory.categorySlug === category.slug
    );
    
    // Update the state with filtered subcategories
    setFilteredSubcategories(filteredSubcategories);

    setIsMegaDropdownOpen(true); // Open the mega dropdown
  };

  const handleCategoryClick = (categorySlug) => {
    router.push(`/customer/pages/category/${categorySlug}`);
    setIsMegaDropdownOpen(false);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };


  const handleSignOut = () => {
    // Clear the session token or any other authentication details
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setIsSignOutModalOpen(false);
  
    // Redirect the user to the login page
    router.push('/login');
  };


  const [companyName, setcompanyName]=useState('');
  const [companyHeaderImage, setcompanyHeaderImage]=useState('');
  const [companyicon, setcompanyicon]=useState('');

  useEffect(() => {
    async function fetchCompanyDetails() {
      try {
        const response = await fetch('/api/companydetails');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched company data:", data);
  
        if (data) {
          setcompanyName(data.name);
          setcompanyHeaderImage(data.headerImage);
          setcompanyicon(data.favIcon);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    }
    fetchCompanyDetails();
  }, []);

  // Placeholder image for categories without images
  const getCategoryImage = (category) => {
    if (category.imageUrl) {
      return category.imageUrl;
    }
    // Return a placeholder image URL - using a dummy e-commerce category image
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&auto=format';
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-3 md:py-4 sticky top-0 z-50 shadow-lg border-b border-gray-100 backdrop-blur-sm bg-white/95"
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Admin Dashboard Style */}
        <motion.div
          className="flex items-center space-x-3 lg:space-x-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 min-w-[40px] md:min-w-[48px] flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/40 relative overflow-hidden">
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <div className="w-6 h-6 md:w-7 md:h-7 grid grid-cols-2 gap-0.5 relative z-10">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-white rounded-sm"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            <div className="flex flex-col">
              <motion.span
                className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                QuickDelivery
              </motion.span>
              <span className="text-[10px] md:text-xs text-gray-500 font-medium hidden sm:block">
                Online Ordering System
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Mobile Toggle Button */}
        <motion.div
          className="lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            className="text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors duration-300 p-2 rounded-lg hover:bg-indigo-50"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Desktop Menu */}
        <motion.nav
          className="hidden lg:flex lg:items-center lg:justify-between lg:space-x-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col text-black lg:flex-row text-xs lg:text-[16px] text-center lg:space-x-6">
            {/* Department Button */}
            <div className="relative">
              <motion.button
                id="department-button"
                onClick={toggleMegaDropdown}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 py-2 lg:py-0 flex items-center font-medium gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Departments
                <motion.span
                  animate={{ rotate: isMegaDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MdExpandMore />
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {isMegaDropdownOpen && (
                  <motion.div
                    ref={megaDropdownRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-[500px] bg-white shadow-2xl rounded-lg z-50 grid grid-cols-2 border border-gray-100 overflow-hidden"
                    onMouseLeave={handleCategoryLeave}
                  >
                    {/* First Column: Categories */}
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                      {categories.map((category, index) => (
                        <motion.div
                          key={category.slug}
                          className="text-gray-700 hover:text-indigo-600 py-2.5 cursor-pointer flex items-center space-x-3 rounded-md hover:bg-indigo-50 transition-all duration-200 group"
                          onMouseEnter={() => handleCategoryHover(category)}
                          onClick={() => handleCategoryClick(category.slug)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          {/* Category Image with Placeholder */}
                          <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-indigo-300 transition-all duration-300">
                            <Image
                              src={getCategoryImage(category)}
                              alt={category.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&auto=format';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
                          </div>
                          {/* Category Name */}
                          <span className="font-medium group-hover:font-semibold transition-all duration-200">{category.name}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Second Column: Subcategories */}
                    <div className="p-4 bg-white border-l border-gray-100">
                      {filteredSubcategories.length > 0 ? (
                        filteredSubcategories.map((subcategory, index) => (
                          <motion.div
                            key={subcategory.slug}
                            className="text-gray-600 hover:text-indigo-600 py-2 cursor-pointer rounded-md hover:bg-indigo-50 transition-all duration-200"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ x: -5 }}
                            onClick={() => router.push(`/customer/pages/subcategories/${subcategory.slug}`)}
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="text-sm">{subcategory.name}</span>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm py-4 text-center">
                          Select a category
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Show First 5 Categories */}
            {categories.slice(0, 5).map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Link
                  href={`/customer/pages/category/${category.slug}`}
                  className="relative group text-gray-700 hover:text-indigo-600 transition-colors duration-300 py-2 lg:py-0 font-medium block"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="relative inline-block"
                  >
                    {category.name}
                    <motion.span
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Link
                href={`/customer/pages/blog`}
                className="relative group text-gray-700 hover:text-indigo-600 transition-colors duration-300 py-2 lg:py-0 font-medium block"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="relative inline-block"
                >
                  Blog
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Search, Cart, and Profile */}
        <motion.div
          className="hidden lg:flex items-center space-x-4 lg:space-x-6 mt-4 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Search Form */}
          <form className="relative flex" onSubmit={handleSearchSubmit}>
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Items..."
                className="border border-gray-300 rounded-full py-2.5 px-5 pr-10 text-[16px] w-48 md:w-64 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
              />
              <motion.button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 text-[18px] transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaSearch />
              </motion.button>
            </motion.div>
          </form>

          {/* Shopping Cart */}
          <motion.div
            className="relative flex"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link href="/customer/pages/cart" className="relative group">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <FiShoppingCart className="text-gray-700 cursor-pointer hover:text-indigo-600 transition-all duration-300 text-[24px]" />
              </motion.div>
              {totalQuantityOfItems > 0 && (
                <motion.span
                  className="absolute top-[-12px] right-[-12px] h-5 w-5 flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-[12px] font-bold shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                >
                  {totalQuantityOfItems}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* Profile Icon */}
          {authToken ? (
            <div className="relative">
              <motion.div
                ref={profileButtonRef}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiUser
                  className="w-6 h-6 text-gray-700 cursor-pointer hover:text-indigo-600 transition-all duration-300"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
              </motion.div>

              {/* Dropdown for profile options */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    ref={profileDropdownRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        href="/customer/pages/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 rounded-md transition-all duration-200 flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        My Orders
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Link
                        href="/customer/pages/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 rounded-md transition-all duration-200 flex items-center gap-2"
                      >
                        <FiUser className="w-4 h-4" />
                        Profile
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-all duration-200 flex items-center gap-2"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden lg:flex items-center">
              <Link
                href="/login"
                className="text-gray-700 text-[16px] mr-2 hover:text-indigo-600 font-medium transition-colors duration-300"
              >
                Sign in
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl z-50 border-t border-gray-100"
          >
          {/* Search bar at the top */}
          <div className="p-4 border-b">
            <form className="relative flex" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Items"
                className="border border-gray-300 rounded-full py-1 px-3 text-[14px] w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-gray-500 hover:text-indigo-600 transition-colors duration-300"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Categories and More Button */}
          <nav className="flex flex-col space-y-2 items-center p-4">
            {categories.slice(0, 5).map((category) => (
              <div
                key={category.slug}
                className="text-gray-700 hover:text-indigo-600 font-medium py-2 cursor-pointer transition-colors duration-300"
                onClick={() => handleCategoryClick(category.slug)}
              >
                {category.name}
              </div>
            ))}
            {categories.length > 5 && (
              <button
                className="text-indigo-600 font-semibold py-2 hover:text-indigo-700 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Show More
              </button>
            )}

            {authToken && (
              <div
                className="text-gray-700 hover:text-indigo-600 font-medium py-2 cursor-pointer transition-colors duration-300"
                onClick={() => router.push('/customer/pages/orders')}
              >
                My Orders
              </div>
            )}

            {authToken ? (
              <div
                className="text-gray-700 hover:text-red-600 font-medium py-2 cursor-pointer transition-colors duration-300"
                onClick={handleSignOut}
              >
                Log Out
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors duration-300"
              >
                Sign In
              </Link>
            )}
          </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign-out Confirmation Modal */}
      <AnimatePresence>
        {isSignOutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
          >
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
            <p>Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setIsSignOutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => {
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('userName');
                  setAuthToken(null);
                  setIsSignOutModalOpen(false);
                  router.push('/login');
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </motion.header>
  );
};

export default Header;
