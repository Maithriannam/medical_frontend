import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, ClipboardList, Stethoscope, Building2, History, Leaf, MessageSquare, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Upload, label: 'Upload Scan', path: '/upload-scan' },
  { icon: ClipboardList, label: 'Symptoms', path: '/symptoms' },
  { icon: MessageSquare, label: 'Chatbot', path: '/chatbot' },
  { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
  { icon: Building2, label: 'Hospitals', path: '/hospitals' },
  { icon: Leaf, label: 'Remedies', path: '/remedies' },
  { icon: History, label: 'History', path: '/history' },
];

const Sidebar = () => {
  const { user } = useAuth();
  
  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col h-full flex-shrink-0 transition-colors duration-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <Sparkles className="text-primary-teal" />
          <span>DermaAI</span>
        </h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-teal text-white shadow-md' 
                  : 'hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="p-4 bg-gray-900 border-t border-gray-800 mt-auto">
          <NavLink 
            to="/profile"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800 transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-primary-teal text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:shadow-md transition-all">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name || 'User Profile'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
