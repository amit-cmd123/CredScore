import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, navItems, title, userRole, userName }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-transparent font-sans overflow-hidden">
      <Sidebar 
        navItems={navItems} 
        title={title} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <div className="flex-1 md:ml-64 flex flex-col h-screen w-full transition-all duration-300">
        <Header 
          userRole={userRole} 
          userName={userName} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent w-full">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
