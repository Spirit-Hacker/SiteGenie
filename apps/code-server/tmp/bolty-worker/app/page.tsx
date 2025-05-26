import TodoApp from '@/components/TodoApp';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center gradient-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 -z-10"
      ></motion.div>
      <TodoApp />
    </div>
  );
}
 