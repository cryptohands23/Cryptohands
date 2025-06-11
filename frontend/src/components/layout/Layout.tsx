import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '../../store';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  currentPath, 
  onNavigate 
}) => {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header title={title} subtitle={subtitle} />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;