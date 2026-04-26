import React from 'react';
import UserLayout from '../components/UserLayout';
import { Home, Car, CreditCard, ArrowRight, Briefcase, Activity, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const recommendations = [
  {
    id: 1, title: 'Premium Home Mortgage', icon: <Home size={32} className="text-[#3B82F6]" />,
    rate: '6.5% p.a.', amount: 'Up to $500,000', match: '98% Match', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/30', purpose: 'Home'
  },
  {
    id: 2, title: 'Auto Loan Express', icon: <Car size={32} className="text-[#10B981]" />,
    rate: '8.5% p.a.', amount: 'Up to $80,000', match: '95% Match', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', purpose: 'Auto'
  },
  {
    id: 3, title: 'Small Business Startup', icon: <Briefcase size={32} className="text-[#FACC15]" />,
    rate: '10.5% p.a.', amount: 'Up to $250,000', match: '85% Match', bg: 'bg-[#FACC15]/10', border: 'border-[#FACC15]/30', purpose: 'Business'
  },
  {
    id: 4, title: 'Personal Debt Consolidation', icon: <CreditCard size={32} className="text-[#8B5CF6]" />,
    rate: '12.5% p.a.', amount: 'Up to $50,000', match: '80% Match', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', purpose: 'Personal'
  },
  {
    id: 5, title: 'First-Time Homebuyer', icon: <Home size={32} className="text-[#3B82F6]" />,
    rate: '6.0% p.a.', amount: 'Up to $350,000', match: '90% Match', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/30', purpose: 'Home'
  },
  {
    id: 6, title: 'Used Car Financing', icon: <Car size={32} className="text-[#10B981]" />,
    rate: '9.5% p.a.', amount: 'Up to $40,000', match: '92% Match', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', purpose: 'Auto'
  },
  {
    id: 7, title: 'Business Expansion Loan', icon: <Briefcase size={32} className="text-[#FACC15]" />,
    rate: '11.0% p.a.', amount: 'Up to $1,000,000', match: '75% Match', bg: 'bg-[#FACC15]/10', border: 'border-[#FACC15]/30', purpose: 'Business'
  },
  {
    id: 8, title: 'Medical Emergency Loan', icon: <Activity size={32} className="text-[#EF4444]" />,
    rate: '12.0% p.a.', amount: 'Up to $20,000', match: '88% Match', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', purpose: 'Personal'
  },
  {
    id: 9, title: 'Vacation & Travel Loan', icon: <Plane size={32} className="text-[#06B6D4]" />,
    rate: '13.5% p.a.', amount: 'Up to $15,000', match: '70% Match', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/30', purpose: 'Personal'
  },
  {
    id: 10, title: 'Home Renovation Credit', icon: <Home size={32} className="text-[#3B82F6]" />,
    rate: '7.0% p.a.', amount: 'Up to $100,000', match: '94% Match', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/30', purpose: 'Home'
  }
];

const UserRecommendations = () => {
  const navigate = useNavigate();

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Personalized Recommendations</h1>
        <p className="text-[#94A3B8]">Financial products tailored to your excellent credit profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] hover:-translate-y-2 transition-transform duration-300 group flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${rec.bg} border ${rec.border}`}>
                {rec.icon}
              </div>
              <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2.5 py-1 rounded-full text-xs font-bold">
                {rec.match}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-[#FFFFFF] mb-2">{rec.title}</h3>
            
            <div className="space-y-2 mb-8 flex-1">
              <p className="text-[#94A3B8] text-sm flex justify-between">
                <span>Interest Rate:</span>
                <span className="text-[#FFFFFF] font-medium">{rec.rate}</span>
              </p>
              <p className="text-[#94A3B8] text-sm flex justify-between">
                <span>Max Amount:</span>
                <span className="text-[#FFFFFF] font-medium">{rec.amount}</span>
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/user/application', { state: { prefilledPurpose: rec.purpose } })}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#050B2D] text-[#3B82F6] font-bold rounded-xl border border-[#3B82F6]/30 group-hover:bg-[#3B82F6] group-hover:text-[#FFFFFF] transition-colors mt-auto"
            >
              Apply Now <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </UserLayout>
  );
};

export default UserRecommendations;
