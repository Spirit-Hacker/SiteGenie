"use client";

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from '@/types/todo';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import TodoHeader from '@/components/TodoHeader';
import TodoFilter from '@/components/TodoFilter';

export type FilterType = 'all' | 'active' | 'completed';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTodos = localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    }
    return [];
  });
  const [filter, setFilter] = useState<FilterType>('all');
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // After initial render, set isFirstRender to false
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [todos, isFirstRender]);

  const addTodo = (text: string) => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: uuidv4(),
        text,
        completed: false,
        createdAt: Date.now(),
      };
      setTodos([newTodo, ...todos]);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <motion.div 
        className="p-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <TodoHeader activeCount={activeCount} completedCount={completedCount} />
        <TodoForm addTodo={addTodo} />
        <TodoFilter filter={filter} setFilter={setFilter} isFirstRender={isFirstRender} />
        
        <AnimatePresence mode="popLayout">
          <TodoList 
            todos={filteredTodos} 
            toggleTodo={toggleTodo} 
            removeTodo={removeTodo} 
          />
        </AnimatePresence>
        
        {completedCount > 0 && (
          <motion.div 
            className="mt-4 text-right"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={clearCompleted}
              className="text-sm text-gray-500 hover:text-destructive dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear completed
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TodoApp;
 