import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { Search, MoreVertical, Mail, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';
import { fetchApplications } from '../utils/dataStore';

// Data is now loaded from dataStore

const AdminApplicants = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const loadData = async () => {
      const res = await fetch('http://localhost:5000/api/users');
      if (!res.ok) return;
      const users = await res.json();
      
      const apps = await fetchApplications();
      
      const mapped = users.filter(u => u.role === 'User').map(user => {
        const userApps = apps.filter(a => a.userId === user.id);
        const approvedCount = userApps.filter(a => a.status === 'Approved').length;
        return {
          ...user,
          activeLoans: approvedCount,
          recentStatus: userApps[0]?.status || 'No Application'
        };
      });
      setApplicants(mapped);
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const [activeKebab, setActiveKebab] = useState(null);

  const filteredApplicants = applicants.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    // Delete from local state first
    const updated = applicants.filter(app => app.id !== id);
    setApplicants(updated);
    setActiveKebab(null);
    // Note: To fully delete a user we would need a DELETE /api/users/:id route, 
    // but we can skip that for now or assume it exists. 
    await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleAction = (type, applicantObj) => {
    // Navigate to the specific applicant profile page and pass the data
    navigate(`/admin/applicants/${applicantObj.id}`, { state: { applicant: applicantObj } });
    setActiveKebab(null);
  };

  return (
    <AdminLayout>

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Applicant Management</h1>
          <p className="text-[#94A3B8]">Manage and view detailed profiles of all applicants.</p>
        </div>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#94A3B8]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 bg-[#101B57] border border-[#1E2A68] rounded-lg text-sm text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none"
            placeholder="Search applicants..."
          />
        </div>
      </div>

      {filteredApplicants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApplicants.map((applicant) => (
            <div key={applicant.id} className="bg-[#101B57] rounded-2xl border border-[#1E2A68] overflow-hidden hover:border-[#3B82F6]/50 transition-colors group">
              <div className="p-6 border-b border-[#1E2A68] relative">
                <button 
                  onClick={() => setActiveKebab(activeKebab === applicant.id ? null : applicant.id)}
                  className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#FFFFFF] p-1"
                >
                  <MoreVertical size={20} />
                </button>
                
                {/* Dropdown Menu */}
                {activeKebab === applicant.id && (
                  <div className="absolute top-10 right-4 w-36 bg-[#09133E] border border-[#1E2A68] rounded-lg shadow-xl overflow-hidden z-10 animate-fade-in-up">
                    <button onClick={() => handleAction('View Profile', applicant)} className="w-full text-left px-4 py-2 text-sm text-[#FFFFFF] hover:bg-[#1E2A68] transition-colors">View</button>
                    <button onClick={() => handleAction('Edit Profile', applicant)} className="w-full text-left px-4 py-2 text-sm text-[#FFFFFF] hover:bg-[#1E2A68] transition-colors">Edit</button>
                    <button onClick={() => handleDelete(applicant.id)} className="w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-[#1E2A68] transition-colors border-t border-[#1E2A68]">Delete</button>
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#09133E] rounded-full flex items-center justify-center text-xl font-bold text-[#3B82F6] border border-[#1E2A68]">
                    {applicant.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#FFFFFF]">{applicant.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-md font-medium">{applicant.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        applicant.recentStatus === 'Approved' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' :
                        applicant.recentStatus === 'Rejected' ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20' :
                        'bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/20'
                      }`}>
                        {applicant.recentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span>{applicant.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>{applicant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{applicant.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#09133E]/50">
                <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Financial Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Annual Income</p>
                    <p className="text-sm font-semibold text-[#FFFFFF]">{applicant.income}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Active Loans</p>
                    <p className="text-sm font-semibold text-[#FFFFFF]">{applicant.activeLoans}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-[#94A3B8] mb-1">Employer</p>
                    <p className="text-sm font-semibold text-[#FFFFFF]">{applicant.employer}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleAction('View Profile', applicant)} className="flex-1 py-2 bg-[#101B57] text-[#FFFFFF] border border-[#1E2A68] rounded-lg hover:bg-[#1E2A68] transition-colors text-xs font-medium">
                    View Full Profile
                  </button>
                  <button onClick={() => handleAction('Edit Profile', applicant)} className="px-3 py-2 bg-[#101B57] text-[#3B82F6] border border-[#1E2A68] rounded-lg hover:bg-[#1E2A68] transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(applicant.id)} className="px-3 py-2 bg-[#101B57] text-[#EF4444] border border-[#1E2A68] rounded-lg hover:bg-[#1E2A68] transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#101B57] rounded-2xl border border-[#1E2A68]">
          <p className="text-[#94A3B8]">No applicants found matching your search.</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminApplicants;
