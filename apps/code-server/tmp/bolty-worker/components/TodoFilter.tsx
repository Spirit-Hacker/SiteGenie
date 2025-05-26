"use client";

import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FilterType } from '@/components/TodoApp';

interface TodoFilterProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  isFirstRender: boolean;
}

const filterButtonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1 + 0.2,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  })
};

const TodoFilter: React.FC<TodoFilterProps> = ({ filter, setFilter, isFirstRender }) => {
  const buttonClass = (currentFilter: FilterType) => 
    clsx("px-3 py-1 text-sm rounded-md focus:outline-none transition-colors", {
      "bg-primary text-white": filter === currentFilter,
      "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700": filter !== currentFilter
    });

  const filters: FilterType[] = ['all', 'active', 'completed'];

  return (
    <motion.div 
      className="flex justify-center space-x-2 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {filters.map((filterType, index) => (
        <motion.button 
          key={filterType}
          className={buttonClass(filterType)}
          onClick={() => setFilter(filterType)}
          variants={isFirstRender ? filterButtonVariants : {}}
          initial={isFirstRender ? "hidden" : false}
          animate={isFirstRender ? "visible" : true}
          custom={index}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default TodoFilter;
 