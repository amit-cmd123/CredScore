import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle, Loader2, Sun, Moon } from 'lucide-react';
import { addNotification } from '../utils/dataStore';
import ParticleNetwork from '../components/ParticleNetwork';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get initial theme from localStorage or default to dark
  const [theme, setTheme] = useState(localStorage.getItem('credscore_theme') || 'dark');
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // 2FA login states
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [twoFACode, setTwoFACode] = useState('');

  useEffect(() => {
    // Ensure the document has the correct theme class on load
    if (theme === 'system') {
      const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.className = systemDark ? 'dark-theme' : 'light-theme';
    } else {
      document.documentElement.className = theme + '-theme';
    }

    const savedEmail = localStorage.getItem('credscore_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('credscore_theme', newTheme);
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // In our simulation environment, we accept any 6-digit numeric input to make 2FA verification easy to test
      if (twoFACode.length === 6) {
        const user = pendingUser;
        if (rememberMe) {
          localStorage.setItem('credscore_remembered_email', email);
        } else {
          localStorage.removeItem('credscore_remembered_email');
        }

        localStorage.setItem('credscore_current_user', JSON.stringify({ 
          email: user.email, 
          role: user.role, 
          name: user.name, 
          id: user.id, 
          avatar: user.avatar,
          twoFactorEnabled: user.twoFactorEnabled 
        }));

        addNotification(user.role, user.id, 'Login Successful', 'Welcome back to CredScore! You have successfully logged in with 2FA.', 'success');

        // Trigger login alert email to user
        fetch('http://127.0.0.1:5000/api/auth/login-alert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email, name: user.name }),
        }).catch(err => console.error('Failed to send login alert email:', err));

        setIsLoading(false);
        setRequires2FA(false);
        setPendingUser(null);
        setTwoFACode('');
        
        if (user.role === 'Admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setIsLoading(false);
        setError('Invalid 2FA code format. Must be 6 digits.');
      }
    }, 800);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setIsLoading(false);
        setError(data.error || 'Invalid email or password.');
        return;
      }
      
      const user = data;

      if (user.role !== role) {
        setIsLoading(false);
        setError(`This account does not have ${role} privileges.`);
        return;
      }

      // Check if 2FA is active on this account
      if (user.twoFactorEnabled) {
        setIsLoading(false);
        setRequires2FA(true);
        setPendingUser(user);
        return;
      }

      // Successful login
      if (rememberMe) {
        localStorage.setItem('credscore_remembered_email', email);
      } else {
        localStorage.removeItem('credscore_remembered_email');
      }

      localStorage.setItem('credscore_current_user', JSON.stringify({ 
        email: user.email, 
        role: user.role, 
        name: user.name, 
        id: user.id, 
        avatar: user.avatar,
        twoFactorEnabled: user.twoFactorEnabled
      }));

      addNotification(user.role, user.id, 'Login Successful', 'Welcome back to CredScore! You have successfully logged in.', 'success');

      // Trigger login alert email to user
      fetch('http://localhost:5000/api/auth/login-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, name: user.name }),
      }).catch(err => console.error('Failed to send login alert email:', err));

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
      
      {/* Dark Mode Toggle - FIXED position so it's always clickable and visible */}
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

      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
        
        {/* Left Side - Information */}
        <div className="flex-1 text-center lg:text-left relative animate-fade-in-up">
          
          <div className="flex justify-center lg:justify-start mb-8">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-[#3B82F6]/20 rounded-full blur-xl group-hover:bg-[#3B82F6]/40 transition-all duration-500"></div>
              <Shield className="w-24 h-24 text-[#3B82F6] stroke-[1.5] relative z-10 transform group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-[#FFFFFF]">
            CredScore<br/>
            <span className="text-2xl lg:text-3xl text-[#3B82F6] font-normal mt-2 block">AI Assessment System</span>
          </h1>
          
          <p className="text-[#94A3B8] text-lg mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Intelligent lending decisions powered by advanced analytics and explainable AI risk assessment.
          </p>

          <div className="flex justify-center lg:justify-start gap-10">
            <div className="text-center lg:text-left group cursor-default">
              <div className="text-3xl font-bold mb-1 group-hover:text-[#3B82F6] transition-colors text-[#FFFFFF]">99.9%</div>
              <div className="text-xs uppercase tracking-wider font-semibold text-[#94A3B8]">Fast Processing</div>
            </div>
            <div className="text-center lg:text-left group cursor-default">
              <div className="text-3xl font-bold mb-1 group-hover:text-[#10B981] transition-colors text-[#FFFFFF]">95%</div>
              <div className="text-xs uppercase tracking-wider font-semibold text-[#94A3B8]">Accuracy Rate</div>
            </div>
            <div className="text-center lg:text-left group cursor-default">
              <div className="text-3xl font-bold mb-1 group-hover:text-[#FACC15] transition-colors text-[#FFFFFF]">50K+</div>
              <div className="text-xs uppercase tracking-wider font-semibold text-[#94A3B8]">Loans Assessed</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-[#101B57]/80 border-[#1E2A68]/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-3xl border p-8 lg:p-10 relative overflow-hidden group transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center text-[#FFFFFF] font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                CS
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#FFFFFF]">CredScore</span>
            </div>

            <h2 className="text-3xl font-bold mb-2 tracking-tight text-[#FFFFFF]">
              {requires2FA ? 'Two-Factor Verification' : 'Welcome back'}
            </h2>
            <p className="text-[#94A3B8] text-sm mb-6">
              {requires2FA ? 'Enter the 6-digit code from your authenticator' : 'Enter your credentials to access your portal'}
            </p>

            {error && (
              <div className="mb-6 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4 flex items-start gap-3 animate-fade-in-up">
                <AlertCircle className="text-[#EF4444] shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}

            {requires2FA ? (
              <form onSubmit={handleVerify2FA} className="space-y-6">
                <div className="group/input">
                  <label className="block text-sm font-semibold mb-2 text-center text-[#94A3B8]">Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                    className="block w-full px-4 py-3.5 rounded-xl text-center text-2xl tracking-[0.25em] focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] outline-none transition-all font-mono bg-[#050B2D] border-[#1E2A68] text-[#FFFFFF] placeholder:text-[#1E2A68]"
                    placeholder="000000"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || twoFACode.length !== 6}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] text-sm font-bold text-[#FFFFFF] bg-[#3B82F6] hover:bg-[#2563EB] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[#3B82F6] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify and Sign In'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setPendingUser(null);
                    setTwoFACode('');
                    setError('');
                  }}
                  className="w-full text-center text-sm font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors mt-4"
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div className="group/input">
                  <label className="block text-sm font-semibold mb-2 group-focus-within/input:text-[#3B82F6] transition-colors text-[#94A3B8]">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 group-focus-within/input:text-[#3B82F6] transition-colors text-[#94A3B8]" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] outline-none transition-all bg-[#050B2D] border-[#1E2A68] text-[#FFFFFF] placeholder:text-[#1E2A68]"
                      placeholder="admin@credscore.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="group/input">
                  <label className="block text-sm font-semibold mb-2 group-focus-within/input:text-[#3B82F6] transition-colors text-[#94A3B8]">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 group-focus-within/input:text-[#3B82F6] transition-colors text-[#94A3B8]" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-12 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] outline-none transition-all font-mono tracking-widest bg-[#050B2D] border-[#1E2A68] text-[#FFFFFF] placeholder:text-[#1E2A68]"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 hover:text-[#3B82F6] transition-colors text-[#94A3B8]" />
                      ) : (
                        <Eye className="h-5 w-5 hover:text-[#3B82F6] transition-colors text-[#94A3B8]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
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

                {/* Options */}
                <div className="flex items-center justify-between pt-2 pb-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-[#3B82F6] rounded focus:ring-[#3B82F6] cursor-pointer bg-[#050B2D] border-[#1E2A68]"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm cursor-pointer select-none text-[#94A3B8]">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] text-sm font-bold text-[#FFFFFF] bg-[#3B82F6] hover:bg-[#2563EB] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[#3B82F6] transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Sign In Securely'
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 text-center border-t pt-6 border-[#1E2A68]">
              <p className="text-sm text-[#94A3B8]">
                New to CredScore?{' '}
                <Link to="/signup" className="font-bold text-[#3B82F6] transition-colors hover:text-[#FFFFFF]">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
