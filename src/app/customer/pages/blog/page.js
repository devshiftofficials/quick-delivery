'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BlogCategorySlider from './components/BlogSlider';
import Subscribe from './components/Subcribe';
import BlogSection from './components/Blogsection';
import { getImageProps } from '../../../util/imageUrl';
import { BookOpen, Calendar, Tag as TagIcon, ArrowRight, Sparkles } from 'lucide-react';

export default function Blog() {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState(6);
  const [hoveredBlog, setHoveredBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        setBlogs(Array.isArray(data) ? data : data.data || []);
        const blogArray = Array.isArray(data) ? data : data.data || [];
        setFeaturedPost(blogArray[0]);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const showMoreBlogs = () => {
    setVisibleBlogs((prev) => prev + 6);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      <Head>
        <title>Blog Page</title>
      </Head>

      <div className="pt-8"></div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Our Blog
            </span>
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Latest Blog Posts
          </motion.h1>
          
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover insights, tips, and stories from our community
          </motion.p>
        </motion.div>

        {/* Blog Slider */}
        {blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <BlogCategorySlider category="Perfume" blogs={blogs} />
          </motion.div>
        )}

        {/* Blog Posts Section */}
        <BlogPosts 
          blogs={blogs.slice(0, visibleBlogs)} 
          containerVariants={containerVariants}
          itemVariants={itemVariants}
          hoveredBlog={hoveredBlog}
          setHoveredBlog={setHoveredBlog}
          formatDate={formatDate}
        />

        {/* Show More Button */}
        {visibleBlogs < blogs.length && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={showMoreBlogs}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Show More Blogs</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Blog Section & Subscribe */}
      <BlogSection blogs={blogs} title="Perfume" /> 
      <Subscribe /> 
    </div>
  );
}

/* Blog Posts Component */
function BlogPosts({ blogs, containerVariants, itemVariants, hoveredBlog, setHoveredBlog, formatDate }) {
  if (!blogs || blogs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
          <BookOpen className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">No blog posts available yet.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-12"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-8 text-gray-900"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        Latest Blog Posts
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {blogs.map((post, index) => {
          const isHovered = hoveredBlog === post.id;
          
          return (
            <motion.div
              key={post.id || index}
              variants={itemVariants}
              className="group relative"
              onMouseEnter={() => setHoveredBlog(post.id)}
              onMouseLeave={() => setHoveredBlog(null)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col cursor-pointer"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Image Container */}
                <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {post.image ? (
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        {...getImageProps(
                          post.image,
                          post.title || "Blog Image",
                          {
                            width: 600,
                            height: 400,
                            className: "w-full h-full object-cover"
                          }
                        )}
                      />
                      {/* Overlay gradient on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                      <BookOpen className="w-16 h-16 text-indigo-400" />
                    </div>
                  )}

                  {/* Category Badge */}
                  {post.category && (
                    <motion.div
                      className="absolute top-4 left-4 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      <TagIcon className="w-3 h-3 inline mr-1" />
                      {post.category}
                    </motion.div>
                  )}

                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: isHovered ? '100%' : '-100%' }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Date */}
                  {post.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {/* Description */}
                  <div
                    className="text-gray-600 text-sm mb-4 flex-1 overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />

                  {/* Read More Link */}
                  <Link 
                    href={`/customer/pages/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-purple-600 transition-colors group/link"
                  >
                    <span>Read more</span>
                    <motion.span
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Link>
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
    </motion.div>
  );
}
