import React from 'react';
import UserLayout from '../components/UserLayout';
import { fetchApplications, fetchUserCreditScore } from '../utils/dataStore';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, Info } from 'lucide-react';

const UserRisk = () => {
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const [apps, setApps] = React.useState([]);
  const [currentScore, setCurrentScore] = React.useState('Loading...');

  React.useEffect(() => {
    const loadData = async () => {
      const fetchedApps = await fetchApplications(currentUser.id);
      setApps(fetchedApps);
      
      const score = await fetchUserCreditScore(currentUser.id);
      setCurrentScore(score);
    };
    loadData();
  }, [currentUser.id]);
  let currentRisk = 'Medium';
  if (currentScore === 'N/A') currentRisk = 'N/A';
  else if (currentScore >= 750) currentRisk = 'Low';
  else if (currentScore >= 650) currentRisk = 'Medium';
  else currentRisk = 'High';

  let config = { icon: null, color: '', bg: '', border: '', text: '', description: '' };
  
  if (currentRisk === 'Low') {
    config = {
      icon: <ShieldCheck size={64} className="text-[#10B981]" />,
      color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20',
      text: 'Low Risk',
      description: 'Your financial profile shows very strong stability. You are highly likely to be approved for premium rates.'
    };
  } else if (currentRisk === 'High') {
    config = {
      icon: <ShieldAlert size={64} className="text-[#EF4444]" />,
      color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20',
      text: 'High Risk',
      description: 'Your profile exhibits factors that lenders consider high risk. Approvals may require additional collateral or documentation.'
    };
  } else if (currentRisk === 'Pending') {
    config = {
      icon: <Shield size={64} className="text-[#94A3B8]" />,
      color: 'text-[#94A3B8]', bg: 'bg-[#94A3B8]/10', border: 'border-[#94A3B8]/20',
      text: 'Pending Evaluation',
      description: 'Your risk profile is currently being evaluated by our underwriting algorithms.'
    };
  } else if (currentRisk === 'N/A') {
    config = {
      icon: <Info size={64} className="text-[#94A3B8]" />,
      color: 'text-[#94A3B8]', bg: 'bg-[#94A3B8]/10', border: 'border-[#94A3B8]/20',
      text: 'Not Established',
      description: 'You do not have enough credit history to generate a risk profile. Please apply for a loan to get started.'
    };
  } else {
    config = {
      icon: <AlertTriangle size={64} className="text-[#FACC15]" />,
      color: 'text-[#FACC15]', bg: 'bg-[#FACC15]/10', border: 'border-[#FACC15]/20',
      text: 'Medium Risk',
      description: 'Your profile is generally stable but has some areas of concern. You are eligible for standard lending products.'
    };
  }

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Risk Status</h1>
        <p className="text-[#94A3B8]">Understand how lenders view your financial risk profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`rounded-3xl p-10 border ${config.bg} ${config.border} flex flex-col items-center text-center justify-center`}>
          <div className="mb-6 p-6 rounded-full bg-[#050B2D] border shadow-2xl" style={{ borderColor: config.color.replace('text-[', '').replace(']', '') }}>
            {config.icon}
          </div>
          <h2 className={`text-4xl font-black mb-4 ${config.color}`}>{config.text}</h2>
          <p className="text-[#FFFFFF] text-lg max-w-md leading-relaxed">{config.description}</p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#101B57] p-6 rounded-2xl border border-[#1E2A68]">
            <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">Why this result?</h3>
            {currentScore === 'N/A' ? (
              <div className="p-8 text-center bg-[#050B2D] rounded-xl border border-[#1E2A68]">
                <p className="text-[#94A3B8]">We need more financial data to populate these insights.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 bg-[#050B2D] rounded-xl border border-[#1E2A68]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${currentScore >= 650 ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'}`}>
                    {currentScore >= 650 ? '+' : '-'}
                  </div>
                  <div>
                    <p className="font-bold text-[#FFFFFF] mb-1">{currentScore >= 650 ? 'Consistent Income' : 'Debt-to-Income Concerns'}</p>
                    <p className="text-sm text-[#94A3B8]">{currentScore >= 650 ? 'Your stated monthly income exceeds the minimum threshold for your requested debt burden.' : 'Your requested loan amounts are highly elevated compared to your stated income.'}</p>
                  </div>
                </li>
                <li className="flex gap-4 p-4 bg-[#050B2D] rounded-xl border border-[#1E2A68]">
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444] font-bold shrink-0">-</div>
                  <div>
                    <p className="font-bold text-[#FFFFFF] mb-1">Short Credit History</p>
                    <p className="text-sm text-[#94A3B8]">Your oldest active account is relatively new, which slightly lowers your stability score.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-4 bg-[#050B2D] rounded-xl border border-[#1E2A68]">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] font-bold shrink-0">+</div>
                  <div>
                    <p className="font-bold text-[#FFFFFF] mb-1">Low Utilization</p>
                    <p className="text-sm text-[#94A3B8]">You are using a very small percentage of your available credit limits.</p>
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Loan-Specific Risk Evaluations Table */}
      <div className="mt-8 bg-[#101B57] rounded-2xl border border-[#1E2A68] overflow-hidden">
        <div className="p-6 border-b border-[#1E2A68]">
          <h3 className="text-xl font-bold text-[#FFFFFF]">Loan-Specific Risk Evaluations</h3>
          <p className="text-[#94A3B8] text-sm mt-1">Review the specific risk tier assigned to each of your applications during underwriting.</p>
        </div>
        
        {apps.length === 0 ? (
          <div className="p-8 text-center text-[#94A3B8]">No loan applications found. Apply for a loan to generate a risk profile.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#050B2D] text-[#94A3B8] text-sm">
                  <th className="py-4 px-6 font-medium">Application ID</th>
                  <th className="py-4 px-6 font-medium">Date</th>
                  <th className="py-4 px-6 font-medium">Amount</th>
                  <th className="py-4 px-6 font-medium">Underwriting Risk</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id} className="border-t border-[#1E2A68] hover:bg-[#09133E] transition-colors">
                    <td className="py-4 px-6 text-[#FFFFFF] font-medium">{app.id}</td>
                    <td className="py-4 px-6 text-[#94A3B8]">{app.date}</td>
                    <td className="py-4 px-6 text-[#FFFFFF]">{app.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${app.risk === 'Low' ? 'bg-[#10B981]/10 text-[#10B981]' : app.risk === 'High' ? 'bg-[#EF4444]/10 text-[#EF4444]' : app.risk === 'Pending' ? 'bg-[#94A3B8]/10 text-[#94A3B8]' : 'bg-[#FACC15]/10 text-[#FACC15]'}`}>
                        {app.risk} {app.risk !== 'Pending' ? 'Risk' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${app.status === 'Approved' ? 'text-[#10B981]' : app.status === 'Rejected' ? 'text-[#EF4444]' : 'text-[#3B82F6]'}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserRisk;
