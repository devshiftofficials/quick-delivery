'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, CheckCircle, ShoppingCart, ArrowRight, Package } from 'lucide-react';

const AddToCartDialog = ({ isOpen, onClose, product, quantity, onViewCart, onContinueShopping }) => {
  const formatPrice = (price) => {
    return price.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog - Slides in from right */}
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4 pointer-events-none">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full h-full max-h-[600px] overflow-y-auto relative pointer-events-auto"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative gradient top bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              <div className="p-6 md:p-8 pt-12">
                {/* Success Icon */}
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                >
                  <div className="relative">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl"
                      animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <CheckCircle className="w-14 h-14 text-white" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-green-400/40 blur-2xl"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 0.3, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 bg-clip-text text-transparent">
                    Added to Cart!
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {quantity} {quantity === 1 ? 'item' : 'items'} added successfully
                  </p>
                </motion.div>

                {/* Product Preview */}
                {product && (
                  <motion.div
                    className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-indigo-100 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <motion.div
                        className="relative w-24 h-24 rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-md"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {product.images && product.images.length > 0 && product.images[0]?.url ? (
                          <Image
                            src={product.images[0].url.startsWith('http') 
                              ? product.images[0].url 
                              : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${product.images[0].url}`}
                            alt={product.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/logo.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <Package className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                        {product.discount && (
                          <div className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            -{product.discount}%
                          </div>
                        )}
                      </motion.div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl font-bold text-indigo-600">
                            Rs.{formatPrice(product.price)}
                          </span>
                          {product.discount && (
                            <span className="text-sm text-gray-500 line-through">
                              Rs.{formatPrice(Math.round(product.price / (1 - product.discount / 100)))}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.selectedSize && (
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                              Size: {product.selectedSize}
                            </span>
                          )}
                          {product.selectedColor && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              Color: {product.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Cart Summary */}
                <motion.div
                  className="bg-white border-2 border-indigo-100 rounded-xl p-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 font-medium">Quantity</span>
                    <span className="text-lg font-bold text-gray-900">{quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-xl font-bold text-indigo-600">
                      Rs.{formatPrice(product?.price * quantity || 0)}
                    </span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={onViewCart}
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>View Cart</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={onContinueShopping || onClose}
                    className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Continue Shopping
                  </motion.button>
                </div>

                {/* Decorative bottom element */}
                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddToCartDialog;
