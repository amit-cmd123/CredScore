import React, { useState } from 'react';
import UserLayout from '../components/UserLayout';
import { Calculator } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const UserEmi = () => {
  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(60);

  const calculateEmi = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) / 1200; // Monthly interest rate
    const n = parseFloat(tenure) || 0;

    if (p <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalAmount: 0 };
    
    if (r === 0) {
      return {
        emi: Math.round(p / n),
        totalInterest: 0,
        totalAmount: Math.round(p)
      };
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - p;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount)
    };
  };

  const results = calculateEmi();
  const chartData = [
    { name: 'Principal Amount', value: Math.max(1, parseFloat(principal) || 0), color: '#3B82F6' },
    { name: 'Total Interest', value: Math.max(0, results.totalInterest || 0), color: '#10B981' }
  ];

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">EMI Calculator</h1>
        <p className="text-[#94A3B8]">Plan your finances by calculating your monthly loan repayments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#101B57] rounded-2xl p-8 border border-[#1E2A68]">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#1E2A68]">
            <Calculator className="text-[#3B82F6]" />
            <h2 className="text-xl font-bold text-[#FFFFFF]">Loan Details</h2>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#94A3B8]">Principal Amount ($)</label>
                <span className="text-[#FFFFFF] font-bold">${principal.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="500000" 
                step="1000"
                value={principal} 
                onChange={e => setPrincipal(e.target.value)}
                className="w-full h-2 bg-[#050B2D] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#94A3B8]">Interest Rate (% p.a.)</label>
                <span className="text-[#FFFFFF] font-bold">{rate}%</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="25" 
                step="0.1"
                value={rate} 
                onChange={e => setRate(e.target.value)}
                className="w-full h-2 bg-[#050B2D] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#94A3B8]">Loan Tenure (Months)</label>
                <span className="text-[#FFFFFF] font-bold">{tenure} months</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="360" 
                step="6"
                value={tenure} 
                onChange={e => setTenure(e.target.value)}
                className="w-full h-2 bg-[#050B2D] rounded-lg appearance-none cursor-pointer accent-[#FACC15]"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#101B57] rounded-2xl p-8 border border-[#1E2A68] flex flex-col justify-center">
          <div className="text-center mb-8">
            <p className="text-[#94A3B8] mb-2 font-medium">Monthly EMI</p>
            <p className="text-5xl font-black text-[#3B82F6]">${results.emi.toLocaleString()}</p>
          </div>

          <div className="h-64 min-h-[256px] w-full mb-8 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#09133E', border: '1px solid #1E2A68', borderRadius: '8px', color: '#FFFFFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#050B2D] p-4 rounded-xl border border-[#1E2A68] text-center">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6] mx-auto mb-2"></div>
              <p className="text-xs text-[#94A3B8] mb-1">Principal Amount</p>
              <p className="text-[#FFFFFF] font-bold">${parseFloat(principal).toLocaleString()}</p>
            </div>
            <div className="bg-[#050B2D] p-4 rounded-xl border border-[#1E2A68] text-center">
              <div className="w-3 h-3 rounded-full bg-[#10B981] mx-auto mb-2"></div>
              <p className="text-xs text-[#94A3B8] mb-1">Total Interest</p>
              <p className="text-[#FFFFFF] font-bold">${results.totalInterest.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserEmi;
