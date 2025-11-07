'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getImageProps } from '../../../../util/imageUrl';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';

const BlogSection = ({ blogs, title, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blogsToShow, setBlogsToShow] = useState(4);
  const router = useRouter();

  const filteredBlogs = blogs.filter(blog => blog.category === title);

  useEffect(() => {
    const updateBlogsToShow = () => {
      if (window.innerWidth >= 1024) {
        setBlogsToShow(4);
      } else if (window.innerWidth >= 768) {
        setBlogsToShow(2);
      } else {
        setBlogsToShow(1);
      }
    };

    updateBlogsToShow();
    window.addEventListener('resize', updateBlogsToShow);
    return () => window.removeEventListener('resize', updateBlogsToShow);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? Math.ceil(filteredBlogs.length / blogsToShow) - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === Math.ceil(filteredBlogs.length / blogsToShow) - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBlogClick = blog => {
    router.push(`/customer/pages/blog/${blog.id}`);
  };

  if (filteredBlogs.length === 0) {
    return null;
  }

  return (
    <div className="relative flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 h-full justify-center items-center w-full px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mx-auto mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-7xl mx-auto relative">
        <motion.button
          onClick={handlePrevious}
          className="absolute left-4 z-50 bg-white/90 backdrop-blur-sm text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 top-1/2 -translate-y-1/2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          onClick={handleNext}
          className="absolute right-4 z-50 bg-white/90 backdrop-blur-sm text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 top-1/2 -translate-y-1/2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Blog Slider */}
        <div className="relative overflow-hidden rounded-xl w-full">
          <motion.div
            className="flex transition-transform duration-700 space-x-6 ease-in-out py-4"
            animate={{ x: `-${currentIndex * (100 / blogsToShow)}%` }}
          >
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id || index}
                className="flex-shrink-0 cursor-pointer group"
                style={{ flexBasis: `${100 / blogsToShow}%` }}
                onClick={() => handleBlogClick(blog)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100"
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Blog Image */}
                  <div className="relative pb-56 flex-shrink-0 overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                    {blog.image ? (
                      <Image
                        {...getImageProps(
                          blog.image,
                          blog.title || "Blog Image",
                          {
                            width: 400,
                            height: 300,
                            className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          }
                        )}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <div
                      className="text-gray-600 text-sm mb-4 flex-1 overflow-hidden"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    />
                    
                    {/* Read More */}
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:text-purple-600 transition-colors">
                      <span className="text-sm">Read more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>

                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
