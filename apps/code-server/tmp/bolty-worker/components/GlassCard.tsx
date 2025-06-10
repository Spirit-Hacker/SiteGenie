"use client";

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard = ({ children, className = '', delay = 0 }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)" 
      }}
    >
      {children}
    </motion.div>
  );
};
 