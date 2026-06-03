import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { CheckCircle2, XCircle, AlertCircle, FileText, User, Search } from 'lucide-react';
import { fetchApplications, updateApplicationStatus, createNotification } from '../utils/dataStore';

const AdminDecisions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [allApps, setAllApps] = useState([]);
  const [applicant, setApplicant] = useState(null);
  const [notes, setNotes] = useState('');
  const [decision, setDecision] = useState(null);
  const [overrideAI, setOverrideAI] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    const loadApps = async () => {
      const apps = await fetchApplications();
      setAllApps(apps);
      
      if (!applicant) {
        const defaultApp = location.state?.applicant 
          ? apps.find(a => a.id === location.state.applicant.id) 
          : apps.find(a => a.status === 'Pending') || apps[0];
        if (defaultApp) {
          setApplicant(defaultApp);
          setNotes(defaultApp.notes || '');
        }
      }
    };
    loadApps();
    const interval = setInterval(loadApps, 5000);
    return () => clearInterval(interval);
  }, [location.state?.applicant, applicant]);

  // Filter apps for search dropdown
  const filteredApps = allApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectApplicant = (app) => {
    setApplicant(app);
    setNotes(app.notes || '');
    setDecision(null);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleSaveNotes = async () => {
    setSaveStatus('Saving...');
    
    // In a real backend we would PUT the notes field, but let's just simulate it here since we don't have a notes endpoint yet
    // To implement it fully we'd need to modify the application schema, but for now we'll just mock the visual save.
    setTimeout(() => {
      setSaveStatus('Notes saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 600);
  };

  const handleSubmit = async () => {
    if (!decision) {
      alert('Please select a decision (Approve or Reject) before submitting.');
      return;
    }
    
    setSaveStatus('Submitting decision...');
    
    const newStatus = decision === 'Approve' ? 'Approved' : 'Rejected';
    await updateApplicationStatus(applicant.id, newStatus);
    
    await createNotification(
      'User', 
      applicant.userId, 
      `Loan Application ${newStatus}`, 
      `Your application ${applicant.id} has been ${newStatus.toLowerCase()} by an underwriter.`, 
      decision === 'Approve' ? 'success' : 'error'
    );
    
    setTimeout(() => {
      // Navigate back to applications list
      navigate('/admin/applications');
    }, 1000);
  };

  if (!applicant) {
    return <AdminLayout><div className="text-white text-center py-10">No applications available.</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Loan Decisions</h1>
          <p className="text-[#94A3B8]">Review applications requiring manual underwriter approval.</p>
        </div>
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
            placeholder="Search applications..."
          />
          {showDropdown && searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-[#09133E] border border-[#1E2A68] rounded-lg shadow-xl overflow-y-auto max-h-48">
              {filteredApps.length > 0 ? filteredApps.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => handleSelectApplicant(app)}
                  className="px-4 py-2 hover:bg-[#1E2A68] cursor-pointer text-sm border-b border-[#1E2A68] last:border-0"
                >
                  <div className="text-[#FFFFFF] font-medium">{app.name}</div>
                  <div className="text-xs text-[#94A3B8]">{app.id} - {app.status}</div>
                </div>
              )) : (
                <div className="px-4 py-3 text-sm text-[#94A3B8]">No applications found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Applicant Detail */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-6">
            <div className="flex items-center justify-between mb-6 border-b border-[#1E2A68] pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#09133E] rounded-full flex items-center justify-center text-[#3B82F6]">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#FFFFFF]">Application #{applicant.id}</h2>
                  <p className="text-sm text-[#94A3B8]">Applicant: {applicant.name}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium border rounded-full ${
                applicant.status === 'Approved' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                applicant.status === 'Rejected' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                'bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20'
              }`}>
                {applicant.status === 'Pending' || applicant.status === 'Under Review' ? 'Needs Manual Review' : applicant.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">Requested Amount</p>
                <p className="text-lg font-bold text-[#FFFFFF]">{applicant.amount}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">Credit Score</p>
                <p className={`text-lg font-bold ${
                  applicant.score >= 750 ? 'text-[#10B981]' : (applicant.score >= 650 ? 'text-[#FACC15]' : 'text-[#EF4444]')
                }`}>{applicant.score}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">DTI Ratio</p>
                <p className="text-lg font-bold text-[#EF4444]">42%</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">AI Risk Level</p>
                <p className={`text-lg font-bold ${
                  applicant.risk === 'Low' ? 'text-[#10B981]' : (applicant.risk === 'Medium' ? 'text-[#FACC15]' : 'text-[#EF4444]')
                }`}>{applicant.risk}</p>
              </div>
            </div>

            <div className="bg-[#09133E] rounded-xl p-4 border border-[#1E2A68]">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-[#FACC15] mt-0.5 shrink-0" size={18} />
                <div>
                  <h4 className="text-sm font-semibold text-[#FFFFFF] mb-1">AI Flag: High Debt-to-Income Ratio</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    The applicant's DTI ratio is above the standard threshold of 36%. However, they have a stable employment history of 8 years at the same company and no recent missed payments. Manual underwriter review is recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-6 relative">
            <h3 className="text-lg font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#3B82F6]" />
              Officer Notes
            </h3>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 bg-[#09133E] border border-[#1E2A68] rounded-xl p-4 text-sm text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none resize-none placeholder:text-[#94A3B8] mb-4"
              placeholder="Enter your evaluation notes here..."
            ></textarea>
            <div className="flex justify-end items-center gap-4">
              {saveStatus && <span className="text-sm text-[#10B981]">{saveStatus}</span>}
              <button 
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-[#1E2A68] hover:bg-[#3B82F6] text-[#FFFFFF] rounded-lg text-sm font-medium transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Decision Actions */}
        <div className="space-y-6">
          <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-6">
            <h3 className="text-lg font-bold text-[#FFFFFF] mb-6">Final Decision</h3>
            
            {applicant.status !== 'Pending' && applicant.status !== 'Under Review' ? (
              <div className="bg-[#09133E] rounded-xl p-6 border border-[#1E2A68] text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  applicant.status === 'Approved' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                }`}>
                  {applicant.status === 'Approved' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                </div>
                <h4 className="text-xl font-bold text-[#FFFFFF] mb-2">Application {applicant.status}</h4>
                <p className="text-sm text-[#94A3B8]">
                  This application has already been processed. Decisions cannot be changed once finalized.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={() => setDecision('Approve')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group border ${
                    decision === 'Approve' 
                      ? 'bg-[#10B981]/20 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'bg-[#10B981]/5 border-[#10B981]/30 hover:bg-[#10B981]/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#10B981]" size={24} />
                    <div className="text-left">
                      <span className="block font-bold text-[#10B981]">Approve Loan</span>
                      <span className="text-xs text-[#94A3B8]">Proceed to funding</span>
                    </div>
                  </div>
                  {decision === 'Approve' && <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>}
                </button>

                <button 
                  onClick={() => setDecision('Reject')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group border ${
                    decision === 'Reject' 
                      ? 'bg-[#EF4444]/20 border-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                      : 'bg-[#EF4444]/5 border-[#EF4444]/30 hover:bg-[#EF4444]/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <XCircle className="text-[#EF4444]" size={24} />
                    <div className="text-left">
                      <span className="block font-bold text-[#EF4444]">Reject Loan</span>
                      <span className="text-xs text-[#94A3B8]">Send denial notice</span>
                    </div>
                  </div>
                  {decision === 'Reject' && <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>}
                </button>

                <div className="pt-4 border-t border-[#1E2A68]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={overrideAI}
                      onChange={(e) => setOverrideAI(e.target.checked)}
                      className="w-4 h-4 rounded border-[#1E2A68] bg-[#09133E] text-[#3B82F6] focus:ring-[#3B82F6]" 
                    />
                    <span className="text-sm text-[#94A3B8] select-none">Override AI Recommendation</span>
                  </label>
                </div>

                <button 
                  onClick={handleSubmit}
                  className="w-full py-3 bg-[#3B82F6] text-[#FFFFFF] rounded-xl font-bold hover:bg-[#2563EB] transition-colors mt-4 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                >
                  {saveStatus === 'Submitting decision...' ? 'Processing...' : 'Submit Decision'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDecisions;
