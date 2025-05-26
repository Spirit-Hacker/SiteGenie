"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TodoHeaderProps {
  activeCount: number;
  completedCount: number;
}

const todoText = {
  hidden: { opacity: 0, y: -20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  })
};

const TodoHeader: React.FC<TodoHeaderProps> = ({ activeCount, completedCount }) => {
  const totalCount = activeCount + completedCount;
  const title = "Todo App";
  
  return (
    <div className="mb-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 overflow-hidden py-2">
        {title.split("").map((letter, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </h1>
      
      <motion.div
        variants={todoText}
        initial="hidden"
        animate="show"
      >
        <p className="text-gray-600 dark:text-gray-400">
          {totalCount === 0 ? (
            "Start by adding a new task below"
          ) : (
            <>
              You have <motion.span 
                className="font-medium text-primary"
                key={activeCount}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {activeCount}
              </motion.span> active 
              {activeCount === 1 ? ' task' : ' tasks'}
              {completedCount > 0 && (
                <> and <motion.span 
                  className="font-medium text-green-500"
                  key={completedCount}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {completedCount}
                </motion.span> completed</>
              )}
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default TodoHeader;
 