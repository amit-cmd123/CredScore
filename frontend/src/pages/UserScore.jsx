import React from 'react';
import UserLayout from '../components/UserLayout';
import { getApplications, calculateUserCreditScore } from '../utils/dataStore';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const UserScore = () => {
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const apps = getApplications().filter(a => a.userId === currentUser.id);
  const currentScore = calculateUserCreditScore(currentUser.id);

  const scorePercentage = currentScore !== 'N/A' ? (currentScore / 900) * 100 : 0;
  
  let category = '';
  let color = '';
  if (currentScore === 'N/A') { category = 'Not Established'; color = '#94A3B8'; }
  else if (currentScore >= 800) { category = 'Excellent'; color = '#10B981'; }
  else if (currentScore >= 700) { category = 'Good'; color = '#3B82F6'; }
  else if (currentScore >= 600) { category = 'Fair'; color = '#FACC15'; }
  else { category = 'Poor'; color = '#EF4444'; }

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Credit Score</h1>
        <p className="text-[#94A3B8]">Your comprehensive credit score breakdown.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Meter Card */}
        <div className="bg-[#101B57] rounded-2xl p-8 border border-[#1E2A68] flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-medium text-[#94A3B8] mb-8">FICO® Score 8</h2>
          
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1E2A68" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke={color} 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={`${(scorePercentage / 100) * 283} 283`} 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-[#FFFFFF] drop-shadow-lg" style={{ color: color }}>{currentScore}</span>
              <span className="text-sm font-medium text-[#94A3B8] mt-1">out of 900</span>
            </div>
          </div>
          
          <div className="w-full max-w-sm">
            <div className="flex justify-between items-center px-4 py-3 bg-[#050B2D] rounded-xl border border-[#1E2A68]">
              <span className="text-[#94A3B8] font-medium">Rating</span>
              <span className="font-bold text-lg" style={{ color: color }}>{category}</span>
            </div>
          </div>
        </div>

        {/* Factors Card */}
        <div className="bg-[#101B57] rounded-2xl p-8 border border-[#1E2A68]">
          <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Score Factors</h2>
          
          {currentScore === 'N/A' ? (
            <div className="h-full flex flex-col items-center justify-center text-center pb-12">
              <Info size={48} className="text-[#94A3B8] mb-4 opacity-50" />
              <p className="text-[#FFFFFF] font-medium mb-2">No Data Available</p>
              <p className="text-[#94A3B8] text-sm max-w-xs">We need an active loan application to generate your score factors.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#1E2A68]">
                <div className="flex justify-between mb-2">
                  <span className="text-[#FFFFFF] font-medium flex items-center gap-2">
                    Payment History
                    <div className="relative group flex items-center">
                      <Info size={14} className="text-[#94A3B8] cursor-pointer hover:text-[#3B82F6] transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#050B2D] text-xs font-normal text-[#94A3B8] rounded-lg shadow-2xl border border-[#1E2A68] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 z-10 pointer-events-none">
                        <strong className="text-white block mb-1">High Impact (35%)</strong>
                        Reflects your track record of paying bills on time. A single late payment can severely impact your score.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E2A68]"></div>
                      </div>
                    </div>
                  </span>
                  <span className="text-[#10B981] font-bold">Excellent</span>
                </div>
                <div className="w-full bg-[#050B2D] rounded-full h-2.5">
                  <div className="bg-[#10B981] h-2.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <p className="text-xs text-[#94A3B8] mt-2">100% on-time payments. High impact.</p>
              </div>

              <div className="pb-4 border-b border-[#1E2A68]">
                <div className="flex justify-between mb-2">
                  <span className="text-[#FFFFFF] font-medium flex items-center gap-2">
                    Credit Utilization
                    <div className="relative group flex items-center">
                      <Info size={14} className="text-[#94A3B8] cursor-pointer hover:text-[#3B82F6] transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#050B2D] text-xs font-normal text-[#94A3B8] rounded-lg shadow-2xl border border-[#1E2A68] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 z-10 pointer-events-none">
                        <strong className="text-white block mb-1">High Impact (30%)</strong>
                        The percentage of your available credit limits you are actively using. Keep this under 30% for the best score.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E2A68]"></div>
                      </div>
                    </div>
                  </span>
                  <span className="text-[#3B82F6] font-bold">Good</span>
                </div>
                <div className="w-full bg-[#050B2D] rounded-full h-2.5">
                  <div className="bg-[#3B82F6] h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-xs text-[#94A3B8] mt-2">Currently using 15% of your total limit. High impact.</p>
              </div>

              <div className="pb-4 border-b border-[#1E2A68]">
                <div className="flex justify-between mb-2">
                  <span className="text-[#FFFFFF] font-medium flex items-center gap-2">
                    Credit Age
                    <div className="relative group flex items-center">
                      <Info size={14} className="text-[#94A3B8] cursor-pointer hover:text-[#3B82F6] transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#050B2D] text-xs font-normal text-[#94A3B8] rounded-lg shadow-2xl border border-[#1E2A68] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 z-10 pointer-events-none">
                        <strong className="text-white block mb-1">Medium Impact (15%)</strong>
                        The average age of your open accounts. A longer credit history proves long-term stability to lenders.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E2A68]"></div>
                      </div>
                    </div>
                  </span>
                  <span className="text-[#FACC15] font-bold">Fair</span>
                </div>
                <div className="w-full bg-[#050B2D] rounded-full h-2.5">
                  <div className="bg-[#FACC15] h-2.5 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <p className="text-xs text-[#94A3B8] mt-2">Average age is 4 yrs, 2 mos. Medium impact.</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#FFFFFF] font-medium flex items-center gap-2">
                    Hard Inquiries
                    <div className="relative group flex items-center">
                      <Info size={14} className="text-[#94A3B8] cursor-pointer hover:text-[#3B82F6] transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#050B2D] text-xs font-normal text-[#94A3B8] rounded-lg shadow-2xl border border-[#1E2A68] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 z-10 pointer-events-none">
                        <strong className="text-white block mb-1">Low Impact (10%)</strong>
                        Record of lenders checking your credit for a new application. Too many recent inquiries can negatively impact your score.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E2A68]"></div>
                      </div>
                    </div>
                  </span>
                  <span className="text-[#10B981] font-bold">Excellent</span>
                </div>
                <div className="w-full bg-[#050B2D] rounded-full h-2.5">
                  <div className="bg-[#10B981] h-2.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <p className="text-xs text-[#94A3B8] mt-2">1 inquiry in the last 2 years. Low impact.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserScore;
