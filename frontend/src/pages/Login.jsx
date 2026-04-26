import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { addNotification } from '../utils/dataStore';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('credscore_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('credscore_users')) || [];
      
      // Find user
      const user = existingUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        setIsLoading(false);
        setError('Invalid email or password.');
        return;
      }

      if (user.role !== role) {
        setIsLoading(false);
        setError(`This account does not have ${role} privileges.`);
        return;
      }

      // Successful login
      if (rememberMe) {
        localStorage.setItem('credscore_remembered_email', email);
      } else {
        localStorage.removeItem('credscore_remembered_email');
      }

      localStorage.setItem('credscore_current_user', JSON.stringify({ email: user.email, role: user.role, name: user.name, id: user.id }));

      addNotification(user.role, user.id, 'Login Successful', 'Welcome back to CredScore! You have successfully logged in.', 'success');

      setIsLoading(false);
      
      if (role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050B2D] flex items-center justify-center p-4 lg:p-8 font-sans text-[#FFFFFF] relative overflow-hidden">
      
      {/* Enhanced Textured Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E2A68_1px,transparent_1px),linear-gradient(to_bottom,#1E2A68_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#3B82F6]/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#bd34fe]/15 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-[30%] left-[50%] w-[40vw] h-[40vw] rounded-full bg-[#10B981]/10 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }}></div>
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
          
          <h1 className="text-4xl lg:text-6xl font-bold text-[#FFFFFF] mb-6 leading-tight tracking-tight">
            CredScore<br/>
            <span className="text-2xl lg:text-3xl text-[#3B82F6] font-normal mt-2 block">AI Assessment System</span>
          </h1>
          
          <p className="text-[#94A3B8] text-lg mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Intelligent lending decisions powered by advanced analytics and explainable AI risk assessment.
          </p>

          <div className="flex justify-center lg:justify-start gap-10">
            <div className="text-center lg:text-left group cursor-default">
              <div className="text-3xl font-bold text-[#FFFFFF] mb-1 group-hover:text-[#3B82F6] transition-colors">99.9%</div>
              <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Fast Processing</div>
            </div>
            <div className="text-center lg:text-left group cursor-default">
              <div className="text-3xl font-bold text-[#FFFFFF] mb-1 group-hover:text-[#10B981] transition-colors">95%</div>
              <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Accuracy Rate</div>
            </div>
            <div className="text-center lg:text-left group cursor-default">
              <div className="text-3xl font-bold text-[#FFFFFF] mb-1 group-hover:text-[#FACC15] transition-colors">50K+</div>
              <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Loans Assessed</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-[#101B57]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#1E2A68]/50 p-8 lg:p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center text-[#FFFFFF] font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                CS
              </div>
              <span className="text-2xl font-bold text-[#FFFFFF] tracking-tight">CredScore</span>
            </div>

            <h2 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Welcome back</h2>
            <p className="text-[#94A3B8] text-sm mb-6">Enter your credentials to access your portal</p>

            {error && (
              <div className="mb-6 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-[#EF4444] shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="group/input">
                <label className="block text-sm font-semibold text-[#94A3B8] mb-2 group-focus-within/input:text-[#3B82F6] transition-colors">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#94A3B8] group-focus-within/input:text-[#3B82F6] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 bg-[#050B2D] border border-[#1E2A68] rounded-xl text-sm text-[#FFFFFF] focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] outline-none transition-all placeholder:text-[#1E2A68]"
                    placeholder="admin@credscore.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group/input">
                <label className="block text-sm font-semibold text-[#94A3B8] mb-2 group-focus-within/input:text-[#3B82F6] transition-colors">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#94A3B8] group-focus-within/input:text-[#3B82F6] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-3.5 bg-[#050B2D] border border-[#1E2A68] rounded-xl text-sm text-[#FFFFFF] focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] outline-none transition-all placeholder:text-[#1E2A68] font-mono tracking-widest"
                    placeholder="••••••••"
                    required
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
                    className="h-4 w-4 text-[#3B82F6] bg-[#050B2D] border-[#1E2A68] rounded focus:ring-[#3B82F6] focus:ring-offset-[#101B57] cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#94A3B8] cursor-pointer select-none">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-[#3B82F6] hover:text-[#FFFFFF] transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] text-sm font-bold text-[#FFFFFF] bg-[#3B82F6] hover:bg-[#2563EB] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#101B57] focus:ring-[#3B82F6] transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
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

            <div className="mt-8 text-center border-t border-[#1E2A68] pt-6">
              <p className="text-sm text-[#94A3B8]">
                New to CredScore?{' '}
                <Link to="/signup" className="font-bold text-[#3B82F6] hover:text-[#FFFFFF] transition-colors">
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
