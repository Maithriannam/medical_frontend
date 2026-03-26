import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-surface-light dark:bg-gray-900 overflow-hidden font-sans">
      <div className="hidden md:flex z-40 relative">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-light dark:bg-gray-900 transition-colors duration-200 pb-20 md:pb-0">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-[1600px] flex flex-col gap-6">
            <Outlet />
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-50">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
