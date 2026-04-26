import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Shield, CheckCircle2, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPreviewUrl('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setPreviewUrl(data.previewUrl);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B2D] flex items-center justify-center p-4 lg:p-8 font-sans text-[#FFFFFF]">
      {/* Radial glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3B82F6]/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="w-full max-w-[480px]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center text-[#FFFFFF] font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              CS
            </div>
            <span className="text-3xl font-bold text-[#FFFFFF] tracking-tight">CredScore</span>
          </div>
        </div>

        <div className="bg-[#101B57] rounded-3xl shadow-2xl border border-[#1E2A68] p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50"></div>

          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">Reset Password</h2>
              <p className="text-[#94A3B8] text-sm mb-8">Enter your registered email address and we'll send you instructions to reset your password.</p>

              {error && (
                <div className="mb-6 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4 text-sm text-[#EF4444]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] text-sm font-bold text-[#FFFFFF] bg-[#3B82F6] hover:bg-[#2563EB] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#101B57] focus:ring-[#3B82F6] transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
              </div>
              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Check your email</h2>
              <p className="text-[#94A3B8] text-sm mb-4">
                We've sent password reset instructions to <br/><span className="text-[#FFFFFF] font-medium">{email}</span>
              </p>
              
              {previewUrl && (
                <div className="mb-8 p-4 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl">
                  <p className="text-sm text-[#94A3B8] mb-2">Test Email Generated!</p>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#3B82F6] hover:text-[#FFFFFF] transition-colors">
                    Click here to view the email
                  </a>
                </div>
              )}

              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-medium text-[#3B82F6] hover:text-[#FFFFFF] transition-colors"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}

          <div className="mt-8 text-center border-t border-[#1E2A68] pt-6">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 font-bold text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
