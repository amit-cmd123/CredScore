import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Settings, LogOut, CheckCircle, AlertCircle, Menu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getApplications, getUsers, getNotifications, saveNotifications } from '../utils/dataStore';

const Header = ({ userRole, userName, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAllNotifsModal, setShowAllNotifsModal] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const displayAvatar = currentUser.avatar;
  const displayName = userName || currentUser.name || 'Admin';
  const displayRole = userRole || currentUser.role || 'Administrator';
  
  const applications = getApplications() || [];
  const users = getUsers() || [];
  const allNotifs = getNotifications() || [];
  
  // Filter notifications for the current user
  const [myNotifs, setMyNotifs] = useState(() => {
    return allNotifs.filter(n => n.targetUserId === currentUser.id || (n.targetUserId === 'ALL' && (n.targetRole === currentUser.role || n.targetRole === 'ALL')));
  });

  // Keep them up to date in case another tab changes them (optional simulation)
  useEffect(() => {
    const handleStorageChange = () => {
      const freshNotifs = getNotifications() || [];
      setMyNotifs(freshNotifs.filter(n => n.targetUserId === currentUser.id || (n.targetUserId === 'ALL' && (n.targetRole === currentUser.role || n.targetRole === 'ALL'))));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser.role, currentUser.id]);

  const unreadCount = myNotifs.filter(n => !n.read).length;

  const markAllRead = () => {
    const fullNotifs = getNotifications();
    const updated = fullNotifs.map(n => {
      if (n.targetUserId === currentUser.id || (n.targetUserId === 'ALL' && (n.targetRole === currentUser.role || n.targetRole === 'ALL'))) {
        return { ...n, read: true };
      }
      return n;
    });
    saveNotifications(updated);
    setMyNotifs(updated.filter(n => n.targetUserId === currentUser.id || (n.targetUserId === 'ALL' && (n.targetRole === currentUser.role || n.targetRole === 'ALL'))));
  };

  const getTimeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearchResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    import('../utils/dataStore').then(({ addNotification }) => {
      addNotification(currentUser.role, currentUser.id, 'Logged Out', 'You have successfully logged out of your account.', 'info');
    });
    localStorage.removeItem('credscore_current_user');
    navigate('/login');
  };

  const getGlobalSearchResults = () => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    const results = [];
    
    if (currentUser.role === 'Admin') {
      // Admin Search: All applications and users
      applications.forEach(app => {
        if (app.id.toLowerCase().includes(query) || app.name.toLowerCase().includes(query)) {
          results.push({
            id: app.id,
            type: 'Application',
            title: `${app.name} - ${app.amount}`,
            data: app,
            route: '/admin/decisions'
          });
        }
      });

      users.forEach(user => {
        if (user.id.toLowerCase().includes(query) || user.name.toLowerCase().includes(query)) {
          results.push({
            id: user.id,
            type: 'Applicant',
            title: `${user.name} Profile`,
            data: user,
            route: `/admin/applicants/${user.id}`
          });
        }
      });
    } else {
      // User Search: Only their own applications and quick links
      const myApps = applications.filter(a => a.userId === currentUser.id);
      myApps.forEach(app => {
        if (app.id.toLowerCase().includes(query) || app.amount.toLowerCase().includes(query)) {
          results.push({
            id: app.id,
            type: 'My Application',
            title: `Loan for ${app.amount}`,
            data: app,
            route: '/user/history'
          });
        }
      });

      const quickLinks = [
        { id: 'LINK-1', name: 'Apply for Loan', route: '/user/application' },
        { id: 'LINK-2', name: 'My Credit Score', route: '/user/score' },
        { id: 'LINK-3', name: 'EMI Calculator', route: '/user/emi' },
        { id: 'LINK-4', name: 'Help & Support', route: '/user/support' }
      ];

      quickLinks.forEach(link => {
        if (link.name.toLowerCase().includes(query)) {
          results.push({
            id: 'QUICK-LINK',
            type: 'Feature',
            title: link.name,
            data: null,
            route: link.route
          });
        }
      });
    }

    return results.slice(0, 8); // return top 8 results
  };

  const globalResults = getGlobalSearchResults();

  const handleSelectResult = (result) => {
    setShowSearchResults(false);
    setSearchQuery('');
    if (result.type === 'Application') {
      navigate(result.route, { state: { applicant: result.data } });
    } else if (result.type === 'Feature' || result.type === 'My Application') {
      navigate(result.route);
    } else {
      navigate(result.route, { state: { applicant: result.data } });
    }
  };

  return (
    <div className="h-20 border-b border-[#1E2A68]/50 bg-[#09133E]/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 z-30 sticky top-0 gap-4">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(true)}
        className="md:hidden text-[#94A3B8] hover:text-[#FFFFFF] transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative hidden sm:block" ref={searchRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#94A3B8]" />
          </div>
          <input
            type="search"
            name="global_search_credscore"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => { if(searchQuery.length > 0) setShowSearchResults(true); }}
            className="block w-full pl-11 pr-4 py-2.5 bg-[#101B57] border border-[#1E2A68] rounded-full text-sm text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all placeholder:text-[#94A3B8]"
            placeholder={currentUser.role === 'Admin' ? "Search applications, applicants, or reports..." : "Search your applications or features (e.g. 'EMI')..."}
          />
        </div>
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery && (
          <div className="absolute top-full left-0 w-full mt-2 bg-[#101B57] border border-[#1E2A68] rounded-xl shadow-2xl overflow-hidden py-2 z-50">
            <div className="px-4 py-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Quick Results</div>
            {globalResults.length > 0 ? (
              globalResults.map((result, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelectResult(result)}
                  className="px-4 py-3 hover:bg-[#0A1445] cursor-pointer flex flex-col transition-colors border-l-2 border-transparent hover:border-[#3B82F6]"
                >
                  <span className="text-[#FFFFFF] text-sm font-medium">{result.title}</span>
                  <span className="text-[#3B82F6] text-xs mt-0.5">{result.id} • {result.type}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-[#94A3B8] text-sm">No results found for "{searchQuery}"</div>
            )}
          </div>
        )}
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 transition-colors rounded-full ${showNotifications ? 'bg-[#1E2A68] text-[#FFFFFF]' : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1E2A68]/50'}`}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-[#09133E]"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-[#101B57] border border-[#1E2A68] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
              <div className="p-4 border-b border-[#1E2A68] flex justify-between items-center bg-[#09133E]">
                <h3 className="font-bold text-[#FFFFFF]">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
                <span onClick={markAllRead} className="text-xs text-[#3B82F6] cursor-pointer hover:text-[#FFFFFF]">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {myNotifs.length > 0 ? myNotifs.slice(0, 5).map(n => (
                  <div key={n.id} className={`p-4 border-b border-[#1E2A68] hover:bg-[#0A1445] cursor-pointer transition-colors flex gap-3 ${!n.read ? 'bg-[#0A1445]/50' : 'opacity-70'}`}>
                    <div className="mt-1">
                      {n.type === 'success' ? <CheckCircle className="text-[#10B981]" size={18} /> : <AlertCircle className="text-[#3B82F6]" size={18} />}
                    </div>
                    <div>
                      <p className="text-sm text-[#FFFFFF] font-medium mb-1">{n.title}</p>
                      <p className="text-xs text-[#94A3B8]">{n.desc}</p>
                      <p className="text-xs text-[#3B82F6] mt-2">{getTimeAgo(n.time)}</p>
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-[#94A3B8] text-sm">No notifications.</div>
                )}
              </div>
              <div 
                onClick={() => {
                  setShowNotifications(false);
                  setShowAllNotifsModal(true);
                }}
                className="p-3 text-center border-t border-[#1E2A68] bg-[#09133E] hover:bg-[#1E2A68] cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium text-[#FFFFFF]">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Full Screen Notifications Modal */}
        {showAllNotifsModal && (
          <div className="fixed inset-0 bg-[#050B2D]/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#101B57] p-8 rounded-2xl border border-[#1E2A68] max-w-2xl w-full h-[80vh] flex flex-col animate-fade-in-up relative">
              <button 
                onClick={() => setShowAllNotifsModal(false)}
                className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#FFFFFF] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#FFFFFF] mb-2">All Notifications</h3>
                  <p className="text-sm text-[#94A3B8]">Your complete notification history.</p>
                </div>
                <button onClick={markAllRead} className="text-sm text-[#3B82F6] hover:text-[#FFFFFF] transition-colors font-medium">Mark all as read</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {myNotifs.length > 0 ? myNotifs.map(n => (
                  <div key={n.id} className={`p-4 rounded-xl border border-[#1E2A68] transition-colors flex gap-4 ${!n.read ? 'bg-[#09133E]' : 'bg-[#0A1445] opacity-70'}`}>
                    <div className="mt-1 bg-[#101B57] p-2 rounded-lg border border-[#1E2A68]">
                      {n.type === 'success' ? <CheckCircle className="text-[#10B981]" size={20} /> : <AlertCircle className="text-[#3B82F6]" size={20} />}
                    </div>
                    <div>
                      <p className="text-base text-[#FFFFFF] font-bold mb-1">{n.title}</p>
                      <p className="text-sm text-[#94A3B8]">{n.desc}</p>
                      <p className="text-xs text-[#3B82F6] mt-2 font-medium">{getTimeAgo(n.time)}</p>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-center h-full text-[#94A3B8]">
                    No notifications in your history.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer pl-4 md:pl-6 border-l border-[#1E2A68] hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-[#FFFFFF] font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] overflow-hidden">
              {displayAvatar ? (
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold text-[#FFFFFF]">{displayName}</span>
              <span className="text-xs text-[#94A3B8]">{displayRole}</span>
            </div>
          </div>
          
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-3 w-48 bg-[#101B57] border border-[#1E2A68] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
              <div className="p-2">
                <Link to={currentUser.role === 'Admin' ? "/admin/settings" : "/user/settings"} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#FFFFFF] hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] rounded-lg transition-colors cursor-pointer">
                  <User size={16} />
                  My Profile
                </Link>
                <Link to={currentUser.role === 'Admin' ? "/admin/settings" : "/user/settings"} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#FFFFFF] hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] rounded-lg transition-colors cursor-pointer">
                  <Settings size={16} />
                  Settings
                </Link>
              </div>
              <div className="p-2 border-t border-[#1E2A68]">
                <div 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors cursor-pointer font-medium"
                >
                  <LogOut size={16} />
                  Log Out
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
