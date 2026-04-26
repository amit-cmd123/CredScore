import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X } from 'lucide-react';

const Sidebar = ({ navItems, title, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const dashboardPath = currentUser.role === 'Admin' ? '/admin-dashboard' : '/user-dashboard';

  return (
    <div className={`w-64 bg-[#0A1445]/95 md:bg-[#0A1445]/80 backdrop-blur-xl border-r border-[#1E2A68]/50 h-screen flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="h-20 flex flex-col justify-center px-6 border-b border-[#1E2A68]/50 shrink-0 relative">
        <Link to={dashboardPath} onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}>
          <h1 className="text-2xl font-bold text-[#FFFFFF] tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              CS
            </div>
            CredScore
          </h1>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          className="absolute right-4 text-[#94A3B8] hover:text-[#FFFFFF] md:hidden"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                  : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#101B57] border border-transparent'
              }`
            }
          >
            <div className={`transition-colors`}>
              {item.icon}
            </div>
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
