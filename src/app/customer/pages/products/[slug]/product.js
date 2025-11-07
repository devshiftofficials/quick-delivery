  'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addToCart, setCart } from '../../../../store/cartSlice';
import BeautifulLoader from '../../../../components/BeautifulLoader';
import Modal from 'react-modal';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { FaShare, FaTimes, FaUpload } from 'react-icons/fa';
import Image from 'next/image';
import { getImageProps } from '../../../../util/imageUrl';
import { Package, Star, ShoppingCart, Heart, Share2, Check, AlertCircle, Tag } from 'lucide-react';
import AddToCartDialog from '../../../components/AddToCartDialog';

const ProductPage = ({ productData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(productData.product);
  console.log("product details are: ",product);
  const [relatedProducts, setRelatedProducts] = useState(productData.relatedProducts || []);
  const [reviews, setReviews] = useState([]);
  const [cart, setCartState] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [addedCartItem, setAddedCartItem] = useState(null);


  const [linkshare, setLinkShare] = useState(false);
  const ProductLink = `https://www.store2u.ca/customer/pages/products/${product.slug}`;

  const handlelinkshare = () => {
    setLinkShare(!linkshare);
  };
  
  useEffect(()=>{
    console.log("Colors :",colors);
    console.log("Sizes :",sizes);
  },[colors,sizes]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ProductLink);
    alert("Link copied to clipboard!");
  };

  // Initialize sizes and colors from productData if available (from server-side fetch)
  useEffect(() => {
    if (productData) {
      if (productData.colors) {
        setColors(Array.isArray(productData.colors) ? productData.colors : []);
      }
      if (productData.sizes) {
        setSizes(Array.isArray(productData.sizes) ? productData.sizes : []);
      }
      if (productData.product) {
        setProduct(productData.product);
      }
      if (productData.relatedProducts) {
        setRelatedProducts(productData.relatedProducts);
      }
    }
  }, [productData]);


  // Fetch reviews for the product
  const fetchReviews = useCallback(async () => {
    if (!product.id) return;
    
    try {
      const response = await axios.get(`/api/getreviews?productId=${product.id}`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  }, [product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('userName'); // Fetch the username from localStorage

    if (!username) {
      // If user is not authenticated, redirect to login page
      toast.error('You must be logged in to submit a review.');
      router.push('/login'); // Redirect to login page
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please provide a valid rating between 1 and 5.');
      return;
    }

    try {
      setReviewLoading(true);
      const response = await axios.post('/api/reviews', {
        productId: product.id,
        reviewer: username, // Use the username from localStorage
        rating,
        comment,
      });

      if (response.data.status === 201 || response.status === 201) {
        toast.success('Your review has been submitted successfully!');
        setRating(0);
        setComment('');
        // Refetch reviews to show the new one
        await fetchReviews();
      } else {
        toast.error('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while submitting your review.';
      toast.error(errorMessage);
    } finally {
      setReviewLoading(false);
    }
  };

  // Add product to cart
  // const handleAddToCart = () => {
  //   if (quantity > product.stock) {
  //     toast.error(`You cannot add more than ${product.stock} of this item.`);
  //     return;
  //   }

  //   if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
  //     toast.error('Please select a size and color.');
  //     return;
  //   }

  //   const newCartItem = {
  //     id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
  //     productId: product.id,
  //     quantity,
  //     price: product.discount
  //       ? calculateOriginalPrice(product.price, product.discount)
  //       : product.price,
  //     selectedColor,
  //     selectedSize,
  //     images: product.images,
  //     name: product.name,
  //     discount: product.discount,
  //   };

  //   dispatch(addToCart(newCartItem));
  //   setIsModalOpen(true);
  //   toast.success('Item added to cart successfully!');
  // };
  const prevcart = useSelector(state => state.cart.items);

  const handleAddToCart = () => {

    if (product.stock == 0){
      toast.error(`This product is out of stock.`);
      return;
    }

    if (quantity > product.stock) {
      toast.error(`You cannot add more than ${product.stock} of this item.`);
      return;
    }

    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      toast.error('Please select a size and color.');
      return;
    }

    const newCartItem = {
      id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
      productId: product.id,
      quantity,
      price: product.discount
        ? calculateOriginalPrice(product.price, product.discount)
        : product.price,
      selectedColor,
      selectedSize,
      images: product.images,
      name: product.name,
      discount: product.discount,
    };

    const existingItemIndex = prevcart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    let updatedCart = [...prevcart];
    console.log("Previous items in the cart is :", prevcart);

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity,
      };
      setAddedCartItem(updatedCart[existingItemIndex]);
    } else {
      updatedCart.push(newCartItem);
      setAddedCartItem(newCartItem);
      console.log("Previous items in the cart after adding is  :", updatedCart);
    }

    setCartState(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch(setCart(updatedCart));

    // Show beautiful confirmation dialog
    setIsModalOpen(true);
  };


  const handlebuynow = () => {

    if (product.stock == 0){
      toast.error(`This product is out of stock.`);
      return;
    }

    if (quantity > product.stock) {
      toast.error(`You cannot add more than ${product.stock} of this item.`);
      return;
    }

    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      toast.error('Please select a size and color.');
      return;
    }

    const newCartItem = {
      id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
      productId: product.id,
      quantity,
      price: product.discount
        ? calculateOriginalPrice(product.price, product.discount)
        : product.price,
      selectedColor,
      selectedSize,
      images: product.images,
      name: product.name,
      discount: product.discount,
    };

    const existingItemIndex = prevcart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    let updatedCart = [...prevcart];
    console.log("Previous items in the cart is :", prevcart);

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity,
      };
    } else {
      updatedCart.push(newCartItem);
      console.log("Previous items in the cart after adding is  :", updatedCart);
    }

    setCartState(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch(setCart(updatedCart));

    toast.success('Item added to cart successfully!');
    router.push('/customer/pages/cart');
    // setIsModalOpen(true);
  };



  const calculateOriginalPrice = (price, discount) => {
    return price - price * (discount / 100);
  };

  // Utility function to get the image URL (keeping for backward compatibility)
  const getImageUrl = (url) => {
    if (!url) return '/logo.png';
    return `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${url}`;
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // router.push('/');
  };


  // Only show loader if product data is not available and we're actually loading
  if (loading && (!product || !product.id)) {
    return <BeautifulLoader message="Loading product..." />;
  }

  // Show loader if product data is missing
  if (!product || !product.id) {
    return <BeautifulLoader message="Loading product..." />;
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      <ToastContainer />
      {isNavigating && <BeautifulLoader message="Loading..." />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-8 lg:gap-12"
        >
          {/* Product Images Section */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-1/2 mb-8 lg:mb-0"
          >
            <div className="flex flex-col lg:flex-row gap-4 relative">
              {/* Discount Badge */}
              {product.discount && (
                <motion.div
                  className="absolute top-4 right-4 z-20"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-xl flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <span>-{product.discount}% OFF</span>
                  </div>
                </motion.div>
              )}

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex lg:flex-col gap-2 lg:gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  {product.images.map((image, index) => (
                    <motion.div
                      key={index}
                      className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'border-indigo-600 shadow-lg scale-110'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {image?.url ? (
                        <Image
                          {...getImageProps(image.url, product.name, {
                            width: 80,
                            height: 80,
                            className: "w-full h-full object-cover"
                          })}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="relative w-full lg:flex-1 order-1 lg:order-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {product.images && product.images.length > 0 && product.images[currentImageIndex]?.url ? (
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-50 to-gray-100"
                  >
                    <Image
                      {...getImageProps(
                        product.images[currentImageIndex].url,
                        product.name,
                        {
                          width: 800,
                          height: 800,
                          className: "w-full h-full object-contain p-4"
                        }
                      )}
                    />
                    
                    {/* Zoom indicator on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 h-full flex flex-col">
              {/* Product Name */}
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.name}
              </motion.h1>

              {/* SKU */}
              {product.sku && (
                <motion.p
                  className="text-sm text-gray-500 mb-4 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  SKU: {product.sku}
                </motion.p>
              )}

              {/* Price Section */}
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-4">
                  {product.discount ? (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl md:text-4xl font-bold text-indigo-600">
                        Rs.{formatPrice(calculateOriginalPrice(product.price, product.discount))}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        Rs.{formatPrice(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl md:text-4xl font-bold text-indigo-600">
                      Rs.{formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Share Button */}
                <motion.button
                  onClick={handlelinkshare}
                  className="p-3 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Share Modal */}
              {linkshare && (
                <motion.div
                  className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handlelinkshare}
                >
                  <motion.div
                    className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 relative max-w-md w-full"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.button
                      onClick={handlelinkshare}
                      className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimes className="w-5 h-5" />
                    </motion.button>

                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Share this Product
                      </h2>
                      
                      <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border border-gray-200">
                        {product.images && product.images.length > 0 && product.images[0]?.url ? (
                          <Image
                            {...getImageProps(product.images[0].url, product.name, {
                              width: 80,
                              height: 80,
                              className: "w-20 h-20 object-cover rounded-lg"
                            })}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
                            {product.name}
                          </p>
                          {product.discount ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-indigo-600">
                                Rs.{formatPrice(calculateOriginalPrice(product.price, product.discount))}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                Rs.{formatPrice(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-indigo-600">
                              Rs.{formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-xl p-3 mb-4">
                        <input
                          type="text"
                          value={ProductLink}
                          readOnly
                          className="flex-1 bg-transparent text-sm text-gray-600 truncate focus:outline-none"
                        />
                        <motion.button
                          onClick={handleCopyLink}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Copy
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Stock Info */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {product.stock === 0 ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-lg font-semibold text-red-700">Out of Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-semibold text-green-700">In Stock ({product.stock} available)</span>
                  </div>
                )}
              </motion.div>

              {/* Color Selection */}
              {colors.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedColor(color.name)}
                        className={`relative w-12 h-12 rounded-full border-2 cursor-pointer transition-all duration-300 ${
                          selectedColor === color.name
                            ? 'border-indigo-600 ring-4 ring-indigo-200 scale-110'
                            : 'border-gray-300 hover:border-indigo-400 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {selectedColor === color.name && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <Check className="w-6 h-6 text-white drop-shadow-lg" />
                          </motion.div>
                        )}
                        <span className="sr-only">{color.name}</span>
                      </motion.button>
                    ))}
                  </div>
                  {selectedColor && (
                    <motion.p
                      className="text-sm mt-3 text-indigo-600 font-medium flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Check className="w-4 h-4" />
                      Selected: <strong>{selectedColor}</strong>
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Size Selection */}
              {sizes.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Select Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size, index) => (
                      <motion.button
                        key={index}
                        onClick={() => size.stock > 0 && setSelectedSize(size.name)}
                        disabled={size.stock === 0}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-300 ${
                          selectedSize === size.name
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg scale-105'
                            : size.stock === 0
                            ? 'border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-50'
                            : 'border-gray-300 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50'
                        }`}
                        whileHover={size.stock > 0 ? { scale: 1.05 } : {}}
                        whileTap={size.stock > 0 ? { scale: 0.95 } : {}}
                      >
                        {size.name}
                      </motion.button>
                    ))}
                  </div>
                  {selectedSize && (
                    <motion.p
                      className="text-sm mt-3 text-indigo-600 font-medium flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Check className="w-4 h-4" />
                      Selected: <strong>{selectedSize}</strong>
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Quantity Selector */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                    <motion.button
                      className="p-3 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiMinus className="w-5 h-5" />
                    </motion.button>
                    <span className="px-6 py-3 text-lg font-bold text-gray-900 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <motion.button
                      className="p-3 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                      disabled={quantity >= product.stock}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiPlus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <motion.button
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                  onClick={handleAddToCart}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -3,
                    boxShadow: "0 15px 35px rgba(99, 102, 241, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 2.5,
                      ease: "easeInOut",
                    }}
                  />
                  {/* Pulse glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-30"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <ShoppingCart className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Add to Cart</span>
                </motion.button>
                <motion.button
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={handlebuynow}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Buy Now</span>
                </motion.button>
              </motion.div>


              {/* Product Description */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Customer Reviews Section */}
        <motion.div
          variants={itemVariants}
          className="mt-12 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
        >
          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Customer Reviews
          </motion.h3>
          
          {Array.isArray(reviews) && reviews.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full h-12 w-12 text-lg font-bold text-white shadow-md">
                      {review.reviewer.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{review.reviewer}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {Array(review.rating)
                      .fill()
                      .map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    {Array(5 - review.rating)
                      .fill()
                      .map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gray-300" />
                      ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to leave a review!</p>
            </motion.div>
          )}


          {/* Leave a Review Section */}
          <motion.div
            className="mt-8 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-6 text-gray-900">Leave a Review</h3>

            {typeof window !== 'undefined' && localStorage.getItem('userName') ? (
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="rating">
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="comment">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                    rows="4"
                    placeholder="Write your review..."
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={reviewLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </motion.button>
              </form>
            ) : (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
                <p className="text-gray-700 mb-2">
                  If you want to leave a review, please{' '}
                  <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 underline">
                    log in
                  </a>
                  .
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Related Products Section */}
        <motion.div
          variants={itemVariants}
          className="mt-16"
        >
          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Related Products
          </motion.h3>
          
          {relatedProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              {relatedProducts.map((relatedProduct, index) => {
                const originalPrice = calculateOriginalPrice(
                  relatedProduct.price,
                  relatedProduct.discount
                );
                return (
                  <motion.div
                    key={relatedProduct.slug || index}
                    variants={itemVariants}
                    className="group relative"
                  >
                    <motion.div
                      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col cursor-pointer"
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/customer/pages/products/${relatedProduct.slug}`)}
                    >
                      {/* Discount Badge */}
                      {relatedProduct.discount && (
                        <motion.div
                          className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {relatedProduct.discount.toFixed(0)}% OFF
                        </motion.div>
                      )}

                      {/* Image Container */}
                      <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                        {relatedProduct.images && relatedProduct.images.length > 0 && relatedProduct.images[0]?.url ? (
                          <motion.div
                            className="relative w-full h-full"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                          >
                            <Image
                              {...getImageProps(
                                relatedProduct.images[0].url,
                                relatedProduct.name || 'Product',
                                {
                                  width: 400,
                                  height: 400,
                                  className: "w-full h-full object-contain p-2"
                                }
                              )}
                            />
                          </motion.div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <Package className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />
                          </div>
                        )}

                        {/* Quick View Button */}
                        <motion.button
                          className="absolute bottom-3 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-10 w-10 rounded-full shadow-lg flex items-center justify-center z-20"
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/customer/pages/products/${relatedProduct.slug}`);
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                        >
                          <ShoppingCart className="w-5 h-5" />
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
                          {relatedProduct.name}
                        </h3>

                        {/* Price Section */}
                        <div className="mt-auto">
                          {relatedProduct.discount ? (
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold text-indigo-600">
                                Rs.{formatPrice(originalPrice)}
                              </p>
                              <p className="text-sm text-gray-400 line-through">
                                Rs.{formatPrice(relatedProduct.price)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-lg font-bold text-gray-900">
                              Rs.{formatPrice(relatedProduct.price)}
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
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No related products available.</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Beautiful Add to Cart Confirmation Dialog */}
      <AddToCartDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={addedCartItem || {
          name: product.name,
          price: product.discount ? calculateOriginalPrice(product.price, product.discount) : product.price,
          images: product.images,
          selectedSize,
          selectedColor,
          discount: product.discount,
        }}
        quantity={addedCartItem?.quantity || quantity}
        onViewCart={() => {
          setIsModalOpen(false);
          router.push('/customer/pages/cart');
        }}
        onContinueShopping={handleCloseModal}
      />
    </div>
  );
};

export default ProductPage;
