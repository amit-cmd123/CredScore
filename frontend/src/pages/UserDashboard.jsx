import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldCheck, FileText, BellRing, ArrowUpRight } from 'lucide-react';
import { fetchApplications, fetchNotifications, fetchUserCreditScore } from '../utils/dataStore';
import { useNavigate } from 'react-router-dom';


const UserDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  
  const [apps, setApps] = useState([]);
  const [myNotifs, setMyNotifs] = useState([]);
  const [currentScore, setCurrentScore] = useState('Loading...');

  useEffect(() => {
    const loadData = async () => {
      const fetchedApps = await fetchApplications(currentUser.id);
      setApps(fetchedApps);
      
      const score = await fetchUserCreditScore(currentUser.id);
      setCurrentScore(score);
      
      const notifs = await fetchNotifications(currentUser.role, currentUser.id);
      setMyNotifs(notifs);
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [currentUser.id, currentUser.role]);

  const pendingApps = apps.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

  const getRatingInfo = (score) => {
    if (score === 'N/A') return { category: 'Not Established', color: 'text-[#94A3B8]' };
    const s = parseInt(score);
    if (s >= 750) return { category: 'Excellent', color: 'text-[#10B981]' };
    if (s >= 700) return { category: 'Good', color: 'text-[#3B82F6]' };
    if (s >= 650) return { category: 'Fair', color: 'text-[#FACC15]' };
    return { category: 'Poor', color: 'text-[#EF4444]' };
  };

  const ratingInfo = getRatingInfo(currentScore);

  const getDynamicScoreData = (score) => {
    if (score === 'N/A') return [];
    const s = parseInt(score);
    return [
      { name: 'Jan', score: Math.max(300, s - 45) },
      { name: 'Feb', score: Math.max(300, s - 30) },
      { name: 'Mar', score: Math.max(300, s - 15) },
      { name: 'Apr', score: Math.max(300, s - 20) }, // Slight dip
      { name: 'May', score: Math.max(300, s - 5) },
      { name: 'Jun', score: s },
    ];
  };

  const dynamicScoreData = getDynamicScoreData(currentScore);

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Welcome back, {currentUser.name}!</h1>
        <p className="text-[#94A3B8]">Here's your credit and application summary for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Credit Score KPI */}
        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[#94A3B8] font-medium">Current Credit Score</h3>
            <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center text-[#3B82F6]">
              <Activity size={20} />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-bold text-[#FFFFFF]">{currentScore}</p>
            {currentScore !== 'N/A' && (
              <p className="text-sm font-medium text-[#10B981] mb-1 flex items-center"><ArrowUpRight size={16} /> +15 pts</p>
            )}
          </div>
          <p className="text-sm text-[#94A3B8] mt-2">Rating: <span className={`font-bold ${ratingInfo.color}`}>{ratingInfo.category}</span></p>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#3B82F6]/5 rounded-full blur-2xl group-hover:bg-[#3B82F6]/10 transition-colors"></div>
        </div>

        {/* Eligibility Status */}
        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[#94A3B8] font-medium">Loan Eligibility</h3>
            <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center text-[#10B981]">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#FFFFFF] mb-2">{currentScore !== 'N/A' ? 'Pre-Approved' : 'Pending Profile'}</p>
          <p className="text-sm text-[#94A3B8]">{currentScore !== 'N/A' ? 'You are highly likely to be approved for loans up to $50,000.' : 'Apply for a loan to generate your credit profile.'}</p>
        </div>

        {/* Active Applications */}
        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[#94A3B8] font-medium">Active Applications</h3>
            <div className="w-10 h-10 bg-[#FACC15]/10 rounded-xl flex items-center justify-center text-[#FACC15]">
              <FileText size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold text-[#FFFFFF] mb-2">{pendingApps}</p>
          <p className="text-sm text-[#94A3B8]">Applications currently under review.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Trend Chart */}
        <div className="lg:col-span-2 bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
          <h2 className="text-lg font-bold text-[#FFFFFF] mb-6">Credit Score Trend</h2>
          <div className="h-64">
            {currentScore === 'N/A' ? (
              <div className="h-full flex items-center justify-center text-center text-[#94A3B8] border-2 border-dashed border-[#1E2A68] rounded-xl bg-[#050B2D]">
                <p>Not enough data to display trend.<br/><span className="text-sm">Submit an application to establish history.</span></p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} domain={['dataMin - 20', 'dataMax + 20']} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E2A68" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09133E', border: '1px solid #1E2A68', borderRadius: '8px', color: '#FFFFFF' }}
                    itemStyle={{ color: '#3B82F6' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Notifications Widget */}
        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#FFFFFF]">Recent Alerts</h2>
            <BellRing size={18} className="text-[#94A3B8]" />
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {myNotifs.slice(0, 4).map(n => (
              <div key={n.id} className="p-3 bg-[#050B2D] border border-[#1E2A68] rounded-xl flex gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.type === 'success' ? 'bg-[#10B981]' : n.type === 'info' ? 'bg-[#3B82F6]' : 'bg-[#FACC15]'}`}></div>
                <div>
                  <p className="text-sm font-medium text-[#FFFFFF] mb-1">{n.title}</p>
                  <p className="text-xs text-[#94A3B8] line-clamp-2">{n.desc}</p>
                </div>
              </div>
            ))}
            {myNotifs.length === 0 && <p className="text-[#94A3B8] text-sm text-center py-4">No recent alerts.</p>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
        <h2 className="text-lg font-bold text-[#FFFFFF] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => navigate('/user/application')} className="px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-[#FFFFFF] font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-colors">
            Apply for a Loan
          </button>
          <button onClick={() => navigate('/user/report')} className="px-6 py-3 bg-[#050B2D] hover:bg-[#09133E] text-[#FFFFFF] font-medium rounded-xl border border-[#1E2A68] transition-colors">
            Download Credit Report
          </button>
          <button onClick={() => navigate('/user/emi')} className="px-6 py-3 bg-[#050B2D] hover:bg-[#09133E] text-[#FFFFFF] font-medium rounded-xl border border-[#1E2A68] transition-colors">
            Calculate EMI
          </button>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
