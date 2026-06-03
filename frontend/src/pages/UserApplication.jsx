import React, { useState } from 'react';
import UserLayout from '../components/UserLayout';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { submitApplication, createNotification } from '../utils/dataStore';
import { useNavigate, useLocation } from 'react-router-dom';

const UserApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: location.state?.prefilledPurpose || 'Personal',
    income: '',
    employment: 'Full-time',
    tenure: '12'
  });

  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');

  const getInterestRate = (purpose) => {
    switch(purpose) {
      case 'Home': return 6.5;
      case 'Auto': return 8.5;
      case 'Business': return 10.5;
      case 'Personal': default: return 12.5;
    }
  };

  const currentInterestRate = getInterestRate(formData.purpose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newApp = {
        id: `APP-9${Math.floor(1000 + Math.random() * 9000)}`,
        userId: currentUser.id || 'USR-UNKNOWN',
        name: currentUser.name || 'Applicant User',
        amount: `$${parseInt(formData.amount.replace(/\D/g, '') || '0').toLocaleString()}`,
        score: 0, // In production, backend calculates this
        risk: 'Medium', // Valid enum value for Mongoose schema
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        purpose: formData.purpose,
        tenure: formData.tenure,
        interestRate: currentInterestRate,
        income: parseInt(formData.income) || 0,
        employment: formData.employment
      };

      await submitApplication(newApp);
      
      await createNotification('Admin', 'ALL', 'New Application Submitted', `${newApp.name} submitted application ${newApp.id} for ${newApp.amount}.`, 'info');
      await createNotification(currentUser.role, currentUser.id, 'Application Successful', `Your application ${newApp.id} has been securely submitted.`, 'success');
      
      setIsSubmitting(false);
      navigate('/user-dashboard');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Failed to submit application. Is the backend running?');
    }
  };

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Loan Application</h1>
        <p className="text-[#94A3B8]">Apply for a new loan in minutes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#101B57] rounded-2xl p-8 border border-[#1E2A68] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Full Name</label>
                <input 
                  type="text"
                  disabled
                  value={currentUser.name || ''}
                  className="w-full bg-[#050B2D]/50 border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email</label>
                <input 
                  type="email"
                  disabled
                  value={currentUser.email || ''}
                  className="w-full bg-[#050B2D]/50 border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] opacity-70 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Monthly Income ($)</label>
                <input 
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={formData.income}
                  onChange={e => setFormData({...formData, income: e.target.value})}
                  className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Employment Type</label>
                <select 
                  value={formData.employment}
                  onChange={e => setFormData({...formData, employment: e.target.value})}
                  className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors appearance-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Loan Amount ($)</label>
                <input 
                  type="number"
                  required
                  min="1000"
                  placeholder="e.g. 25000"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Loan Purpose</label>
                <select 
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value})}
                  className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors appearance-none"
                >
                  <option value="Personal">Personal Loan</option>
                  <option value="Auto">Auto Loan</option>
                  <option value="Home">Home Mortgage</option>
                  <option value="Business">Small Business</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Tenure (Months)</label>
                <select 
                  value={formData.tenure}
                  onChange={e => setFormData({...formData, tenure: e.target.value})}
                  className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors appearance-none"
                >
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                  <option value="120">120 Months (10 Years)</option>
                </select>
              </div>
            </div>

            <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl p-4 flex gap-3 mt-6">
              <CheckCircle2 className="text-[#3B82F6] shrink-0" size={20} />
              <p className="text-sm text-[#93C5FD]">By submitting, you authorize CredScore to perform a soft credit pull to estimate your eligibility. This will not affect your credit score.</p>
            </div>

            <div className="pt-4 border-t border-[#1E2A68] flex justify-end">
              <button 
                type="submit"
                disabled={isSubmitting || !formData.amount}
                className="px-8 py-3 bg-[#3B82F6] text-[#FFFFFF] rounded-xl font-bold hover:bg-[#2563EB] transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin" size={18} /> Processing...</>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>

        <div>
          {/* Eligibility Preview Card */}
          <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] sticky top-24">
            <h3 className="text-lg font-bold text-[#FFFFFF] mb-4 border-b border-[#1E2A68] pb-3">Eligibility Preview</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8] text-sm">Requested Amount</span>
                <span className="text-[#FFFFFF] font-bold text-lg">${parseInt(formData.amount || '0').toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8] text-sm">Est. Interest Rate</span>
                <span className="text-[#10B981] font-bold">~ {currentInterestRate}% p.a.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8] text-sm">Est. Monthly EMI</span>
                <span className="text-[#FFFFFF] font-bold">
                  ${Math.round(
                    (parseInt(formData.amount || '0') * (currentInterestRate/1200) * Math.pow(1 + currentInterestRate/1200, parseInt(formData.tenure))) / 
                    (Math.pow(1 + currentInterestRate/1200, parseInt(formData.tenure)) - 1)
                  ).toLocaleString() || 0}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#050B2D] rounded-xl border border-[#1E2A68]">
              <p className="text-xs text-[#94A3B8] text-center">Fill out the form completely to secure your accurate interest rate. Approval is subject to underwriting.</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserApplication;
