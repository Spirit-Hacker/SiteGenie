"use client";

import Link from "next/link";
import { motion } from 'motion/react';

export const Banner = () => {
  return (
    <div className="relative gradient-bg text-white overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              <span className="block">Discover Our</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">Premium Collection</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl mb-8 text-purple-100/90"
            >
              Explore the latest trends with our curated selection of premium products designed for the modern lifestyle.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/shop" 
                  className="glass inline-flex items-center justify-center px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all duration-300"
                >
                  Shop Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/collections" 
                  className="bg-transparent border border-white/30 inline-flex items-center justify-center px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all duration-300"
                >
                  Explore Collections
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8,
                delay: 0.3,
              }}
              className="relative"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute top-0 left-0 w-full h-full rounded-full bg-purple-500/20 animate-float" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-10 left-10 w-full h-full rounded-full bg-indigo-500/20 animate-float" style={{ animationDelay: '0s' }}></div>
                
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full text-white/10">
                    <path fill="currentColor" d="M41.2,-69.2C53.6,-62.3,64.4,-52.1,71.8,-39.5C79.2,-26.8,83.3,-11.6,82.2,3.1C81.1,17.9,74.9,32.3,65.8,44.3C56.7,56.3,44.8,66,31.3,70.6C17.7,75.2,2.5,74.8,-12.8,73C-28.2,71.1,-43.8,67.8,-55.3,58.8C-66.9,49.9,-74.5,35.3,-78.7,19.7C-82.9,4.1,-83.7,-12.6,-78.7,-26.9C-73.7,-41.1,-62.9,-53,-49.9,-59.8C-36.9,-66.6,-21.7,-68.5,-6.9,-67.7C7.9,-66.9,28.8,-76.1,41.2,-69.2Z" transform="translate(100 100)" />
                  </svg>
                </motion.div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
    </div>
  );
};