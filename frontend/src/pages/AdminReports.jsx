import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Download, FileText, Search, CreditCard, Activity, Calendar } from 'lucide-react';

import { getUsers, getApplications, calculateUserCreditScore } from '../utils/dataStore';

// Generate realistic mock history for a user based on their data
const generateUserHistory = (user, apps) => {
  const history = [];
  const userApps = apps.filter(a => a.userId === user.id);
  
  if (userApps.length > 0) {
    userApps.forEach(app => {
      if (app.status === 'Approved') {
        history.push({ date: app.date, title: 'Loan Approved', desc: `Approved for ${app.amount}.`, color: 'bg-[#10B981]' });
      } else if (app.status === 'Rejected') {
        history.push({ date: app.date, title: 'Loan Rejected', desc: `Rejected application for ${app.amount}.`, color: 'bg-[#EF4444]' });
      } else {
        history.push({ date: app.date, title: 'Application Submitted', desc: `Applied for ${app.amount}.`, color: 'bg-[#FACC15]' });
      }
    });
  } else {
    history.push({ date: 'Oct 2023', title: 'Score Increased', desc: 'Due to consistent on-time payments.', color: 'bg-[#10B981]' });
    history.push({ date: 'Jan 2023', title: 'Account Opened', desc: 'New credit account added.', color: 'bg-[#3B82F6]' });
  }

  // Sort history by date descending
  return history.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Generate deterministic financial data for a user
const generateFinancials = (user) => {
  // Use user ID to make it deterministic
  const idNum = parseInt(user.id.replace(/[^0-9]/g, '')) || 100;
  
  // Parse income safely
  const incomeStr = user.income || '$50,000';
  const yearlyIncome = parseInt(incomeStr.replace(/[^0-9]/g, ''), 10) || 50000;
  
  const monthlyIncome = Math.round(yearlyIncome / 12);
  const totalAssets = yearlyIncome * (1 + (idNum % 3)); // simple multiplier
  const totalDebt = Math.round(yearlyIncome * 0.4 * (1 + (idNum % 5) * 0.1)); 
  const dti = Math.round((totalDebt / yearlyIncome) * 100);
  
  const totalCreditLimit = 20000 + (idNum * 100);
  const totalBalance = Math.round(totalCreditLimit * (0.1 + (idNum % 7) * 0.05));
  const utilization = Math.round((totalBalance / totalCreditLimit) * 100);

  return {
    monthlyIncome: `$${monthlyIncome.toLocaleString()}`,
    totalAssets: `$${totalAssets.toLocaleString()}`,
    totalDebt: `$${totalDebt.toLocaleString()}`,
    dti: `${dti}%`,
    totalCreditLimit: `$${totalCreditLimit.toLocaleString()}`,
    totalBalance: `$${totalBalance.toLocaleString()}`,
    availableCredit: `$${(totalCreditLimit - totalBalance).toLocaleString()}`,
    utilization: `${utilization}%`,
    utilizationOffset: 351.85 - (351.85 * (utilization / 100))
  };
};

const AdminReports = () => {
  const users = getUsers() || [];
  const apps = getApplications() || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(() => {
    const user = users[0];
    const userApps = apps.filter(a => a.userId === user.id);
    return {
      ...user,
      reportId: userApps.length > 0 ? userApps[0].id : `CR-${user.id.replace('USR-', '')}-2023`,
      score: calculateUserCreditScore(user.id),
      history: generateUserHistory(user, apps),
      financials: generateFinancials(user)
    };
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (user) => {
    const userApps = apps.filter(a => a.userId === user.id);
    setSelectedUser({
      ...user,
      reportId: userApps.length > 0 ? userApps[0].id : `CR-${user.id.replace('USR-', '')}-2023`,
      score: calculateUserCreditScore(user.id),
      history: generateUserHistory(user, apps),
      financials: generateFinancials(user)
    });
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleDownload = () => {
    // Triggers the browser's native print dialog which allows saving the view as a valid PDF
    window.print();
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Credit Reports</h1>
          <p className="text-[#94A3B8]">View and download comprehensive credit history reports.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64 z-20">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#94A3B8]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="block w-full pl-9 pr-3 py-2 bg-[#101B57] border border-[#1E2A68] rounded-lg text-sm text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none"
            placeholder="Search users..."
          />
          {showDropdown && searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-[#09133E] border border-[#1E2A68] rounded-lg shadow-xl overflow-y-auto max-h-48">
              {filteredUsers.length > 0 ? filteredUsers.map(u => (
                <div 
                  key={u.id} 
                  onClick={() => handleSelectUser(u)}
                  className="px-4 py-2 hover:bg-[#1E2A68] cursor-pointer text-sm border-b border-[#1E2A68] last:border-0"
                >
                  <div className="text-[#FFFFFF] font-medium">{u.name}</div>
                  <div className="text-xs text-[#94A3B8]">{u.id}</div>
                </div>
              )) : (
                <div className="px-4 py-3 text-sm text-[#94A3B8]">No users found.</div>
              )}
            </div>
          )}
        </div>
          <button 
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3B82F6] text-[#FFFFFF] rounded-xl hover:bg-[#2563EB] transition-colors font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" key={selectedUser.id}>
        {/* Main Report Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/5 rounded-bl-full"></div>
            
            <div className="flex items-center justify-between gap-4 mb-8 border-b border-[#1E2A68] pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#09133E] rounded-full flex items-center justify-center text-2xl font-bold text-[#FFFFFF] border-2 border-[#3B82F6]">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#FFFFFF]">{selectedUser.name}</h2>
                  <p className="text-[#3B82F6] font-medium mb-4">Report ID: {selectedUser.reportId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#94A3B8] text-sm mb-1">Credit Score</p>
                <p className={`text-3xl font-bold ${selectedUser.score === 'N/A' ? 'text-[#94A3B8]' : 'text-[#10B981]'}`}>{selectedUser.score}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
              <Activity size={20} className="text-[#3B82F6]" />
              Score History Timeline
            </h3>
            
            <div className="relative pl-6 border-l-2 border-[#1E2A68] space-y-6 mb-8">
              {selectedUser.history.map((item, index) => (
                <div key={index} className="relative">
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 ${item.color} rounded-full border-4 border-[#101B57]`}></div>
                  <p className="text-sm text-[#94A3B8] mb-1">{item.date}</p>
                  <p className="font-bold text-[#FFFFFF]">{item.title}</p>
                  <p className="text-xs text-[#94A3B8]">{item.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#3B82F6]" />
              Financial Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#09133E] rounded-xl p-4 border border-[#1E2A68]">
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">Total Assets</p>
                <p className="font-bold text-[#FFFFFF]">{selectedUser.financials?.totalAssets}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">Total Debt</p>
                <p className="font-bold text-[#FFFFFF]">{selectedUser.financials?.totalDebt}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">Monthly Income</p>
                <p className="font-bold text-[#FFFFFF]">{selectedUser.financials?.monthlyIncome}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">Debt/Income</p>
                <p className={`font-bold ${parseInt(selectedUser.financials?.dti) > 40 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                  {selectedUser.financials?.dti}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-6">
            <h3 className="text-lg font-bold text-[#FFFFFF] mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-[#3B82F6]" />
              Credit Utilization
            </h3>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[#1E2A68]"/>
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.85" strokeDashoffset={selectedUser.financials?.utilizationOffset || 246.3} className={`${parseInt(selectedUser.financials?.utilization) > 50 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}/>
                </svg>
                <div className="text-center z-10">
                  <span className="block text-2xl font-bold text-[#FFFFFF]">{selectedUser.financials?.utilization}</span>
                  <span className="text-xs text-[#94A3B8]">Utilized</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#94A3B8]">Total Credit Limit</span>
                <span className="font-bold text-[#FFFFFF]">{selectedUser.financials?.totalCreditLimit}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-[#1E2A68] pt-4">
                <span className="text-[#94A3B8]">Total Balance</span>
                <span className="font-bold text-[#FFFFFF]">{selectedUser.financials?.totalBalance}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-[#1E2A68] pt-4">
                <span className="text-[#94A3B8]">Available Credit</span>
                <span className="font-bold text-[#10B981]">{selectedUser.financials?.availableCredit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
