"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TodoFormProps {
  addTodo: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      setIsSubmitting(true);
      
      // Add a small delay for better visual feedback
      setTimeout(() => {
        addTodo(text);
        setText('');
        setIsSubmitting(false);
      }, 200);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full py-3 px-4 pr-12 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          autoFocus
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          disabled={isSubmitting}
        />
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-dark p-2 rounded-full focus:outline-none disabled:opacity-50"
          aria-label="Add todo"
          disabled={isSubmitting || !text.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      </motion.div>
    </form>
  );
};

export default TodoForm;
 