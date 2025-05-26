"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from '@/types/todo';
import TodoItem from '@/components/TodoItem';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, removeTodo }) => {
  if (todos.length === 0) {
    return (
      <motion.div 
        className="py-12 text-center text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No todos yet. Add one above!
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.ul 
      className="divide-y divide-gray-200 dark:divide-gray-700 mt-4 bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-sm"
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
            index={index}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
};

export default TodoList;
 