import React from 'react';
import UserLayout from '../components/UserLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Lightbulb, PieChart as PieChartIcon } from 'lucide-react';

import { getApplications, calculateUserCreditScore } from '../utils/dataStore';

const UserAnalytics = () => {
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const userApps = getApplications().filter(a => a.userId === currentUser.id);
  
  const currentScore = calculateUserCreditScore(currentUser.id);
  const numericScore = currentScore === 'N/A' ? 650 : parseInt(currentScore, 10);
  
  // Dynamically calculate total active debt from user apps
  const totalActiveDebt = userApps
    .filter(a => a.status === 'Active' || a.status === 'Approved')
    .reduce((sum, app) => sum + parseInt(String(app.amount).replace(/\D/g, '') || '0', 10), 0);

  // Generate dynamic chart data based on debt
  const baseDebt = totalActiveDebt > 0 ? totalActiveDebt : 15000;
  const analyticsData = [
    { month: 'Jan', balances: baseDebt + 5000, payments: 1500 },
    { month: 'Feb', balances: baseDebt + 4000, payments: 1500 },
    { month: 'Mar', balances: baseDebt + 3500, payments: 1800 },
    { month: 'Apr', balances: baseDebt + 2000, payments: 2000 },
    { month: 'May', balances: baseDebt + 1500, payments: 1200 },
    { month: 'Jun', balances: baseDebt, payments: 2500 },
  ];

  const targetScore = 800;
  const pointsAway = targetScore - numericScore;
  const progressPercent = Math.max(0, Math.min(100, ((numericScore - 300) / (targetScore - 300)) * 100));

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Analytics</h1>
        <p className="text-[#94A3B8]">Deep dive into your financial habits and credit trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-[#3B82F6]" />
            <h2 className="text-xl font-bold text-[#FFFFFF]">Debt Repayment Trend</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E2A68" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09133E', border: '1px solid #1E2A68', borderRadius: '8px', color: '#FFFFFF' }}
                  cursor={{fill: '#050B2D'}}
                />
                <Bar dataKey="balances" name="Total Debt" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="payments" name="Payments Made" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-[#FACC15]" />
              <h2 className="text-lg font-bold text-[#FFFFFF]">Financial Insights</h2>
            </div>
            <ul className="space-y-4">
              <li className="p-3 bg-[#050B2D] border border-[#1E2A68] rounded-xl">
                <p className="text-sm font-bold text-[#FFFFFF] mb-1">Accelerated Payoff</p>
                <p className="text-xs text-[#94A3B8]">You are paying 20% more than minimums. You'll be debt-free 14 months early.</p>
              </li>
              <li className="p-3 bg-[#050B2D] border border-[#1E2A68] rounded-xl">
                <p className="text-sm font-bold text-[#FFFFFF] mb-1">Credit Limit Increase</p>
                <p className="text-xs text-[#94A3B8]">Your score allows for a limit increase. Requesting one will lower utilization.</p>
              </li>
            </ul>
          </div>

          <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#94A3B8] text-sm">Target Score: {targetScore}</span>
              <span className="text-[#10B981] font-bold">{numericScore}</span>
            </div>
            <div className="w-full bg-[#050B2D] rounded-full h-3 mb-2">
              <div className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] h-3 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-xs text-[#94A3B8] text-center mt-3">You are {pointsAway > 0 ? `${pointsAway} points away from your goal!` : 'at your target score!'}</p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserAnalytics;
