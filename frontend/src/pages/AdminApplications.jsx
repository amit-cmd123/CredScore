import React, { useState, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Search, Filter, Eye, CheckCircle, XCircle, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getApplications, saveApplications, getUsers, addNotification } from '../utils/dataStore';

// Data is now loaded from dataStore

const AdminApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(() => getApplications());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // New Application Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppUserId, setNewAppUserId] = useState('');
  const [newAppAmount, setNewAppAmount] = useState('');
  const [newAppPurpose, setNewAppPurpose] = useState('Home Mortgage');
  const allUsers = getUsers() || [];

  // Search and Filter Logic
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.amount.includes(searchQuery);
        
      const matchesFilter = filterStatus === 'All' || app.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [applications, searchQuery, filterStatus]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const currentApps = filteredApps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Actions
  const handleApprove = (id) => {
    const updated = applications.map(app => app.id === id ? { ...app, status: 'Approved' } : app);
    setApplications(updated);
    saveApplications(updated);
  };

  const handleReject = (id) => {
    const updated = applications.map(app => app.id === id ? { ...app, status: 'Rejected' } : app);
    setApplications(updated);
    saveApplications(updated);
  };

  const handleView = (app) => {
    // Navigate to loan decisions and pass the applicant data
    navigate('/admin/decisions', { state: { applicant: app } });
  };

  const handleCreateApplication = (e) => {
    e.preventDefault();
    if (!newAppUserId || !newAppAmount) return;

    const selectedUser = allUsers.find(u => u.id === newAppUserId);
    if (!selectedUser) return;

    const newApp = {
      id: `APP-9${Math.floor(1000 + Math.random() * 9000)}`,
      userId: selectedUser.id,
      name: selectedUser.name,
      amount: `$${parseInt(newAppAmount.replace(/\D/g, '') || '0').toLocaleString()}`,
      score: Math.floor(Math.random() * (850 - 550 + 1) + 550),
      risk: 'Pending',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    saveApplications(updatedApps);
    
    // Notifications
    addNotification('Admin', 'ALL', 'New Application Created', `Admin created application ${newApp.id} for ${newApp.name}.`, 'info');
    addNotification('User', selectedUser.id, 'Application Submitted', `An admin has submitted application ${newApp.id} on your behalf.`, 'success');

    setShowCreateModal(false);
    setNewAppUserId('');
    setNewAppAmount('');
    setNewAppPurpose('Home Mortgage');
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Applications</h1>
          <p className="text-[#94A3B8]">Review and process loan applications.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
        >
          <Plus size={18} />
          New Application
        </button>
      </div>

      <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-[#1E2A68] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#94A3B8]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-11 pr-4 py-2.5 bg-[#09133E] border border-[#1E2A68] rounded-xl text-sm text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none"
              placeholder="Search by name, ID, or amount..."
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto items-center">
            <Filter size={18} className="text-[#94A3B8]" />
            <select 
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-[#09133E] text-[#FFFFFF] border border-[#1E2A68] rounded-xl outline-none focus:border-[#3B82F6] text-sm font-medium cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#09133E] text-[#94A3B8] font-medium border-b border-[#1E2A68]">
              <tr>
                <th className="px-6 py-4">Application ID</th>
                <th className="px-6 py-4">Applicant Name</th>
                <th className="px-6 py-4">Loan Amount</th>
                <th className="px-6 py-4">Credit Score</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A68]">
              {currentApps.length > 0 ? currentApps.map((app) => (
                <tr key={app.id} className="hover:bg-[#0A1445]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#3B82F6]">{app.id}</td>
                  <td className="px-6 py-4 text-[#FFFFFF] font-medium">{app.name}</td>
                  <td className="px-6 py-4 text-[#FFFFFF]">{app.amount}</td>
                  <td className="px-6 py-4 text-[#FFFFFF]">{app.score}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      app.risk === 'Low' ? 'bg-[#10B981]/10 text-[#10B981]' :
                      app.risk === 'Medium' ? 'bg-[#FACC15]/10 text-[#FACC15]' :
                      'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {app.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      app.status === 'Approved' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                      app.status === 'Rejected' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                      app.status === 'Under Review' ? 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20' :
                      'bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#94A3B8]">{app.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(app)} className="p-1.5 text-[#94A3B8] hover:text-[#3B82F6] transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                      {app.status !== 'Approved' && app.status !== 'Rejected' && (
                        <>
                          <button onClick={() => handleApprove(app.id)} className="p-1.5 text-[#94A3B8] hover:text-[#10B981] transition-colors" title="Approve">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => handleReject(app.id)} className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] transition-colors" title="Reject">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-[#94A3B8]">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredApps.length > 0 && (
          <div className="p-4 border-t border-[#1E2A68] flex items-center justify-between text-sm text-[#94A3B8]">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredApps.length)} of {filteredApps.length} entries
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-[#1E2A68] rounded hover:bg-[#1E2A68] text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              
              {/* Dynamic Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === page 
                      ? 'bg-[#3B82F6] text-[#FFFFFF]' 
                      : 'border border-[#1E2A68] hover:bg-[#1E2A68] text-[#FFFFFF]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-[#1E2A68] rounded hover:bg-[#1E2A68] text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create New Application Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#050B2D]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101B57] border border-[#1E2A68] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="px-6 py-5 border-b border-[#1E2A68] flex justify-between items-center bg-[#09133E]">
              <h2 className="text-xl font-bold text-[#FFFFFF]">Create New Application</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-[#94A3B8] hover:text-[#FFFFFF] transition-colors bg-[#101B57] p-1.5 rounded-full border border-[#1E2A68]"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateApplication} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Select Applicant</label>
                <select 
                  required
                  value={newAppUserId}
                  onChange={(e) => setNewAppUserId(e.target.value)}
                  className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors appearance-none"
                >
                  <option value="" disabled>-- Choose an existing user --</option>
                  {allUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Loan Amount ($)</label>
                <input 
                  type="number"
                  required
                  min="1000"
                  placeholder="e.g. 50000"
                  value={newAppAmount}
                  onChange={(e) => setNewAppAmount(e.target.value)}
                  className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors placeholder:text-[#1E2A68]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Loan Purpose</label>
                <select 
                  value={newAppPurpose}
                  onChange={(e) => setNewAppPurpose(e.target.value)}
                  className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors appearance-none"
                >
                  <option value="Home Mortgage">Home Mortgage</option>
                  <option value="Personal">Personal / Credit Card Refinancing</option>
                  <option value="Auto">Auto Loan</option>
                  <option value="Business">Small Business</option>
                </select>
              </div>

              <div className="pt-6 border-t border-[#1E2A68] flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 text-[#94A3B8] font-medium hover:text-[#FFFFFF] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newAppUserId || !newAppAmount}
                  className="px-6 py-2.5 bg-[#3B82F6] text-[#FFFFFF] font-bold rounded-xl hover:bg-[#2563EB] transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminApplications;
