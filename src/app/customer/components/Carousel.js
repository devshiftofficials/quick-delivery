'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getImageUrl, getImageProps } from '../../util/imageUrl';
import { ChevronLeft, ChevronRight, Sparkles, Play, Pause } from 'lucide-react';
import Link from 'next/link';

function Slider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const [companyName, setCompanyName] = useState('');

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slider');
      if (!response.ok) {
        throw new Error('Failed to fetch slides');
      }
      const data = await response.json();
      const formattedSlides = data.map(slide => ({
        id: slide.id || Math.random(),
        image: slide.imgurl ? (slide.imgurl.startsWith('http') ? slide.imgurl : getImageUrl(slide.imgurl)) : null,
        link: slide.link || '#',
        title: slide.title || '',
        description: slide.description || '',
      }));
      setSlides(formattedSlides.length > 0 ? formattedSlides : [{
        id: 'default',
        image: null,
        link: '#',
        title: '',
        description: '',
      }]);
    } catch (error) {
      console.error('Error fetching slides:', error);
      setSlides([{
        id: 'default',
        image: null,
        link: '#',
        title: '',
        description: '',
      }]);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    async function fetchCompanyDetails() {
      try {
        const response = await fetch('/api/companydetails');
        const data = await response.json();
        if (data) {
          setCompanyName(data.name);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    }
    fetchCompanyDetails();
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && slides.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, slides.length, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const transition = {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.4 },
    scale: { duration: 0.4 },
  };

  if (slides.length === 0) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] max-h-[900px] w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-indigo-500 mx-auto animate-pulse" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
            Welcome to {companyName || 'QuickDelivery'}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto px-4">
            Your one-stop shop for all your needs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] max-h-[900px] w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {slides.map((slide, index) => {
            if (index !== currentIndex) return null;
            
            return (
              <motion.div
                key={slide.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 w-full h-full"
              >
                <Link 
                  href={slide.link || '#'} 
                  className="block h-full w-full relative group"
                >
                  {/* Image Container */}
                  <div className="relative h-full w-full overflow-hidden">
                    {slide.image ? (
                      <motion.div
                        className="relative w-full h-full"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8, ease: 'easeInOut' }}
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title || `Slide ${index + 1}`}
                          width={1920}
                          height={1080}
                          className="w-full h-full object-cover"
                          priority={index === 0}
                          unoptimized={slide.image.includes('http')}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/logo.png';
                          }}
                        />
                      </motion.div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/20 transition-all duration-300"></div>

                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <motion.div
                        className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      <motion.div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 1,
                        }}
                      />
                      <motion.div
                        className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 2,
                        }}
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 sm:px-6 md:px-8 lg:px-12 pointer-events-none">
                      <motion.div
                        className="text-center max-w-5xl mx-auto space-y-4 md:space-y-5 lg:space-y-6 w-full"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        {/* Sparkle Icon */}
                        <motion.div
                          className="flex justify-center mb-2 md:mb-3"
                          animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <div className="relative">
                            <Sparkles className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white/90" />
                            <motion.div
                              className="absolute inset-0 bg-indigo-400/30 blur-xl rounded-full"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 0.8, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          </div>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold text-white leading-[1.1]"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                        >
                          <span className="block mb-2 md:mb-3 bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
                            Welcome to
                          </span>
                          <motion.span
                            className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl"
                            animate={{
                              backgroundPosition: ['0%', '100%', '0%'],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            style={{
                              backgroundSize: '200% 200%',
                            }}
                          >
                            {companyName || slide.title || 'QuickDelivery'}
                          </motion.span>
                        </motion.h1>

                        {/* Subtitle */}
                        {slide.description && (
                          <motion.p
                            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed px-4 font-medium drop-shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                          >
                            {slide.description}
                          </motion.p>
                        )}

                        {/* CTA Button */}
                        <motion.div
                          className="pt-4 md:pt-5 lg:pt-6 pointer-events-auto"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.6 }}
                        >
                          <motion.button
                            className="group relative px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold text-sm md:text-base lg:text-lg rounded-full overflow-hidden shadow-2xl shadow-indigo-500/50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                              boxShadow: [
                                '0 20px 25px -5px rgba(99, 102, 241, 0.5)',
                                '0 25px 50px -12px rgba(139, 92, 246, 0.6)',
                                '0 20px 25px -5px rgba(99, 102, 241, 0.5)',
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <span className="relative z-10 flex items-center gap-2 md:gap-3">
                              Shop Now
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              >
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                              </motion.div>
                            </span>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '0%' }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 w-2 h-2 bg-indigo-400 rounded-full hidden md:block pointer-events-none">
                      <motion.div
                        className="absolute inset-0 bg-indigo-400 rounded-full"
                        animate={{
                          scale: [1, 2, 1],
                          opacity: [1, 0, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </div>
                    <div className="absolute bottom-20 right-20 w-3 h-3 bg-purple-400 rounded-full hidden md:block pointer-events-none">
                      <motion.div
                        className="absolute inset-0 bg-purple-400 rounded-full"
                        animate={{
                          scale: [1, 2.5, 1],
                          opacity: [1, 0, 1],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.5,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <motion.button
              onClick={prevSlide}
              className="absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center group shadow-lg"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white group-hover:text-indigo-300 transition-colors" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/30 group-hover:to-purple-600/30 transition-all duration-300"
                initial={false}
              />
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center group shadow-lg"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white group-hover:text-indigo-300 transition-colors" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/30 group-hover:to-purple-600/30 transition-all duration-300"
                initial={false}
              />
            </motion.button>
          </>
        )}

        {/* Play/Pause Button */}
        {slides.length > 1 && (
          <motion.button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isAutoPlaying ? (
              <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" />
            ) : (
              <Play className="w-5 h-5 md:w-6 md:h-6 text-white" />
            )}
          </motion.button>
        )}

        {/* Navigation Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 md:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 md:gap-3">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-10 md:w-12 h-2.5 md:h-3'
                    : 'w-2.5 md:w-3 h-2.5 md:h-3'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentIndex ? (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-500/50"
                    layoutId="activeDot"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/60 hover:bg-white/80 rounded-full transition-colors" />
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Slide Counter */}
        {slides.length > 1 && (
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
            {currentIndex + 1} / {slides.length}
          </div>
        )}
      </div>
    </div>
  );
}

export default Slider;
