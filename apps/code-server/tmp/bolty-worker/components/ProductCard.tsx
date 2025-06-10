"use client";

import { motion } from 'motion/react';
import Link from "next/link";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, category, index }) => {
  // Generate a unique gradient for each product based on id
  const gradients = [
    "from-purple-500/40 to-indigo-500/40",
    "from-indigo-500/40 to-blue-500/40",
    "from-blue-500/40 to-cyan-500/40",
    "from-cyan-500/40 to-teal-500/40"
  ];
  
  const gradient = gradients[id % gradients.length];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card group rounded-2xl overflow-hidden transition-all duration-300"
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" 
      }}
    >
      <div className={`relative h-64 overflow-hidden bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
        >
          <button className="w-full backdrop-blur-md bg-white/20 text-white py-2 rounded-md font-medium hover:bg-white/30 transition">
            Quick View
          </button>
        </motion.div>
      </div>
      <div className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-medium text-lg mb-1 hover:text-indigo-600 transition">{name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2">{category}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
          <motion.button 
            className="flex items-center justify-center h-10 w-10 rounded-full backdrop-blur-md bg-indigo-500/20 text-indigo-600 hover:bg-indigo-500/30 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
 