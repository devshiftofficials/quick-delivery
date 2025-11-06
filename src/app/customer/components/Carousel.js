'use client';
import React, { useEffect, useState } from 'react';
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Image from 'next/image';
import { getImageUrl, getImageProps } from '../../util/imageUrl';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

function Slider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slider');
      if (!response.ok) {
        throw new Error('Failed to fetch slides');
      }
      const data = await response.json();
      const formattedSlides = data.map(slide => ({
        image: slide.imgurl ? getImageUrl(slide.imgurl) : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&auto=format',
        link: slide.link || '#',
      }));
      setSlides(formattedSlides);
    } catch (error) {
      console.error('Error fetching slides:', error);
      // Set default placeholder slides if API fails
      setSlides([{
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&auto=format',
        link: '#',
      }]);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const [companyName, setcompanyName] = useState('');
  const [companyHeaderImage, setcompanyHeaderImage] = useState('');
  const [companyicon, setcompanyicon] = useState('');

  useEffect(() => {
    async function fetchCompanyDetails() {
      console.log("Fetching company details...");
      try {
        const response = await fetch('/api/companydetails');
        const data = await response.json();
        console.log("Fetched data:", data);
        if (data) {
          console.log("data is : ", data);
          setcompanyName(data.name);
          setcompanyHeaderImage(data.headerImage);
          setcompanyicon(data.favIcon);
          console.log("Company data is ", companyName);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    }
    fetchCompanyDetails();
  }, []);

  const zoomInProperties = {
    scale: 0.4,
    duration: 3000,
    transitionDuration: 1000,
    indicators: true,
    arrows: true,
    pauseOnHover: true,
    onChange: (oldIndex, newIndex) => {
      setCurrentIndex(newIndex);
    },
  };

  return (
    <div className="relative w-full overflow-hidden">
      {slides.length > 0 ? (
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]">
          <Zoom {...zoomInProperties}>
            {slides.map((slide, index) => (
              <div key={index} className="relative h-full w-full">
                <a 
                  href={slide.link || '#'} 
                  target={slide.link ? "_blank" : "_self"} 
                  rel="noopener noreferrer"
                  className="block h-full w-full"
                >
                  {/* Image with overlay */}
                  <div className="relative h-full w-full">
                    <Image
                      width={1920}
                      height={1080}
                      src={slide.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&auto=format'}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                      quality={90}
                      priority={index === 0}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&auto=format';
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                    
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 sm:px-6 md:px-8">
                      <div className="text-center max-w-4xl mx-auto space-y-4 md:space-y-6 animate-fade-in">
                        {/* Sparkle Icon */}
                        <div className="flex justify-center mb-2">
                          <div className="relative">
                            <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white/90 animate-pulse" />
                            <div className="absolute inset-0 bg-indigo-400/30 blur-xl rounded-full"></div>
                          </div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight">
                          <span className="block mb-2 bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
                            Welcome to
                          </span>
                          <span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                            {companyName || 'QuickDelivery'}
                          </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
                          Discover a variety of products at unbeatable prices. Shop now and enjoy a seamless online shopping experience with us!
                        </p>

                        {/* CTA Button */}
                        <div className="pt-4 md:pt-6">
                          <button className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-semibold text-sm md:text-base rounded-full overflow-hidden shadow-2xl shadow-indigo-500/50 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/70">
                            <span className="relative z-10 flex items-center gap-2">
                              Shop Now
                              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-ping hidden md:block"></div>
                    <div className="absolute bottom-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-500 hidden md:block"></div>
                    <div className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-1000 hidden lg:block"></div>
                  </div>
                </a>
              </div>
            ))}
          </Zoom>

          {/* Custom Navigation Dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50'
                    : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        // Placeholder when no slides
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
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
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}

export default Slider;
