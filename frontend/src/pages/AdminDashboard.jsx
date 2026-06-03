import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileSearch, CheckCircle, XCircle, Clock } from 'lucide-react';
import { fetchApplications, fetchUsers } from '../utils/dataStore';

const data = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 180 },
  { name: 'Mar', value: 150 },
  { name: 'Apr', value: 240 },
  { name: 'May', value: 210 },
  { name: 'Jun', value: 290 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      const fetchedApps = await fetchApplications();
      setApps(fetchedApps);
      
      const res = await fetch('http://localhost:5000/api/users');
      if (res.ok) {
        setAllUsers(await res.json());
      }
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalApps = apps.length;
  const approvedApps = apps.filter(a => a.status === 'Approved').length;
  const rejectedApps = apps.filter(a => a.status === 'Rejected').length;
  const pendingApps = apps.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;
  
  const applicants = allUsers.filter(u => u.role === 'User');

  const riskData = [
    { name: 'Low Risk', value: apps.filter(a => a.risk === 'Low').length || 65, color: '#10B981' },
    { name: 'Medium Risk', value: apps.filter(a => a.risk === 'Medium').length || 25, color: '#FACC15' },
    { name: 'High Risk', value: apps.filter(a => a.risk === 'High').length || 10, color: '#EF4444' },
  ];

  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const recentActivity = apps.slice(0, 5).map(app => ({
    ...app,
    action: app.status === 'Pending' || app.status === 'Under Review' ? 'Review Required' : `${app.status} Loan`,
    time: app.date
  }));

  const handleExportReport = () => {
    // Generate a full month of mock data (30 records)
    const statuses = ['Approved', 'Pending', 'Rejected'];
    const names = ['Michael Chen', 'Sarah Jenkins', 'Robert Fox', 'Emily Davis', 'Alex Johnson', 'Samantha Williams'];
    const actions = ['Approved Loan', 'Review Required', 'Rejected Loan', 'More Info Needed'];
    
    let csvData = "Application ID,Applicant,Amount,Action,Status,Time\n";
    for(let i=1; i<=30; i++) {
      const id = `APP-20${100 - i}`;
      const name = names[Math.floor(Math.random() * names.length)];
      const amount = `$${Math.floor(Math.random() * 90 + 10)},000`;
      const action = actions[Math.floor(Math.random() * actions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const time = `${i} days ago`;
      csvData += `${id},${name},${amount},${action},${status},${time}\n`;
    }

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "credscore_monthly_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="text-[#94A3B8]">Welcome back, here's what's happening today</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportReport}
            className="px-4 py-2 bg-[#101B57] text-[#FFFFFF] border border-[#1E2A68] rounded-lg hover:bg-[#1E2A68] transition-colors text-sm font-medium"
          >
            Export Report
          </button>
          <button 
            onClick={() => setShowNewAppModal(true)} 
            className="px-4 py-2 bg-[#3B82F6] text-[#FFFFFF] rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            New Application
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] relative overflow-hidden group hover:border-[#3B82F6]/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[#94A3B8] text-sm font-medium w-24">Total Applications</h3>
            <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center text-[#3B82F6]">
              <FileSearch size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold text-[#FFFFFF] mb-2">{totalApps}</p>
          <p className="text-xs text-[#94A3B8]">
            <span className="text-[#10B981] font-medium">+12.5%</span> from last month
          </p>
        </div>

        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] relative overflow-hidden group hover:border-[#3B82F6]/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[#94A3B8] text-sm font-medium w-24">Approved Loans</h3>
            <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center text-[#10B981]">
              <CheckCircle size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold text-[#FFFFFF] mb-2">{approvedApps}</p>
          <p className="text-xs text-[#94A3B8]">
            <span className="text-[#10B981] font-medium">+8.2%</span> from last month
          </p>
        </div>

        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] relative overflow-hidden group hover:border-[#3B82F6]/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[#94A3B8] text-sm font-medium w-24">Rejected Loans</h3>
            <div className="w-10 h-10 bg-[#EF4444]/10 rounded-xl flex items-center justify-center text-[#EF4444]">
              <XCircle size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold text-[#FFFFFF] mb-2">{rejectedApps}</p>
          <p className="text-xs text-[#94A3B8]">
            <span className="text-[#EF4444] font-medium">+3.1%</span> from last month
          </p>
        </div>

        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] relative overflow-hidden group hover:border-[#3B82F6]/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[#94A3B8] text-sm font-medium w-24">Pending Reviews</h3>
            <div className="w-10 h-10 bg-[#FACC15]/10 rounded-xl flex items-center justify-center text-[#FACC15]">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold text-[#FFFFFF] mb-2">{pendingApps}</p>
          <p className="text-xs text-[#94A3B8]">
            <span className="text-[#EF4444] font-medium">-5.3%</span> from last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#FFFFFF] mb-1">Monthly Applications</h2>
            <p className="text-sm text-[#94A3B8]">Application trends over the last 6 months</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E2A68" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09133E', border: '1px solid #1E2A68', borderRadius: '8px', color: '#FFFFFF' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  activeDot={{ r: 6, fill: '#3B82F6', stroke: '#050B2D', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-[#101B57] rounded-2xl p-6 border border-[#1E2A68] flex flex-col">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-[#FFFFFF] mb-1">Risk Distribution</h2>
            <p className="text-sm text-[#94A3B8]">Current portfolio breakdown</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09133E', border: '1px solid #1E2A68', borderRadius: '8px', color: '#FFFFFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs text-[#94A3B8] font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] overflow-hidden">
        <div className="p-6 border-b border-[#1E2A68] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#FFFFFF]">Recent Activity</h2>
          <button onClick={() => navigate('/admin/applications')} className="text-sm text-[#3B82F6] hover:text-[#FFFFFF] transition-colors font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#09133E] text-[#94A3B8] font-medium">
              <tr>
                <th className="px-6 py-4">Application ID</th>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A68]">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-[#0A1445]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#3B82F6]">{activity.id}</td>
                  <td className="px-6 py-4 text-[#FFFFFF]">{activity.name}</td>
                  <td className="px-6 py-4 text-[#FFFFFF]">{activity.amount}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{activity.action}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      activity.status === 'Approved' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                      activity.status === 'Rejected' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                      'bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[#94A3B8]">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Application Modal */}
      {showNewAppModal && (
        <div className="fixed inset-0 bg-[#050B2D]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-[#1E2A68] flex justify-between items-center bg-[#09133E]">
              <h2 className="text-xl font-bold text-[#FFFFFF]">Create New Application</h2>
              <button onClick={() => setShowNewAppModal(false)} className="text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Select Applicant</label>
                <select className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] outline-none focus:border-[#3B82F6]">
                  <option value="">-- Choose an existing user --</option>
                  {applicants.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Loan Amount ($)</label>
                <input type="number" placeholder="e.g. 50000" className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] outline-none focus:border-[#3B82F6]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Loan Purpose</label>
                <select className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] outline-none focus:border-[#3B82F6]">
                  <option value="home">Home Mortgage</option>
                  <option value="auto">Auto Loan</option>
                  <option value="personal">Personal Loan</option>
                  <option value="business">Business Expansion</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-[#1E2A68] flex justify-end gap-3 bg-[#09133E]">
              <button onClick={() => setShowNewAppModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowNewAppModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-colors">
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminDashboard;
