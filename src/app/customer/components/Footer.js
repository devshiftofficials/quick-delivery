'use client';
import React, { useEffect, useState } from "react";
import { RxGlobe } from "react-icons/rx";
import { MdKeyboardArrowDown, MdCopyright } from "react-icons/md";
import { FaFacebook, FaEnvelope, FaTiktok, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';
import Link from 'next/link';
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from 'next/image';

const Footer = () => {
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    pinterest: ''
  });

  const [loading, setLoading] = useState(true);

  // Set up intersection observer
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  useEffect(() => {
    const fetchSocialMediaLinks = async () => {
      try {
        // Adding a query parameter with the current timestamp to avoid cache
        const response = await fetch(`/api/socialfirstrecodlink/2}`);
        const data = await response.json();
        if (data.status) {
          setSocialMediaLinks(data.data);
        } else {
          console.error('Failed to fetch social media links');
        }
      } catch (error) {
        console.error('Error fetching social media links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMediaLinks();
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
          console.log("Company data is ", company);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    }
    fetchCompanyDetails();
  }, []);

  const [companyemail, setcompanyemail] = useState('');
  const [companyphone, setcompanyphone] = useState('');
  const [companyaddress, setcompanyaddress] = useState('');
  const [companywebsite, setcompanywebsite] = useState('');
  const [companyowner, setcompanyowner] = useState('');

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const response = await axios.get('/api/contactinfo');
        if (Array.isArray(response.data) && response.data.length > 0) {
          const existingContact = response.data[0];
          console.log("contact data is -----------", existingContact);
          setcompanyemail(existingContact.email);
          setcompanyphone(existingContact.phoneNumber);
          setcompanywebsite(existingContact.website);
          setcompanyowner(existingContact.owner);
          setcompanyaddress(existingContact.address);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    }
    fetchContactInfo();
  }, []);

  // State for hover effect
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <>
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
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="grid grid-cols-1 px-4 gap-6 md:px-10 lg:px-20 sm:grid-cols-3 md:grid-cols-10 py-16 border-t border-gray-200 text-black lg:grid-cols-10 bg-gradient-to-br from-gray-50 via-white to-indigo-50/20"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-4 col-span-4">
          {/* Logo - Same as Header */}
          <Link href="/" className="focus:outline-none group">
            <motion.div
              className="flex items-center gap-3 mb-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 min-w-[48px] md:min-w-[56px] flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/40 relative overflow-hidden">
                  {/* Animated background shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  <div className="w-7 h-7 md:w-8 md:h-8 grid grid-cols-2 gap-0.5 relative z-10">
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
                  className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  {companyName || 'QuickDelivery'}
                </motion.span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">
                  Online Ordering System
                </span>
              </div>
            </motion.div>
          </Link>
          
          <p className="text-sm md:text-base font-normal text-gray-600 md:mr-10 leading-relaxed">
            {companyName || 'QuickDelivery'} is your ultimate destination for top-quality products, seamless shopping experience, and unmatched customer service. Discover a wide range of items to meet all your needs.
          </p>
          <div className="flex  gap-2">
            <Link href='/'>
            <Image
                 width={1000}
                  height={1000}
                  placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUFBQUGBQYHBwYJCQgJCQ0MCwsMDRMODw4PDhMdEhUSEhUSHRofGRcZHxouJCAgJC41LSotNUA5OUBRTVFqao4BBQUFBQYFBgcHBgkJCAkJDQwLCwwNEw4PDg8OEx0SFRISFRIdGh8ZFxkfGi4kICAkLjUtKi01QDk5QFFNUWpqjv/CABEIAfQB9AMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAABQQCAwEI/9oACAEBAAAAAP1WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGyoAAAAAA4hAAABrqgAAAAAOYIAAAa6oAAAAADmCAAAGuqAAAAAA5ggAABrqnyaHLoAAAc+285ggAABrqnMEAAAAGqscwQAAA11TmCH3R65fMAAA1VjmCAAAGuqcwR1b7JmIAABqrHMEAAANdU5girrHyN4gAAaqxzBAAADXVOYJ9u9BOwAAAaqxzBAAADXVOYJ9udhOwAatMwAaqxzBAAADXVOYIo7xzE4B3b6lZADVWOYIAAAa6pzBCju++UnyB9raSFwA1VjmCAAAGuqcwQdPnwDfRGWSA1VjmCAAAGuqcwQA3+Gd62voS8YGqscwQAAA11TmCAN1JH8bPqD5D4BqrHMEAAANdU5ggG6j9PD3AZ44NVY5ggAABrqnMEBsqAAEvGGqscwQAAA11TmCBrqgAD5D4GqscwQAAA11TmCDVWAAB4RhqrHMEAAANdU5ghprfQAAJmI1VjmCAAAGuqcwRprfQAAHMXzaqxzBAAADXVOYI2agAABg8GqscwQAAA11TmCAAAADVWOYIAAAa6pzBAAAABqrHMEAAANdU+QAAAAAaa5zBAAADXVHkAAAAD76HMEAAANdUAAAAABzBAAADXVAAAAAAcwQAAA11QAAAAAHMEAAAPbWAAAAAA4wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAA2EAABAQQIBAUDAwUBAAAAAAABAwACBBEUFSAzUlNyoSRAkcESITAxcRATUSJBUAUyYZCx4f/aAAgBAQABPwD/AH9wV6dLSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTSaTKh37Kuk8xBXx09/4dUcOrp5iCvjp7/w6o4dXTzEFfHT3/h1Rw6unmIK+OnvYVLzqTzzvuA1YROIdGrCJxDo1YROIdGrCJxDo1YROIdGpkRiamRGJqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqwicQ6NWETiHRqZEYmQiV1FACQQffysKjh1dPMQV8dPewtdKfHPwd8LCo4dXTzEFfHT3sLXSnxaAJZOFVfE5SDVesROYLKJPuGTzpHLQd8LCo4dXTzEFfHT3sLXSnxZddefIAEyWQh3ER+Xj9SARItEw3g/U5Mj/nKwd8LCo4dXTzEFfHT3sLXSnxZg0R4A/+70+lkgEMun9pUu8pB3wsKjh1dPMQV8dPewtdKfFgCZZN0OpugfgWv6h5quvfl3lIO+FhUcOrp5iCvjp72FrpT4sDyLIvgoJn/H/PK1/UH/GuP8O9/QhkQo8SfYNEw4LgecdkR7+nB3wsKjh1dPMQV8dPewtdKfFmCXDr3geE3e9lR8OOEks+88+8Sfc200y+9IMm46m6APpFIBN8F0fpe29KDvhYVHDq6eYgr46e9ha6U+LSEYAJKdQzj7r4mD9FYlJzyJmfwGWWeUemT/5bHm0Kg6m54iP1PDb6qJhRMuln3C48XT7j0YO+FhUcOrp5iCvjp72FrpT4tgvD2JDeN/EerEk+hBIOvHxvHyBsxSIfd8To/UNx6MHfCwqOHV08xBXx097C10p8eohCfccLzxIaIh3kSP3B+qKJUekPYM66HXQ6BIC1FoFJ+f7GZ+PQg74WFRw6unmIK+OnvYWulPj04aG8X63x5e4H5+j7rrwLpEw0Qg8k9+XWDpeIAEyWh0Qm7L9z7m2o468mQf3Z9wuPEH3FuDvhYVHDq6eYgr46e9ha6U+PShYbxyff/t/6wEvqQ686QRMH8snB/aVJJn+B+PRikPGkVAPMbi3B3wsKjh1dPMQV8dPewtdKfHow0MXz4nvJ0b8hFoeB7xO/2k9Dag74WFRw6unmIK+OnvYWulPj0IaGKpmf7GAAEhyDzgfdIIZ9wuPEH3FmDvhYVHDq6eYgr46e9ha6U+LcPDlR6Z8nRuwAAAA5KNRcecJdPmBZg74WFRw6unmIK+OnvYWulPi1Dw5Ve/DoYOh10ACQHKRaHgPjHs9Yg74WFRw6unmIK+OnvYWulPizDwryxJnID3LOugAACQHKvuuvul0ic2VSKbxB+sHfCwqOHV08xBXx097C10p8WYeJCTsiJtWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb+ENWb2FllfuPTlL6wd8LCo4dXTzEFfHT3sLXSnxz8HfCwqOHV08xBXx097C10p8c/B3wsKjh1dPMQV8dPexEPSSf+OfhCAsLCo4dXTzEFfHT3sPOgggiYLUdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7UdDKG7OIJOGYcAsKjh1dPMQV8dPf+HVHDq6eYgr46e/8OqOHV08xBXx09/4dUcOrp5hFX7TxMpzEmp5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92p5y92fjS84874JTBE5/n/f7//EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQIBAT8AAB//xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAEDAQE/AAAf/9k="
           src="/footericon/appstore.png" className="object-cover bg-black rounded-xl w-[10rem] h-[3rem]"/>
            </Link>
            <Link href='/'>
            <Image
                 width={1000}
                  height={1000}
                  placeholder="data:image/jpeg;base64,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"
           src="/footericon/playstore.png" className="object-cover bg-black rounded-xl  w-[10rem] h-[3rem]"/>
            </Link>

          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 col-span-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Company</h3>
          <Link href="/customer/pages/privacypolicy" legacyBehavior>
            <a
              className={`hover:no-underline ${hoveredLink === 'privacy' ? 'text-blue-600' : ''}`}
              onMouseEnter={() => setHoveredLink('privacy')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ transform: hoveredLink === 'privacy' ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}
            >
              <p className="text-sm md:text-base font-normal text-gray-600 hover:text-indigo-600 transition-colors duration-200">Privacy Policy</p>
            </a>
          </Link>
          <Link href="/customer/pages/termsandconditions" legacyBehavior>
            <a
              className={`hover:no-underline ${hoveredLink === 'terms' ? 'text-blue-600' : ''}`}
              onMouseEnter={() => setHoveredLink('terms')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ transform: hoveredLink === 'terms' ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}
            >
              <p className="text-sm md:text-base font-normal text-gray-600 hover:text-indigo-600 transition-colors duration-200">Terms & Conditions</p>
            </a>
          </Link>
          <Link href="/customer/pages/shippingpolicy" legacyBehavior>
            <a
              className={`hover:no-underline ${hoveredLink === 'shipping' ? 'text-blue-600' : ''}`}
              onMouseEnter={() => setHoveredLink('shipping')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ transform: hoveredLink === 'shipping' ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}
            >
              <p className="text-sm md:text-base font-normal text-gray-600 hover:text-indigo-600 transition-colors duration-200">Shipping Policy</p>
            </a>
          </Link>
          <Link href="/customer/pages/returnandexchangepolicy" legacyBehavior>
            <a
              className={`hover:no-underline ${hoveredLink === 'return' ? 'text-blue-600' : ''}`}
              onMouseEnter={() => setHoveredLink('return')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ transform: hoveredLink === 'return' ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}
            >
              <p className="text-sm md:text-base font-normal text-gray-600 hover:text-indigo-600 transition-colors duration-200">Return & Exchange Policy</p>
            </a>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 col-span-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Explore</h3>
          <Link href="/customer/pages/aboutus" legacyBehavior>
            <a
              className={`hover:no-underline ${hoveredLink === 'about' ? 'text-blue-600' : ''}`}
              onMouseEnter={() => setHoveredLink('about')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ transform: hoveredLink === 'about' ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}
            >
              <p className="text-sm md:text-base font-normal text-gray-600 hover:text-indigo-600 transition-colors duration-200">About Us</p>
            </a>
          </Link>
          <Link href="/customer/pages/faq" legacyBehavior>
            <a
              className={`hover:no-underline ${hoveredLink === 'faq' ? 'text-blue-600' : ''}`}
              onMouseEnter={() => setHoveredLink('faq')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ transform: hoveredLink === 'faq' ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}
            >
              <p className="text-sm md:text-base font-normal text-gray-600 hover:text-indigo-600 transition-colors duration-200">FAQs</p>
            </a>
          </Link>
          <Link href="/customer/pages/contactus" legacyBehavior>
            <a
              className={`hover:no-underline ${hoveredLink === 'contact' ? 'text-blue-600' : ''}`}
              onMouseEnter={() => setHoveredLink('contact')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ transform: hoveredLink === 'contact' ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}
            >
              <p className="text-sm md:text-base font-normal text-gray-600 hover:text-indigo-600 transition-colors duration-200">Contact Us</p>
            </a>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 col-span-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Support</h3>
          <p className="text-sm md:text-base font-normal text-gray-600 flex items-center gap-2">
            <FaEnvelope className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <a href={`mailto:${companyemail || 'devshiftt@gmail.com'}`} className="hover:text-indigo-600 transition-colors">
              {companyemail || 'devshiftt@gmail.com'}
            </a>
          </p>
          <p className="text-sm md:text-base font-normal text-gray-600 flex items-center gap-2">
            <span className="text-indigo-600">📞</span>
            <a href={`tel:${companyphone || '03476781946'}`} className="hover:text-indigo-600 transition-colors">
              {companyphone || '03476781946'}
            </a>
          </p>
          <p className="text-sm md:text-base font-normal text-gray-600 flex items-start gap-2">
            <span className="text-indigo-600 mt-1">📍</span>
            <span>{companyaddress || 'Punjab Centre, Inhancers plaza, Mandi bahauddin'}</span>
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex justify-around items-center flex-wrap-reverse p-6 md:p-8 gap-6 text-black bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 text-white"
      >
        <motion.div 
          className="flex items-center gap-2 border border-white/20 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <RxGlobe className="text-xl" />
          <p className="text-sm">English (United States)</p>
          <MdKeyboardArrowDown className="text-xl" />
        </motion.div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MdCopyright className="text-lg" />
            <p className="text-sm">2024 All Rights Reserved</p>
          </div>
          <p className="text-xs text-gray-300">Privacy policy | Terms</p>
        </div>
        <div className="flex gap-4 w-[250px] justify-center">
          <motion.a 
            href={socialMediaLinks.facebook || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110"
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaFacebook className={`h-6 w-6 ${socialMediaLinks.facebook ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500'}`} />
          </motion.a>
          <motion.a 
            href={socialMediaLinks.instagram || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110"
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaInstagram className={`h-6 w-6 ${socialMediaLinks.instagram ? 'text-pink-400 hover:text-pink-300' : 'text-gray-500'}`} />
          </motion.a>
          <motion.a 
            href={socialMediaLinks.tiktok || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110"
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTiktok className={`h-6 w-6 ${socialMediaLinks.tiktok ? 'text-white hover:text-gray-200' : 'text-gray-500'}`} />
          </motion.a>
        </div>
      </motion.div>
    </>
  );
};

export default Footer;