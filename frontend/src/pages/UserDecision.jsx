import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import { fetchApplications, updateApplicationStatus, createNotification } from '../utils/dataStore';
import { CheckCircle2, XCircle, Clock, FileCheck, Search, PenTool, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDecision = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const [apps, setApps] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignModal, setShowSignModal] = useState(false);
  const [showAdverseModal, setShowAdverseModal] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState('');
  const [signError, setSignError] = useState('');

  useEffect(() => {
    const loadApps = async () => {
      const userApps = await fetchApplications(currentUser.id);
      setApps(userApps);
      if (userApps.length > 0 && !selectedAppId) {
        setSelectedAppId(userApps[0].id);
      }
    };
    loadApps();
    const interval = setInterval(loadApps, 5000);
    return () => clearInterval(interval);
  }, [currentUser.id, selectedAppId]);

  const activeApp = apps.find(a => a.id === selectedAppId) || (apps.length > 0 ? apps[0] : null);

  const handleSignDocuments = async () => {
    if (!signature.trim() || signature.trim().toLowerCase() !== currentUser.name.toLowerCase()) {
      setSignError(`Please type your exact full name: "${currentUser.name}" to sign.`);
      return;
    }
    setSignError('');
    setIsSigning(true);

    try {
      await updateApplicationStatus(activeApp.id, 'Active');
      
      await createNotification('Admin', 'ALL', 'Loan Agreement Signed', `${currentUser.name} signed the agreement for loan ${activeApp.id}.`, 'success');
      await createNotification('User', currentUser.id, 'Loan Active', `Congratulations! Your loan ${activeApp.id} is now active and funds will be disbursed shortly.`, 'success');

      setApps(apps.map(a => a.id === activeApp.id ? { ...a, status: 'Active' } : a));
      setIsSigning(false);
      setShowSignModal(false);
    } catch (err) {
      console.error(err);
      setIsSigning(false);
      setSignError('Failed to sign document due to server error.');
    }
  };

  if (!activeApp) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <FileCheck size={64} className="text-[#3B82F6] mb-6 opacity-50" />
          <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">No Active Applications</h2>
          <p className="text-[#94A3B8] mb-8 max-w-md">You haven't submitted any loan applications yet. Apply now to see your instant decision.</p>
          <button onClick={() => navigate('/user/application')} className="px-8 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-[#FFFFFF] font-bold rounded-xl transition-colors">
            Start Application
          </button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Loan Decisions</h1>
          <p className="text-[#94A3B8]">Review the final underwriting decisions for your applications.</p>
        </div>
        
        {apps.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
              <input 
                type="text" 
                placeholder="Search ID..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-[#101B57] border border-[#1E2A68] rounded-xl pl-10 pr-4 py-2 text-sm text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none"
              />
            </div>
            <select 
              value={selectedAppId || ''} 
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="bg-[#101B57] border border-[#1E2A68] rounded-xl px-4 py-2 text-sm text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none cursor-pointer appearance-none min-w-[200px]"
            >
              {apps.filter(a => a.id.toLowerCase().includes(searchQuery.toLowerCase())).map(app => (
                <option key={app.id} value={app.id}>
                  {app.id} - {app.amount} ({app.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-[#101B57] rounded-3xl p-8 md:p-12 border border-[#1E2A68] shadow-2xl relative overflow-hidden text-center">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#3B82F6] to-[#10B981]"></div>

          <div className="flex justify-center mb-6">
            {activeApp.status === 'Approved' ? (
              <div className="w-24 h-24 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={48} />
              </div>
            ) : activeApp.status === 'Rejected' ? (
              <div className="w-24 h-24 bg-[#EF4444]/10 rounded-full flex items-center justify-center text-[#EF4444] shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <XCircle size={48} />
              </div>
            ) : (
              <div className="w-24 h-24 bg-[#FACC15]/10 rounded-full flex items-center justify-center text-[#FACC15] shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                <Clock size={48} />
              </div>
            )}
          </div>

          <h2 className="text-4xl font-black text-[#FFFFFF] mb-4">
            {activeApp.status === 'Approved' ? 'Congratulations!' : 
             activeApp.status === 'Active' ? 'Loan Active' : 
             activeApp.status === 'Rejected' ? 'Application Declined' : 
             'Under Review'}
          </h2>

          <p className="text-[#94A3B8] text-lg mb-10 max-w-xl mx-auto">
            {activeApp.status === 'Approved' ? `Your loan application for ${activeApp.amount} has been fully approved by our underwriting team.` : 
             activeApp.status === 'Active' ? `Your loan for ${activeApp.amount} is currently active and in good standing.` : 
             activeApp.status === 'Rejected' ? `We regret to inform you that we cannot approve your request for ${activeApp.amount} at this time based on your current credit profile.` : 
             `Your application for ${activeApp.amount} is currently being reviewed by our team. We will notify you once a decision is made.`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto bg-[#050B2D] p-6 rounded-2xl border border-[#1E2A68] mb-8 text-left">
            <div>
              <p className="text-[#94A3B8] text-sm mb-1">Application ID</p>
              <p className="text-[#FFFFFF] font-bold">{activeApp.id}</p>
            </div>
            <div>
              <p className="text-[#94A3B8] text-sm mb-1">Date Submitted</p>
              <p className="text-[#FFFFFF] font-bold">{activeApp.date}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#1E2A68]">
              <p className="text-[#94A3B8] text-sm mb-1">Requested Amount</p>
              <p className="text-[#3B82F6] font-bold text-xl">{activeApp.amount}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#1E2A68]">
              <p className="text-[#94A3B8] text-sm mb-1">Credit Score Used</p>
              <p className="text-[#FFFFFF] font-bold text-xl">{activeApp.score}</p>
            </div>
          </div>

          {activeApp.status === 'Approved' && (
            <button onClick={() => setShowSignModal(true)} className="w-full max-w-sm mx-auto py-4 bg-[#10B981] hover:bg-[#059669] text-[#FFFFFF] font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors text-lg flex justify-center items-center gap-2">
              <PenTool size={20} />
              Accept & Sign Documents
            </button>
          )}

          {activeApp.status === 'Active' && (
            <button disabled className="w-full max-w-sm mx-auto py-4 bg-[#1E2A68] text-[#94A3B8] font-bold rounded-xl cursor-not-allowed text-lg flex justify-center items-center gap-2">
              <CheckCircle2 size={20} />
              Agreement Signed
            </button>
          )}

          {activeApp.status === 'Rejected' && (
            <button onClick={() => setShowAdverseModal(true)} className="w-full max-w-sm mx-auto py-4 bg-[#050B2D] border border-[#1E2A68] hover:bg-[#1E2A68] text-[#FFFFFF] font-bold rounded-xl transition-colors text-lg">
              View Adverse Action Notice
            </button>
          )}
        </div>
      </div>

      {/* Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-[#050B2D]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101B57] p-8 rounded-3xl border border-[#1E2A68] max-w-2xl w-full animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#FFFFFF]">Sign Loan Agreement</h3>
              <button onClick={() => !isSigning && setShowSignModal(false)} className="text-[#94A3B8] hover:text-[#FFFFFF]">
                <X size={24} />
              </button>
            </div>
            
            <div className="h-64 overflow-y-auto bg-[#09133E] border border-[#1E2A68] p-6 rounded-xl mb-6 font-mono text-sm text-[#94A3B8]">
              <h4 className="text-[#FFFFFF] font-bold mb-4 text-center">MASTER PROMISSORY NOTE & LOAN AGREEMENT</h4>
              <p className="mb-4">This Loan Agreement ("Agreement") is entered into by and between CredScore Financial ("Lender") and {currentUser.name} ("Borrower").</p>
              <p className="mb-4">1. LOAN AMOUNT: Subject to the terms of this Agreement, Lender agrees to loan Borrower the principal sum of {activeApp.amount}.</p>
              <p className="mb-4">2. REPAYMENT: Borrower promises to pay to Lender the principal amount plus any accrued interest according to the finalized EMI schedule.</p>
              <p className="mb-4">3. PREPAYMENT: Borrower may prepay this loan in full or in part at any time without penalty.</p>
              <p className="mb-4">4. DEFAULT: If Borrower fails to make any payment when due, Lender may declare the entire remaining balance immediately due and payable.</p>
              <p>By signing below, Borrower acknowledges having read, understood, and agreed to all terms and conditions contained in this Agreement.</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Electronic Signature (Type your full name)</label>
              <input 
                type="text" 
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder={currentUser.name}
                className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-xl px-4 py-4 text-xl text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none font-signature italic tracking-wider"
              />
              {signError && <p className="text-[#EF4444] text-sm mt-2 font-medium">{signError}</p>}
            </div>

            <button 
              onClick={handleSignDocuments}
              disabled={isSigning}
              className="w-full py-4 bg-[#10B981] text-[#FFFFFF] rounded-xl font-bold hover:bg-[#059669] transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isSigning ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#FFFFFF]/30 border-t-[#FFFFFF] rounded-full animate-spin"></div>
                  Processing Signature...
                </>
              ) : (
                'I Agree and Sign Document'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Adverse Action Notice Modal */}
      {showAdverseModal && (
        <div className="fixed inset-0 bg-[#050B2D]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101B57] p-8 rounded-3xl border border-[#EF4444]/30 max-w-2xl w-full animate-fade-in-up shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            <div className="flex justify-between items-center mb-6 border-b border-[#1E2A68] pb-4">
              <h3 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                <XCircle className="text-[#EF4444]" size={24} />
                Notice of Adverse Action
              </h3>
              <button onClick={() => setShowAdverseModal(false)} className="text-[#94A3B8] hover:text-[#FFFFFF]">
                <X size={24} />
              </button>
            </div>
            
            <div className="h-72 overflow-y-auto bg-[#09133E] border border-[#1E2A68] p-6 rounded-xl mb-6 font-mono text-sm text-[#94A3B8] shadow-inner">
              <div className="flex justify-between items-start mb-6 border-b border-[#1E2A68] pb-4">
                <div>
                  <h4 className="text-[#FFFFFF] font-bold">CREDSTORE FINANCIAL</h4>
                  <p>123 Fintech Way, Suite 400</p>
                  <p>San Francisco, CA 94105</p>
                </div>
                <div className="text-right">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Application ID: {activeApp.id}</p>
                </div>
              </div>

              <p className="mb-4">Dear {currentUser.name},</p>
              
              <p className="mb-4">Thank you for your recent application for a loan in the amount of {activeApp.amount}. We have carefully reviewed your application, along with your credit report and other information you provided.</p>
              
              <p className="mb-4">We regret to inform you that we are unable to approve your application at this time. Our decision was based in whole or in part on information obtained in a report from the consumer reporting agencies listed below:</p>
              
              <div className="bg-[#101B57] p-4 rounded-lg border border-[#1E2A68] mb-4">
                <p className="text-[#FFFFFF] font-bold mb-2">Principal Reasons for Denial:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#EF4444]">
                  {activeApp.score < 600 ? <li>Credit score ({activeApp.score}) does not meet our minimum threshold.</li> : null}
                  <li>Debt-to-Income (DTI) ratio exceeds our current risk parameters.</li>
                  <li>Insufficient length of credit history.</li>
                </ul>
              </div>

              <p className="mb-4 text-xs">You have a right under the Fair Credit Reporting Act to know the information contained in your credit file at the consumer reporting agency. The reporting agency played no part in our decision and is unable to supply specific reasons why we have denied credit to you.</p>
              
              <p>Sincerely,</p>
              <p className="mt-2 font-bold text-[#FFFFFF]">The CredScore Underwriting Team</p>
            </div>

            <button 
              onClick={() => window.print()}
              className="w-full py-4 bg-[#1E2A68] text-[#FFFFFF] rounded-xl font-bold hover:bg-[#3B82F6] transition-colors flex justify-center items-center gap-2"
            >
              Download PDF Copy
            </button>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default UserDecision;
