import React, { useState } from 'react';
import UserLayout from '../components/UserLayout';
import { fetchApplications } from '../utils/dataStore';
import { Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const [userApps, setUserApps] = React.useState([]);

  React.useEffect(() => {
    const loadApps = async () => {
      const apps = await fetchApplications(currentUser.id);
      setUserApps(apps);
    };
    loadApps();
    const interval = setInterval(loadApps, 5000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const filteredApps = userApps.filter(app => 
    app.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.amount.includes(searchQuery) ||
    app.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';
      case 'Rejected': return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
      case 'Under Review': return 'text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20';
      default: return 'text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/20';
    }
  };

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Application History</h1>
        <p className="text-[#94A3B8]">View all your past and present loan applications.</p>
      </div>

      <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] overflow-hidden">
        <div className="p-6 border-b border-[#1E2A68]">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#94A3B8]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-2.5 bg-[#09133E] border border-[#1E2A68] rounded-xl text-sm text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none placeholder:text-[#1E2A68]"
              placeholder="Search by ID, amount, or status..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#09133E] text-[#94A3B8] font-medium border-b border-[#1E2A68]">
              <tr>
                <th className="px-6 py-4">Application ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Loan Amount</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A68]">
              {filteredApps.length > 0 ? filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-[#0A1445]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#3B82F6]">{app.id}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{app.date}</td>
                  <td className="px-6 py-4 text-[#FFFFFF] font-medium">{app.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      app.risk === 'Low' ? 'text-[#10B981]' :
                      app.risk === 'Medium' ? 'text-[#FACC15]' :
                      app.risk === 'Pending' ? 'text-[#94A3B8]' : 'text-[#EF4444]'
                    }`}>
                      {app.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => navigate('/user/decision')} className="p-2 bg-[#050B2D] border border-[#1E2A68] hover:bg-[#1E2A68] text-[#FFFFFF] rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#94A3B8]">
                    No application history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserHistory;
