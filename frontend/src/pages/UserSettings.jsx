import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { User, Lock, Bell, Shield, Save, CheckCircle2, AlertCircle, AlertTriangle, Eye, EyeOff, Sun, Moon, Monitor } from 'lucide-react';
import { addNotification, getNotifications, saveNotifications } from '../utils/dataStore';

const AppearanceSettingsTab = () => {
  const [theme, setTheme] = useState(localStorage.getItem('credscore_theme') || 'light');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('credscore_theme', newTheme);
    
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.className = isDark ? 'dark-theme' : 'light-theme';
    } else {
      document.documentElement.className = newTheme + '-theme';
    }
  };

  return (
    <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-8 animate-fade-in-up">
      <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Appearance</h2>
      <p className="text-sm text-[#94A3B8] mb-6">Select your preferred theme for the CredScore portal.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Light Mode */}
        <button 
          onClick={() => handleThemeChange('light')}
          className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all gap-3 relative overflow-hidden cursor-pointer ${
            theme === 'light'
              ? 'border-[#3B82F6] bg-[#09133E] text-[#FFFFFF]'
              : 'border-[#1E2A68] hover:border-[#94A3B8] bg-transparent text-[#94A3B8]'
          }`}
        >
          {theme === 'light' && <div className="absolute top-2 right-2 w-3 h-3 bg-[#3B82F6] rounded-full"></div>}
          <Sun size={32} className={theme === 'light' ? 'text-[#3B82F6]' : ''} />
          <span className="font-bold">Light Mode</span>
        </button>

        {/* Dark Mode */}
        <button 
          onClick={() => handleThemeChange('dark')}
          className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all gap-3 relative overflow-hidden cursor-pointer ${
            theme === 'dark'
              ? 'border-[#3B82F6] bg-[#09133E] text-[#FFFFFF]'
              : 'border-[#1E2A68] hover:border-[#94A3B8] bg-transparent text-[#94A3B8]'
          }`}
        >
          {theme === 'dark' && <div className="absolute top-2 right-2 w-3 h-3 bg-[#3B82F6] rounded-full"></div>}
          <Moon size={32} className={theme === 'dark' ? 'text-[#3B82F6]' : ''} />
          <span className="font-bold">Dark Mode</span>
        </button>

        {/* System Sync */}
        <button 
          onClick={() => handleThemeChange('system')}
          className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all gap-3 relative overflow-hidden cursor-pointer ${
            theme === 'system'
              ? 'border-[#3B82F6] bg-[#09133E] text-[#FFFFFF]'
              : 'border-[#1E2A68] hover:border-[#94A3B8] bg-transparent text-[#94A3B8]'
          }`}
        >
          {theme === 'system' && <div className="absolute top-2 right-2 w-3 h-3 bg-[#3B82F6] rounded-full"></div>}
          <Monitor size={32} className={theme === 'system' ? 'text-[#3B82F6]' : ''} />
          <span className="font-bold">System Sync</span>
        </button>
      </div>
    </div>
  );
};

const UserSettings = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');

  const [myNotifs, setMyNotifs] = useState(() => {
    const allNotifs = getNotifications() || [];
    return allNotifs.filter(n => n.targetUserId === currentUser.id || (n.targetUserId === 'ALL' && (n.targetRole === currentUser.role || n.targetRole === 'ALL')));
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const freshNotifs = getNotifications() || [];
      setMyNotifs(freshNotifs.filter(n => n.targetUserId === currentUser.id || (n.targetUserId === 'ALL' && (n.targetRole === currentUser.role || n.targetRole === 'ALL'))));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser.role, currentUser.id]);

  const handleNotifClick = (notif) => {
    const fullNotifs = getNotifications();
    const updated = fullNotifs.map(n => {
      if (n.id === notif.id) {
        return { ...n, read: true };
      }
      return n;
    });
    saveNotifications(updated);
    
    // Update local state directly so it re-renders instantly without a full page reload!
    setMyNotifs(updated.filter(n => n.targetUserId === currentUser.id || (n.targetUserId === 'ALL' && (n.targetRole === currentUser.role || n.targetRole === 'ALL'))));

    // Navigate appropriately
    const title = notif.title.toLowerCase();
    if (title.includes('login') || title.includes('welcome') || title.includes('logout')) {
      navigate('/user-dashboard');
    } else if (title.includes('apply') || title.includes('submit') || title.includes('created')) {
      navigate('/user/history');
    } else if (title.includes('decision') || title.includes('approve') || title.includes('reject') || title.includes('active') || title.includes('agreement') || title.includes('signed')) {
      navigate('/user/decision');
    } else if (title.includes('profile') || title.includes('password') || title.includes('settings')) {
      navigate('/user/settings');
    } else if (title.includes('score') || title.includes('recalculate')) {
      navigate('/user/score');
    } else if (title.includes('support') || title.includes('ticket')) {
      navigate('/user/support');
    } else {
      navigate('/user-dashboard');
    }
  };

  const [activeTab, setActiveTab] = useState('profile');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState(currentUser.name ? currentUser.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(currentUser.name ? currentUser.name.split(' ').slice(1).join(' ') : '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [timezone, setTimezone] = useState(currentUser.timezone || 'Eastern Time (ET)');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || null);
  
  const fileInputRef = React.useRef(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert("File size exceeds 800KB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    const fullName = `${firstName} ${lastName}`.trim();
    const updatedUser = {
      ...currentUser,
      name: fullName,
      phone: phone,
      timezone: timezone,
      avatar: avatarUrl
    };
    
    localStorage.setItem('credscore_current_user', JSON.stringify(updatedUser));
    
    const existingUsers = JSON.parse(localStorage.getItem('credscore_users')) || [];
    const userIndex = existingUsers.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
      existingUsers[userIndex] = { ...existingUsers[userIndex], ...updatedUser };
      localStorage.setItem('credscore_users', JSON.stringify(existingUsers));
    }
    
    addNotification(currentUser.role, currentUser.id, 'Profile Updated', 'Your personal details were successfully changed.', 'info');
    
    window.location.reload();
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPassError('Password must be at least 8 characters long.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('credscore_users')) || [];
    const userIndex = existingUsers.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
      if (existingUsers[userIndex].password && existingUsers[userIndex].password !== currentPassword) {
        setPassError('Incorrect current password.');
        return;
      }
      
      existingUsers[userIndex].password = newPassword;
      localStorage.setItem('credscore_users', JSON.stringify(existingUsers));
    }
    
    localStorage.setItem('credscore_current_user', JSON.stringify({
      ...currentUser,
      password: newPassword
    }));

    addNotification(currentUser.role, currentUser.id, 'Password Updated', 'Your security password was successfully changed.', 'success');

    setPassError('');
    setPassSuccess('Password updated successfully!');
    setTimeout(() => {
      setPassSuccess('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 3000);
  };

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Account Settings</h1>
        <p className="text-[#94A3B8]">Manage your profile, security, and notification preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] overflow-hidden flex flex-col">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-2 ${activeTab === 'profile' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]' : 'text-[#94A3B8] border-transparent hover:bg-[#1E2A68]/50 hover:text-[#FFFFFF]'}`}
            >
              <User size={18} /> Profile Details
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-2 ${activeTab === 'security' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]' : 'text-[#94A3B8] border-transparent hover:bg-[#1E2A68]/50 hover:text-[#FFFFFF]'}`}
            >
              <Lock size={18} /> Password & Security
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-2 ${activeTab === 'notifications' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]' : 'text-[#94A3B8] border-transparent hover:bg-[#1E2A68]/50 hover:text-[#FFFFFF]'}`}
            >
              <Bell size={18} /> Notifications
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-2 ${activeTab === 'appearance' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]' : 'text-[#94A3B8] border-transparent hover:bg-[#1E2A68]/50 hover:text-[#FFFFFF]'}`}
            >
              <Moon size={18} /> Appearance
            </button>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-8 animate-fade-in-up">
              <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Profile Details</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-[#3B82F6] rounded-full flex items-center justify-center text-4xl text-[#FFFFFF] font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (currentUser.name || 'U').charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/png, image/jpeg, image/gif" 
                    className="hidden" 
                  />
                  <button onClick={handleUploadClick} className="px-4 py-2 bg-[#050B2D] border border-[#1E2A68] text-[#FFFFFF] font-medium rounded-lg hover:bg-[#1E2A68] transition-colors mb-2">
                    Change Avatar
                  </button>
                  <p className="text-xs text-[#94A3B8]">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email Address</label>
                  <input type="email" value={currentUser.email} disabled className="w-full bg-[#050B2D]/50 border border-[#1E2A68] rounded-xl px-4 py-3 text-[#94A3B8] cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">Timezone</label>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none appearance-none">
                    <option>Eastern Time (ET)</option>
                    <option>Pacific Time (PT)</option>
                    <option>Central Time (CT)</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1E2A68] flex justify-end">
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-[#FFFFFF] font-bold rounded-xl shadow-lg shadow-[#3B82F6]/20 transition-colors">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-8 animate-fade-in-up">
              <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Password & Security</h2>
              <p className="text-[#94A3B8] text-sm mb-6">Update your password or enable two-factor authentication.</p>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl pl-4 pr-10 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">New Password</label>
                  <div className="relative">
                    <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl pl-4 pr-10 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl pl-4 pr-10 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {passError && <p className="text-sm text-[#EF4444] font-medium">{passError}</p>}
                {passSuccess && <p className="text-sm text-[#10B981] font-medium flex items-center gap-2"><CheckCircle2 size={16} /> {passSuccess}</p>}
                
                <button onClick={handleUpdatePassword} className="mt-4 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-[#FFFFFF] font-bold rounded-xl shadow-lg shadow-[#3B82F6]/20 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-8 animate-fade-in-up">
              <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Recent Notifications</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {myNotifs.length > 0 ? myNotifs.map(n => (
                  <div key={n.id} onClick={() => handleNotifClick(n)} className={`p-4 bg-[#050B2D] hover:bg-[#0A1445]/30 cursor-pointer border border-[#1E2A68] rounded-xl flex items-start gap-4 transition-colors ${!n.read ? 'border-[#3B82F6]/40' : 'opacity-70'}`}>
                    <div className="mt-1">
                      {n.type === 'success' && <CheckCircle2 className="text-[#10B981]" size={20} />}
                      {n.type === 'error' && <AlertCircle className="text-[#EF4444]" size={20} />}
                      {n.type === 'info' && <Bell className="text-[#3B82F6]" size={20} />}
                      {n.type === 'warning' && <AlertTriangle className="text-[#F59E0B]" size={20} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#FFFFFF]">{n.title}</h4>
                      <p className="text-xs text-[#94A3B8] mt-1">{n.desc}</p>
                      <p className="text-[10px] text-[#94A3B8]/60 mt-2">{new Date(n.time).toLocaleString()}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-[#94A3B8]">No recent notifications found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <AppearanceSettingsTab />
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSettings;
