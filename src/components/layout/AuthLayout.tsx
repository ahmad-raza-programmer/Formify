import { Outlet, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutTemplate } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
            <LayoutTemplate className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Formify</span>
        </Link>
        
        <div className="bg-white py-8 px-4 sm:px-10 border border-gray-100 sm:rounded-2xl sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
