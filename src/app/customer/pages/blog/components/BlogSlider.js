'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getImageProps } from '../../../../util/imageUrl';
import Link from 'next/link';

export default function BlogCategorySlider({ category, blogs }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredBlogs = blogs.filter((blog) => blog.category === category);

  if (filteredBlogs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white p-6 shadow-lg rounded-2xl text-center border border-gray-100"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {category}
        </h2>
        <p className="text-gray-500">No blogs available in this category.</p>
      </motion.div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredBlogs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredBlogs.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white p-6 md:p-8 shadow-lg rounded-2xl border border-gray-100 mb-8"
    >
      <motion.h2
        className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {category}
      </motion.h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Slider */}
        <div className="relative items-center flex col-span-1 lg:col-span-2">
          <motion.button
            onClick={handlePrevious}
            className="absolute left-4 z-50 bg-white/90 backdrop-blur-sm text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            onClick={handleNext}
            className="absolute right-4 z-50 bg-white/90 backdrop-blur-sm text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          <div className="relative w-full overflow-hidden rounded-xl shadow-xl">
            <motion.div
              className="flex transition-transform duration-700 ease-in-out"
              animate={{ x: `-${currentIndex * 100}%` }}
            >
              {filteredBlogs.map((blog, index) => (
                <div
                  key={blog.id}
                  className="w-full flex-shrink-0 relative"
                  style={{ flexBasis: '100%' }}
                >
                  <Link href={`/customer/pages/blog/${blog.id}`}>
                    <motion.div
                      className="relative w-full h-64 sm:h-80 lg:h-[500px] cursor-pointer group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {blog.image ? (
                        <Image
                          {...getImageProps(
                            blog.image,
                            blog.title,
                            {
                              width: 1200,
                              height: 600,
                              className: "absolute inset-0 w-full h-full object-cover rounded-xl"
                            }
                          )}
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <span className="text-gray-400 text-lg">No Image</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl"></div>
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 text-white p-6 md:p-8 rounded-b-xl">
                        <motion.h3
                          className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 group-hover:text-indigo-300 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {blog.title}
                        </motion.h3>
                        <motion.div
                          className="flex items-center gap-2 text-sm opacity-90"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.9 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span>Read Article</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right column: Remaining blogs */}
        <div className="flex flex-col space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide">
          {filteredBlogs
            .slice(currentIndex + 1)
            .concat(filteredBlogs.slice(0, currentIndex))
            .slice(0, 4)
            .map((blog, index) => (
              <motion.div
                key={blog.id}
                className="flex items-center space-x-4 bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <Link href={`/customer/pages/blog/${blog.id}`} className="flex items-center space-x-4 w-full">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {blog.image ? (
                      <Image
                        {...getImageProps(
                          blog.image,
                          blog.title,
                          {
                            width: 100,
                            height: 100,
                            className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          }
                        )}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {blog.description?.replace(/<[^>]*>/g, '').substring(0, 60)}...
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
