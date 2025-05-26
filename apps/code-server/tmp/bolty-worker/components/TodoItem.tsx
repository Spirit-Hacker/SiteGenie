"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  index: number;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, removeTodo, index }) => {
  // Animation variants
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }),
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.2
      }
    }
  };

  const checkboxVariants = {
    checked: { 
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 }
    },
    unchecked: { 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const textVariants = {
    checked: { 
      color: "var(--muted-foreground)",
      textDecoration: "line-through",
      transition: { duration: 0.3 }
    },
    unchecked: { 
      color: "var(--foreground)",
      textDecoration: "none",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.li
      layout
      variants={item}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      className="group flex items-center p-3 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      whileHover={{ 
        backgroundColor: "rgba(0,0,0,0.02)",
        transition: { duration: 0.2 }
      }}
    >
      <motion.button
        onClick={() => toggleTodo(todo.id)}
        className="flex-shrink-0 mr-3 focus:outline-none"
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        variants={checkboxVariants}
        animate={todo.completed ? "checked" : "unchecked"}
      >
        <motion.div 
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            todo.completed 
              ? 'border-primary bg-primary text-white' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          initial={false}
        >
          {todo.completed && (
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.svg>
          )}
        </motion.div>
      </motion.button>
      
      <motion.span 
        className="flex-grow text-gray-800 dark:text-gray-200"
        variants={textVariants}
        animate={todo.completed ? "checked" : "unchecked"}
      >
        {todo.text}
      </motion.span>
      
      <motion.button
        onClick={() => removeTodo(todo.id)}
        className="ml-2 text-gray-400 hover:text-destructive focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete todo"
        whileHover={{ 
          scale: 1.1,
          color: "var(--destructive)",
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </motion.button>
    </motion.li>
  );
};

export default TodoItem;
 