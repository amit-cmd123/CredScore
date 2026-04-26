import React, { useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ShieldCheck, AlertCircle } from 'lucide-react';
import { getApplications } from '../utils/dataStore';

const AdminRisk = () => {
  const apps = getApplications() || [];
  
  const riskStats = useMemo(() => {
    if (apps.length === 0) return { low: 0, medium: 0, high: 0 };
    const low = apps.filter(a => a.risk === 'Low').length;
    const medium = apps.filter(a => a.risk === 'Medium').length;
    const high = apps.filter(a => a.risk === 'High').length;
    return {
      low: Math.round((low / apps.length) * 100),
      medium: Math.round((medium / apps.length) * 100),
      high: Math.round((high / apps.length) * 100)
    };
  }, [apps]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Risk Analysis</h1>
        <p className="text-[#94A3B8]">AI-driven explainable risk factors for portfolio management.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981]">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#FFFFFF]">Low Risk</h3>
          </div>
          <p className="text-3xl font-bold text-[#FFFFFF] mb-1">{riskStats.low}%</p>
          <p className="text-xs text-[#94A3B8]">Of total portfolio</p>
          <div className="w-full bg-[#09133E] rounded-full h-1.5 mt-4">
            <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: `${riskStats.low}%` }}></div>
          </div>
        </div>

        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#FACC15]/10 rounded-full flex items-center justify-center text-[#FACC15]">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#FFFFFF]">Medium Risk</h3>
          </div>
          <p className="text-3xl font-bold text-[#FFFFFF] mb-1">{riskStats.medium}%</p>
          <p className="text-xs text-[#94A3B8]">Of total portfolio</p>
          <div className="w-full bg-[#09133E] rounded-full h-1.5 mt-4">
            <div className="bg-[#FACC15] h-1.5 rounded-full" style={{ width: `${riskStats.medium}%` }}></div>
          </div>
        </div>

        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#EF4444]/10 rounded-full flex items-center justify-center text-[#EF4444]">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#FFFFFF]">High Risk</h3>
          </div>
          <p className="text-3xl font-bold text-[#FFFFFF] mb-1">{riskStats.high}%</p>
          <p className="text-xs text-[#94A3B8]">Of total portfolio</p>
          <div className="w-full bg-[#09133E] rounded-full h-1.5 mt-4">
            <div className="bg-[#EF4444] h-1.5 rounded-full" style={{ width: `${riskStats.high}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-6">
        <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Explainable Score Factors</h2>
        
        <div className="space-y-6">
          {[
            { name: 'Income Stability', impact: 'High Positive', value: '+45 pts', icon: <TrendingUp className="text-[#10B981]" size={18} /> },
            { name: 'Debt-to-Income Ratio', impact: 'Moderate Negative', value: '-15 pts', icon: <TrendingDown className="text-[#EF4444]" size={18} /> },
            { name: 'Employment History', impact: 'Positive', value: '+20 pts', icon: <TrendingUp className="text-[#10B981]" size={18} /> },
            { name: 'Repayment History', impact: 'Neutral', value: '0 pts', icon: <Minus className="text-[#94A3B8]" size={18} /> },
            { name: 'Existing Loans', impact: 'High Negative', value: '-30 pts', icon: <TrendingDown className="text-[#EF4444]" size={18} /> },
          ].map((factor, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#09133E] rounded-xl border border-[#1E2A68]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#101B57] rounded-lg border border-[#1E2A68] flex items-center justify-center">
                  {factor.icon}
                </div>
                <div>
                  <h4 className="text-[#FFFFFF] font-bold">{factor.name}</h4>
                  <p className="text-xs text-[#94A3B8]">Impact: {factor.impact}</p>
                </div>
              </div>
              <div className={`font-bold text-lg ${
                factor.value.startsWith('+') ? 'text-[#10B981]' : factor.value.startsWith('-') ? 'text-[#EF4444]' : 'text-[#94A3B8]'
              }`}>
                {factor.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRisk;
