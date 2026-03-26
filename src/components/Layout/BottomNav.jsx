import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Scan, MessageCircle, UserCircle } from 'lucide-react';

const mobileItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
  { icon: Scan, label: 'Scan', path: '/upload-scan' },
  { icon: Calendar, label: 'Doctors', path: '/doctors' },
  { icon: MessageCircle, label: 'Chat', path: '/chatbot' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
];

const BottomNav = () => {
  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] w-full safe-area-pb">
      <div className="flex justify-around items-center h-[4.5rem] px-2">
        {mobileItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 ${
                isActive 
                  ? 'text-primary-teal scale-105' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-full ${isActive ? 'bg-teal-50 dark:bg-gray-700' : ''}`}>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
