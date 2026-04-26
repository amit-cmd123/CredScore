import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { User, Lock, Bell, Shield, Moon, Sun, Monitor, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ProfileSettingsTab = () => {
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const [firstName, setFirstName] = useState(currentUser.name ? currentUser.name.split(' ')[0] : 'Admin');
  const [lastName, setLastName] = useState(currentUser.name ? currentUser.name.split(' ')[1] || '' : 'User');
  const [email, setEmail] = useState(currentUser.email || 'admin@credscore.ai');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || null);
  const [avatarInitials, setAvatarInitials] = useState(`${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`);
  const [saveStatus, setSaveStatus] = useState('');
  
  const fileInputRef = React.useRef(null);

  const handleSave = () => {
    const fullName = `${firstName} ${lastName}`.trim();
    const updatedAdmin = {
      ...currentUser,
      name: fullName,
      email: email,
      avatar: avatarUrl
    };
    
    localStorage.setItem('credscore_current_user', JSON.stringify(updatedAdmin));
    
    const existingUsers = JSON.parse(localStorage.getItem('credscore_users')) || [];
    const userIndex = existingUsers.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
      existingUsers[userIndex] = { ...existingUsers[userIndex], ...updatedAdmin };
      localStorage.setItem('credscore_users', JSON.stringify(existingUsers));
    }
    
    setSaveStatus('Changes saved successfully!');
    
    // Refresh page to update header
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

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

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in-up">
      <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Profile Settings</h2>
      
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-[#09133E] rounded-full flex items-center justify-center text-3xl font-bold text-[#3B82F6] border-2 border-[#1E2A68] overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            avatarInitials.toUpperCase()
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
          <button onClick={handleUploadClick} className="px-4 py-2 bg-[#3B82F6] text-[#FFFFFF] rounded-lg text-sm font-medium hover:bg-[#2563EB] transition-colors mb-2">
            Upload New Avatar
          </button>
          <p className="text-xs text-[#94A3B8]">JPG, GIF or PNG. Max size of 800K</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">First Name</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-[#09133E] border border-[#1E2A68] rounded-lg px-4 py-2.5 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" 
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">Last Name</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-[#09133E] border border-[#1E2A68] rounded-lg px-4 py-2.5 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" 
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#09133E] border border-[#1E2A68] rounded-lg px-4 py-2.5 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" 
          />
        </div>
      </div>
      
      <div className="pt-6 border-t border-[#1E2A68] flex justify-end items-center gap-4">
        {saveStatus && (
          <span className="text-sm font-medium text-[#10B981] flex items-center gap-1">
            <CheckCircle2 size={16} /> {saveStatus}
          </span>
        )}
        <button onClick={handleSave} className="px-6 py-2.5 bg-[#3B82F6] text-[#FFFFFF] rounded-lg text-sm font-bold hover:bg-[#2563EB] transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          Save Changes
        </button>
      </div>

      <div className="mt-12 pt-8 border-t border-[#1E2A68]">
        <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">Developer Tools</h3>
        <p className="text-sm text-[#94A3B8] mb-6">Export the current state of your local database to share via GitHub or back up your work.</p>
        
        <button 
          onClick={() => {
            const data = {
              users: JSON.parse(localStorage.getItem('credscore_users') || '[]'),
              applications: JSON.parse(localStorage.getItem('credscore_applications') || '[]'),
              notifications: JSON.parse(localStorage.getItem('credscore_notifications') || '[]')
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'seed.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-6 py-2.5 bg-[#09133E] border border-[#3B82F6] text-[#3B82F6] rounded-lg text-sm font-bold hover:bg-[#3B82F6] hover:text-[#FFFFFF] transition-colors"
        >
          Export Database (seed.json)
        </button>
      </div>
    </div>
  );
};

const SecuritySettingsTab = () => {
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [is2FAEnabled, setIs2FAEnabled] = useState(currentUser.twoFactorEnabled || false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('credscore_users')) || [];
    const userIndex = existingUsers.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
      // Validate current password (if user had one set)
      if (existingUsers[userIndex].password && existingUsers[userIndex].password !== currentPassword) {
        setErrorMsg('Incorrect current password.');
        return;
      }
      
      // Update password
      existingUsers[userIndex].password = newPassword;
      localStorage.setItem('credscore_users', JSON.stringify(existingUsers));
    }
    
    // Update current session just in case
    localStorage.setItem('credscore_current_user', JSON.stringify({
      ...currentUser,
      password: newPassword
    }));

    setErrorMsg('');
    setSaveStatus('Password updated successfully!');
    setTimeout(() => {
      setSaveStatus('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 3000);
  };

  const toggle2FA = () => {
    if (is2FAEnabled) {
      // Disable it immediately
      setIs2FAEnabled(false);
      const updatedUser = { ...currentUser, twoFactorEnabled: false };
      localStorage.setItem('credscore_current_user', JSON.stringify(updatedUser));
      
      const existingUsers = JSON.parse(localStorage.getItem('credscore_users')) || [];
      const userIndex = existingUsers.findIndex(u => u.email === currentUser.email);
      if (userIndex !== -1) {
        existingUsers[userIndex].twoFactorEnabled = false;
        localStorage.setItem('credscore_users', JSON.stringify(existingUsers));
      }
    } else {
      // Show setup modal
      setShow2FAModal(true);
      setVerificationCode('');
      setTwoFAError('');
    }
  };

  const verify2FA = () => {
    if (verificationCode.length < 6) {
      setTwoFAError('Please enter a valid 6-digit code.');
      return;
    }
    
    setIs2FAEnabled(true);
    setShow2FAModal(false);
    
    const updatedUser = { ...currentUser, twoFactorEnabled: true };
    localStorage.setItem('credscore_current_user', JSON.stringify(updatedUser));
    
    const existingUsers = JSON.parse(localStorage.getItem('credscore_users')) || [];
    const userIndex = existingUsers.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
      existingUsers[userIndex].twoFactorEnabled = true;
      localStorage.setItem('credscore_users', JSON.stringify(existingUsers));
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in-up">
      <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Security & Password</h2>
      
      <div className="bg-[#09133E] rounded-xl p-6 border border-[#1E2A68] mb-6 flex items-start gap-4 relative">
        <Shield className="text-[#3B82F6] shrink-0" size={24} />
        <div>
          <h3 className="text-[#FFFFFF] font-bold mb-1">Two-Factor Authentication (2FA)</h3>
          <p className="text-sm text-[#94A3B8] mb-4">Add an extra layer of security to your account by enabling 2FA. We recommend using an authenticator app.</p>
          <button 
            onClick={toggle2FA}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              is2FAEnabled 
                ? 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 border border-[#EF4444]/20' 
                : 'bg-[#1E2A68] text-[#FFFFFF] hover:bg-[#3B82F6]'
            }`}
          >
            {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>
      </div>

      {show2FAModal && (
        <div className="fixed inset-0 bg-[#050B2D]/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#101B57] p-8 rounded-2xl border border-[#1E2A68] max-w-sm w-full animate-fade-in-up">
            <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">Setup Authenticator</h3>
            <p className="text-sm text-[#94A3B8] mb-6">Scan this QR code with Google Authenticator or Authy, then enter the 6-digit code below.</p>
            
            <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl mb-6">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/CredScore:admin@credscore.ai?secret=JBSWY3DPEHPK3PXP&issuer=CredScore" alt="QR Code" className="w-full h-full" />
            </div>

            <input 
              type="text" 
              maxLength="6"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[#09133E] border border-[#1E2A68] rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none mb-2" 
            />
            {twoFAError && <p className="text-[#EF4444] text-xs text-center mb-4">{twoFAError}</p>}
            
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShow2FAModal(false)} className="flex-1 py-2.5 bg-transparent text-[#94A3B8] hover:text-[#FFFFFF] transition-colors font-medium">Cancel</button>
              <button onClick={verify2FA} className="flex-1 py-2.5 bg-[#3B82F6] text-[#FFFFFF] rounded-xl font-bold hover:bg-[#2563EB] transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">Verify</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#FFFFFF] border-b border-[#1E2A68] pb-2">Change Password</h3>
        
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">Current Password</label>
          <input 
            type="password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-[#09133E] border border-[#1E2A68] rounded-lg px-4 py-2.5 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">New Password</label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#09133E] border border-[#1E2A68] rounded-lg px-4 py-2.5 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">Confirm New Password</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#09133E] border border-[#1E2A68] rounded-lg px-4 py-2.5 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" 
          />
        </div>
      </div>
      
      <div className="pt-6 border-t border-[#1E2A68] flex justify-end items-center gap-4">
        {errorMsg && (
          <span className="text-sm font-medium text-[#EF4444]">{errorMsg}</span>
        )}
        {saveStatus && (
          <span className="text-sm font-medium text-[#10B981] flex items-center gap-1">
            <CheckCircle2 size={16} /> {saveStatus}
          </span>
        )}
        <button onClick={handleUpdatePassword} className="px-6 py-2.5 bg-[#3B82F6] text-[#FFFFFF] rounded-lg text-sm font-bold hover:bg-[#2563EB] transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          Update Password
        </button>
      </div>
    </div>
  );
};

const NotificationSettingsTab = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [newAppAlert, setNewAppAlert] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = () => {
    setSaveStatus('Preferences saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in-up">
      <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-[#09133E] border border-[#1E2A68] rounded-xl">
          <div>
            <h3 className="text-[#FFFFFF] font-bold">Email Alerts</h3>
            <p className="text-sm text-[#94A3B8]">Receive daily summaries and critical alerts via email.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
            <div className="w-11 h-6 bg-[#1E2A68] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#09133E] border border-[#1E2A68] rounded-xl">
          <div>
            <h3 className="text-[#FFFFFF] font-bold">SMS Notifications</h3>
            <p className="text-sm text-[#94A3B8]">Get text messages for high-risk flags or system outages.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} />
            <div className="w-11 h-6 bg-[#1E2A68] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#09133E] border border-[#1E2A68] rounded-xl">
          <div>
            <h3 className="text-[#FFFFFF] font-bold">New Application Alert</h3>
            <p className="text-sm text-[#94A3B8]">Notify me instantly when a new loan application is submitted.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={newAppAlert} onChange={(e) => setNewAppAlert(e.target.checked)} />
            <div className="w-11 h-6 bg-[#1E2A68] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
          </label>
        </div>
      </div>
      
      <div className="pt-6 border-t border-[#1E2A68] flex justify-end items-center gap-4">
        {saveStatus && (
          <span className="text-sm font-medium text-[#10B981] flex items-center gap-1">
            <CheckCircle2 size={16} /> {saveStatus}
          </span>
        )}
        <button onClick={handleSave} className="px-6 py-2.5 bg-[#3B82F6] text-[#FFFFFF] rounded-lg text-sm font-bold hover:bg-[#2563EB] transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: <User size={18} /> },
    { id: 'security', name: 'Security & Password', icon: <Lock size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', name: 'Appearance', icon: <Moon size={18} /> },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Settings</h1>
        <p className="text-[#94A3B8]">Manage your admin account and system preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-[#3B82F6] text-[#FFFFFF] shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'bg-transparent text-[#94A3B8] hover:bg-[#101B57] hover:text-[#FFFFFF]'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-[#101B57] rounded-2xl border border-[#1E2A68] p-8">
          {activeTab === 'profile' && (
            <ProfileSettingsTab />
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Appearance</h2>
              
              <p className="text-sm text-[#94A3B8] mb-4">Select your preferred theme for the admin portal.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex flex-col items-center p-4 rounded-xl border-2 border-[#3B82F6] bg-[#09133E] text-[#FFFFFF] gap-3 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 w-3 h-3 bg-[#3B82F6] rounded-full"></div>
                  <Moon size={32} className="text-[#3B82F6]" />
                  <span className="font-bold">Dark Mode</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-xl border border-[#1E2A68] hover:border-[#94A3B8] bg-[#09133E] text-[#94A3B8] gap-3 transition-colors opacity-50 cursor-not-allowed">
                  <Sun size={32} />
                  <span className="font-medium">Light Mode</span>
                  <span className="text-[10px] absolute bottom-2">Coming soon</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-xl border border-[#1E2A68] hover:border-[#94A3B8] bg-[#09133E] text-[#94A3B8] gap-3 transition-colors opacity-50 cursor-not-allowed">
                  <Monitor size={32} />
                  <span className="font-medium">System Sync</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <SecuritySettingsTab />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettingsTab />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
