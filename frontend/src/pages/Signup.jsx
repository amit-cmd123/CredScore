import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, Sun, Moon } from 'lucide-react';
import ParticleNetwork from '../components/ParticleNetwork';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('User');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');

  // Get initial theme from localStorage or default to dark
  const [theme, setTheme] = useState(localStorage.getItem('credscore_theme') || 'dark');
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    // Ensure the document has the correct theme class on load
    if (theme === 'system') {
      const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.className = systemDark ? 'dark-theme' : 'light-theme';
    } else {
      document.documentElement.className = theme + '-theme';
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('credscore_theme', newTheme);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (role === 'Admin' && adminKey !== 'CREDSCORE-ADMIN-2026') {
      setIsLoading(false);
      setError('Invalid Admin Registration Key. You cannot create an admin account.');
      return;
    }

    try {
      const newUser = {
        id: `USR-9${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        email: formData.email,
        password: formData.password, // In a real app, this would be hashed
        role: role,
        // Mock data to prevent breaking admin grids
        phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        location: 'New York, NY',
        income: `$${Math.floor(Math.random() * 80) + 50},000`,
        employer: 'Self-Employed',
        activeLoans: 0
      };

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setIsLoading(false);
        setError(data.error || 'Registration failed.');
        return;
      }

      // Also save current logged in user session
      localStorage.setItem('credscore_current_user', JSON.stringify({ email: newUser.email, role: newUser.role, name: newUser.name, id: newUser.id }));

      // Add notifications
      import('../utils/dataStore').then(m => {
        m.createNotification(newUser.role, newUser.id, 'Welcome to CredScore!', `Your account has been created successfully.`, 'success');
        m.createNotification('Admin', 'ALL', 'New User Registered', `${newUser.name} just registered as a ${newUser.role}.`, 'info');
      });

      setIsLoading(false);
      
      if (role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Failed to connect to the server. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans relative overflow-hidden bg-[#050B2D] text-[#FFFFFF]">
      
      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-[100] p-3 rounded-full backdrop-blur-md transition-all duration-300 border shadow-xl bg-[#101B57]/90 border-[#1E2A68] text-[#3B82F6] hover:bg-[#1E2A68] hover:scale-110"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Enhanced Textured Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 bg-[linear-gradient(to_right,#1E2A68_1px,transparent_1px),linear-gradient(to_bottom,#1E2A68_1px,transparent_1px)]"></div>
        
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] animate-pulse bg-[#3B82F6]/20" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[150px] animate-pulse bg-[#bd34fe]/15" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-[30%] left-[50%] w-[40vw] h-[40vw] rounded-full blur-[120px] animate-pulse bg-[#10B981]/10" style={{ animationDuration: '12s' }}></div>
        
        {/* Particle Network Effect */}
        <ParticleNetwork isDarkMode={isDark} />
      </div>

      <div className="w-full max-w-[540px] relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center text-[#FFFFFF] font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              CS
            </div>
            <span className="text-3xl font-bold text-[#FFFFFF] tracking-tight">CredScore</span>
          </div>
        </div>

        <div className="bg-[#101B57]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#1E2A68]/50 p-10 relative overflow-hidden group transition-colors duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

          <h2 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Create an Account</h2>
          <p className="text-[#94A3B8] text-sm mb-8">Join the next generation of AI risk assessment.</p>

          {error && (
            <div className="mb-6 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-[#EF4444] shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Full Name */}
            <div className="group/input">
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2 group-focus-within/input:text-[#3B82F6] transition-colors">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#94A3B8] group-focus-within/input:text-[#3B82F6] transition-colors" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="block w-full pl-12 pr-4 py-3.5 bg-[#050B2D] border border-[#1E2A68] rounded-xl text-sm text-[#FFFFFF] focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] outline-none transition-all placeholder:text-[#1E2A68]"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="group/input">
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2 group-focus-within/input:text-[#3B82F6] transition-colors">Email Address</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#94A3B8] group-focus-within/input:text-[#3B82F6] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full pl-12 pr-4 py-3.5 bg-[#050B2D] border border-[#1E2A68] rounded-xl text-sm text-[#FFFFFF] focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] outline-none transition-all placeholder:text-[#1E2A68] disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="jane.doe@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="group/input">
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2 group-focus-within/input:text-[#3B82F6] transition-colors">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#94A3B8] group-focus-within/input:text-[#3B82F6] transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-12 pr-12 py-3.5 bg-[#050B2D] border border-[#1E2A68] rounded-xl text-sm text-[#FFFFFF] focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] outline-none transition-all placeholder:text-[#1E2A68] font-mono tracking-widest"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#94A3B8] hover:text-[#FFFFFF] transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#94A3B8] hover:text-[#FFFFFF] transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2">I am registering as an:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                    role === 'Admin' 
                      ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                      : 'bg-[#050B2D] border-[#1E2A68] text-[#94A3B8] hover:border-[#94A3B8]'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('User')}
                  className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                    role === 'User' 
                      ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                      : 'bg-[#050B2D] border-[#1E2A68] text-[#94A3B8] hover:border-[#94A3B8]'
                  }`}
                >
                  Applicant
                </button>
              </div>
            </div>

            {role === 'Admin' && (
              <div className="animate-fade-in-up">
                <label className="block text-sm font-semibold text-[#EF4444] mb-2">Admin Registration Key</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="block w-full px-4 py-3 bg-[#050B2D] border border-[#EF4444]/50 rounded-xl text-sm text-[#FFFFFF] focus:ring-2 focus:ring-[#EF4444]/50 focus:border-[#EF4444] outline-none transition-all placeholder:text-[#EF4444]/30"
                  placeholder="Enter secret admin key..."
                  required
                />
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-[#3B82F6] bg-[#050B2D] border-[#1E2A68] rounded focus:ring-[#3B82F6] focus:ring-offset-[#101B57] cursor-pointer mt-0.5"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-[#94A3B8] cursor-pointer">
                  I agree to the <a href="#" className="text-[#3B82F6] hover:text-[#FFFFFF] transition-colors">Terms of Service</a> and <a href="#" className="text-[#3B82F6] hover:text-[#FFFFFF] transition-colors">Privacy Policy</a>.
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] text-sm font-bold text-[#FFFFFF] bg-[#3B82F6] hover:bg-[#2563EB] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#101B57] focus:ring-[#3B82F6] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up Securely'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#1E2A68] pt-6">
            <p className="text-sm text-[#94A3B8]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#3B82F6] hover:text-[#FFFFFF] transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
