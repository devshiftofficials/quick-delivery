'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { FiTag, FiTruck, FiGift, FiGrid, FiRefreshCw } from 'react-icons/fi';
import { Sparkles, Shield, Zap, Award, Heart } from 'lucide-react';

const features = [
  {
    icon: FiTag,
    title: 'Best prices & offers',
    description: 'Orders $50 or more',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    icon: FiTruck,
    title: 'Free delivery',
    description: '24/7 amazing services',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
  },
  {
    icon: FiGift,
    title: 'Great daily deal',
    description: 'When you sign up',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
  },
  {
    icon: FiGrid,
    title: 'Wide assortment',
    description: 'Mega Discounts',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy returns',
    description: 'Within 30 days',
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50',
  },
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
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

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
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
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Why Choose Us
            </span>
            <Sparkles className="w-6 h-6 text-blue-600" />
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Our Amazing Features
          </motion.h2>
          
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Experience the best shopping with our premium services
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <motion.div
                  className={`bg-gradient-to-br ${feature.bgGradient} rounded-2xl p-6 md:p-8 flex flex-col items-center text-center h-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 relative overflow-hidden`}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Icon Container */}
                  <motion.div
                    className={`relative mb-4 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="text-white w-8 h-8 md:w-10 md:h-10 relative z-10" />
                    
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: 'easeInOut',
                      }}
                    />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 font-medium">
                    {feature.description}
                  </p>

                  {/* Decorative corner accent */}
                  <motion.div
                    className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-bl-full transition-opacity duration-300`}
                  />
                </motion.div>

                {/* Glow effect on hover */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl -z-10 transition-opacity duration-300`}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
