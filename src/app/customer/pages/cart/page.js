'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { removeFromCart, updateQuantity, setCart } from '../../../store/cartSlice';
import Image from 'next/image';
import { getImageProps } from '../../../util/imageUrl';
import { ShoppingCart, Trash2, Plus, Minus, Package, CheckCircle, X } from 'lucide-react';

const CartPage = () => {
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);  
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [removingItemId, setRemovingItemId] = useState(null);

  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('authToken');
    if (username) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [router]);

  const fetchDeliveryCharge = async () => {
    try {
      const response = await fetch('/api/settings/getSetting');
      const data = await response.json();
      setDeliveryCharge(data.deliveryCharge || 0);
    } catch (error) {
      console.error('Error fetching delivery charge:', error);
      setDeliveryCharge(0);
    }
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch(setCart(storedCart));
    fetchDeliveryCharge();
    calculateTotal(storedCart);
  }, [dispatch]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
      calculateTotal(cart);
    }
  }, [cart, deliveryCharge]);

  const calculateTotal = (cartItems) => {
    const calculatedSubtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal + deliveryCharge);
  };

  const updateItemQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id: itemId, quantity }));
    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: quantity } : item
    );
    calculateTotal(updatedCart);
  };

  const handleRemoveFromCart = (itemId) => {
    setRemovingItemId(itemId);
    setTimeout(() => {
      dispatch(removeFromCart({ id: itemId }));
      const updatedCart = cart.filter(item => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      calculateTotal(updatedCart);
      setRemovingItemId(null);
      toast.success('Product removed from cart!');
    }, 300);
  };

  const handleCheckout = () => {
    router.push(`/customer/pages/checkout?total=${total}`);
  };

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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
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
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ShoppingCart className="w-16 h-16 text-indigo-500" />
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Cart is <span className="text-red-500">Empty!</span>
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Looks like you haven't added anything to your cart yet.
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span>Continue Shopping</span>
            <FiArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="container mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Cart Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-3/5 space-y-4"
          >
            {/* Shipping Information */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Shipping, arrives within 5 Days
                  </p>
                  <p className="text-sm text-gray-600">
                    Free shipping on orders over Rs. 5,000
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cart Items */}
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  exit="exit"
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                    removingItemId === item.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="p-4 md:p-6 flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <motion.div
                      className="relative flex-shrink-0 w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.images && item.images.length > 0 && item.images[0]?.url ? (
                        <Image
                          {...getImageProps(
                            item.images[0].url,
                            item.name,
                            {
                              width: 200,
                              height: 200,
                              className: "w-full h-full object-cover"
                            }
                          )}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {item.discount && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          -{item.discount}%
                        </div>
                      )}
                    </motion.div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.selectedSize && (
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                              Color: {item.selectedColor}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold text-indigo-600">
                            Rs.{item.price.toLocaleString()}
                          </span>
                          <span className="text-lg font-semibold text-gray-500">
                            × {item.quantity}
                          </span>
                          <span className="text-xl font-bold text-gray-900 ml-auto">
                            = Rs.{(item.quantity * item.price).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                          <motion.button
                            className="p-2 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="px-4 py-2 text-lg font-bold text-gray-900 min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            className="p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                          onClick={() => handleRemoveFromCart(item.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Right Section - Order Summary */}
          <motion.div
            className="w-full lg:w-2/5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-lg font-semibold text-gray-900">
                    Rs.{Math.round(subtotal).toLocaleString()}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="text-lg font-semibold text-gray-900">
                      Rs.{deliveryCharge.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Rs.{Math.round(total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center mb-6">
                Taxes and Shipping calculated at checkout.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.a
                  href="/"
                  className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Shopping
                </motion.a>
                <motion.button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Continue to Checkout</span>
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              {!isAuthenticated && (
                <motion.div
                  className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-gray-700 text-center">
                    For the best shopping experience,{' '}
                    <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 underline">
                      sign in
                    </Link>
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default CartPage;
