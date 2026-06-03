import React, { useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { fetchApplications } from '../utils/dataStore';


const AdminAnalytics = () => {
  const [apps, setApps] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      const fetchedApps = await fetchApplications();
      setApps(fetchedApps);
      
      const res = await fetch('http://localhost:5000/api/users');
      if (res.ok) {
        setUsers(await res.json());
      }
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const stats = useMemo(() => {
    const syntheticVolume = 4500000;
    const liveVolume = apps.reduce((sum, app) => sum + parseInt(String(app.amount).replace(/\D/g, '') || '0', 10), 0);
    const totalVolume = syntheticVolume + liveVolume;
    
    const syntheticScoreSum = 680 * 25;
    const liveScoreSum = apps.reduce((sum, app) => sum + (typeof app.score === 'number' ? app.score : 0), 0);
    const avgScore = Math.round((syntheticScoreSum + liveScoreSum) / (25 + apps.length));
    
    const syntheticApproved = 18;
    const liveApproved = apps.filter(a => a.status === 'Approved').length;
    const approvalRate = Math.round(((syntheticApproved + liveApproved) / (25 + apps.length)) * 100);

    const baseUsers = 142;

    return {
      volume: `$${(totalVolume / 1000000).toFixed(1)}M`,
      avgScore: avgScore.toString(),
      approvalRate: `${approvalRate}%`,
      newUsers: (baseUsers + users.filter(u => u.role === 'User').length).toString()
    };
  }, [apps, users]);

  const dynamicScoreData = useMemo(() => {
    const bins = { '300-500': 5, '501-600': 12, '601-700': 34, '701-800': 18, '801-850': 7 };
    apps.forEach(app => {
      if (app.score <= 500) bins['300-500']++;
      else if (app.score <= 600) bins['501-600']++;
      else if (app.score <= 700) bins['601-700']++;
      else if (app.score <= 800) bins['701-800']++;
      else bins['801-850']++;
    });
    return Object.entries(bins).map(([range, count]) => ({ range, count }));
  }, [apps]);

  const finalVolumeData = useMemo(() => {
    const data = [
      { name: 'Week 1', volume: 420 },
      { name: 'Week 2', volume: 310 },
      { name: 'Week 3', volume: 550 },
      { name: 'Week 4', volume: 480 },
    ];
    if (apps.length > 0) {
      const liveVolume = apps.reduce((sum, app) => sum + parseInt(String(app.amount).replace(/\D/g, '') || '0', 10), 0);
      data[3].volume += Math.floor(liveVolume / 10000); // Scale live volume reasonably into the chart
    }
    return data;
  }, [apps]);
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Analytics</h1>
        <p className="text-[#94A3B8]">Deep dive into system performance and portfolio insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Volume processed', value: stats ? stats.volume : '$0M', icon: <DollarSign size={20} />, trend: '+15%' },
          { title: 'Average Credit Score', value: stats ? stats.avgScore : '0', icon: <Activity size={20} />, trend: '+5 pts' },
          { title: 'Approval Rate', value: stats ? stats.approvalRate : '0%', icon: <TrendingUp size={20} />, trend: '+2%' },
          { title: 'New Users', value: stats ? stats.newUsers : '0', icon: <Users size={20} />, trend: '+12%' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center text-[#3B82F6]">
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-md">{stat.trend}</span>
            </div>
            <h3 className="text-[#94A3B8] text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-[#FFFFFF]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
          <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Monthly Volume</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalVolumeData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E2A68" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09133E', border: '1px solid #1E2A68', borderRadius: '8px', color: '#FFFFFF' }}
                  cursor={{fill: '#0A1445'}}
                />
                <Bar dataKey="volume" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
          <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Score Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicScoreData}>
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E2A68" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09133E', border: '1px solid #1E2A68', borderRadius: '8px', color: '#FFFFFF' }}
                />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', stroke: '#050B2D'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
