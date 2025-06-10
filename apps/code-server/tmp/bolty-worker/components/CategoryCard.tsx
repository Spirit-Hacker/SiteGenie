"use client";

import { motion } from 'motion/react';
import Link from "next/link";

interface CategoryCardProps {
  id: number;
  name: string;
  image: string;
  index: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, index }) => {
  // Generate a unique gradient for each category based on id
  const gradients = [
    "from-violet-500/60 to-purple-600/60",
    "from-purple-500/60 to-indigo-600/60",
    "from-indigo-500/60 to-blue-600/60",
    "from-blue-500/60 to-cyan-600/60",
    "from-cyan-500/60 to-teal-600/60"
  ];
  
  const gradient = gradients[id % gradients.length];
  
  // Icons for different categories
  const icons = [
    <svg key="icon1" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>,
    <svg key="icon2" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.38 13.18L20.35 15.15C20.33 16.31 20.32 17.15 20.15 17.79C20.02 18.32 19.82 18.78 19.47 19.13C19.12 19.48 18.66 19.68 18.13 19.81C17.49 19.97 16.65 19.99 15.49 20.01L13.52 20.04C10.48 20.09 8.96 20.12 7.79 19.53C6.77 19.02 5.98 18.23 5.47 17.21C4.88 16.04 4.91 14.52 4.96 11.48L4.99 9.51C5.01 8.35 5.02 7.51 5.19 6.87C5.32 6.34 5.52 5.88 5.87 5.53C6.22 5.18 6.68 4.98 7.21 4.85C7.85 4.68 8.69 4.67 9.85 4.65L11.82 4.62C14.86 4.57 16.38 4.54 17.55 5.13C18.57 5.64 19.36 6.43 19.87 7.45C20.46 8.62 20.43 10.14 20.38 13.18Z" />
    </svg>,
    <svg key="icon3" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ];
  
  const icon = icons[id % icons.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/category/${id}`} className="block group">
        <motion.div
          className={`relative h-64 rounded-2xl overflow-hidden glass-card bg-gradient-to-r ${gradient}`}
          whileHover={{ 
            scale: 1.03,
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" 
          }}
        >
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
          >
            {icon}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-white text-xl font-bold">{name}</h3>
            <motion.p 
              className="text-white/80 mt-2 group-hover:text-white transition-colors flex items-center"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              Shop Now 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
 