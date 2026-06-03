import React from 'react';
import UserLayout from '../components/UserLayout';
import { fetchApplications, fetchUserCreditScore } from '../utils/dataStore';
import { Download, FileText, CheckCircle } from 'lucide-react';

const UserReport = () => {
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const [apps, setApps] = React.useState([]);
  const [currentScore, setCurrentScore] = React.useState('Loading...');

  React.useEffect(() => {
    const loadData = async () => {
      const fetchedApps = await fetchApplications(currentUser.id);
      setApps(fetchedApps);
      
      const score = await fetchUserCreditScore(currentUser.id);
      setCurrentScore(score);
    };
    loadData();
  }, [currentUser.id]);

  const reportId = `CR-${currentUser.id?.replace('USR-', '') || '0000'}-2023`;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <UserLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Credit Report</h1>
          <p className="text-[#94A3B8]">Generated on {date} • Report #{reportId}</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-[#FFFFFF] font-medium rounded-xl transition-colors shadow-lg shadow-[#3B82F6]/20 print:hidden"
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>

      <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] overflow-hidden">
        {/* Header section of report */}
        <div className="p-8 border-b border-[#1E2A68] bg-gradient-to-r from-[#09133E] to-[#101B57]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#3B82F6]/20 rounded-full flex items-center justify-center border-4 border-[#3B82F6]/30">
                <span className="text-2xl font-bold text-[#3B82F6]">{currentScore}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#FFFFFF] mb-1">{currentUser.name || 'Applicant'}</h2>
                <p className="text-[#94A3B8]">{currentUser.email || 'applicant@example.com'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-sm">
              <div className="text-[#94A3B8]">Total Accounts:</div>
              <div className="text-[#FFFFFF] font-bold text-right">{currentScore === 'N/A' ? '0' : '8'}</div>
              <div className="text-[#94A3B8]">Open Accounts:</div>
              <div className="text-[#FFFFFF] font-bold text-right">{currentScore === 'N/A' ? '0' : '5'}</div>
              <div className="text-[#94A3B8]">Closed Accounts:</div>
              <div className="text-[#FFFFFF] font-bold text-right">{currentScore === 'N/A' ? '0' : '3'}</div>
              <div className="text-[#94A3B8]">Derogatory Marks:</div>
              <div className="text-[#10B981] font-bold text-right">0</div>
            </div>
          </div>
        </div>

        {currentScore === 'N/A' ? (
          <div className="p-16 text-center">
            <FileText size={48} className="text-[#94A3B8] mx-auto mb-4 opacity-50" />
            <p className="text-xl font-bold text-[#FFFFFF] mb-2">No Credit History Found</p>
            <p className="text-[#94A3B8] max-w-md mx-auto">You do not currently have any active credit accounts or history reported to our bureau. Submit a loan application to begin building your profile.</p>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
                <FileText className="text-[#3B82F6]" size={20} />
                Account Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#050B2D] rounded-xl border border-[#1E2A68]">
                  <p className="text-[#94A3B8] text-sm mb-1">Total Balances</p>
                  <p className="text-2xl font-bold text-[#FFFFFF]">₹12,450</p>
                </div>
                <div className="p-4 bg-[#050B2D] rounded-xl border border-[#1E2A68]">
                  <p className="text-[#94A3B8] text-sm mb-1">Total Credit Limit</p>
                  <p className="text-2xl font-bold text-[#FFFFFF]">₹45,000</p>
                </div>
                <div className="p-4 bg-[#050B2D] rounded-xl border border-[#1E2A68]">
                  <p className="text-[#94A3B8] text-sm mb-1">Debt to Income Ratio</p>
                  <p className="text-2xl font-bold text-[#FFFFFF]">22%</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
                <CheckCircle className="text-[#10B981]" size={20} />
                Payment History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#1E2A68]">
                      <th className="py-3 px-4 text-[#94A3B8] font-medium">Creditor Name</th>
                      <th className="py-3 px-4 text-[#94A3B8] font-medium">Account Type</th>
                      <th className="py-3 px-4 text-[#94A3B8] font-medium">Balance</th>
                      <th className="py-3 px-4 text-[#94A3B8] font-medium">Limit/Loan</th>
                      <th className="py-3 px-4 text-[#94A3B8] font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#1E2A68] hover:bg-[#09133E] transition-colors">
                      <td className="py-4 px-4 text-[#FFFFFF] font-medium">HDFC Bank</td>
                      <td className="py-4 px-4 text-[#94A3B8]">Credit Card</td>
                      <td className="py-4 px-4 text-[#FFFFFF]">₹2,150</td>
                      <td className="py-4 px-4 text-[#FFFFFF]">₹15,000</td>
                      <td className="py-4 px-4"><span className="text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded whitespace-nowrap">Pays as Agreed</span></td>
                    </tr>
                    <tr className="border-b border-[#1E2A68] hover:bg-[#09133E] transition-colors">
                      <td className="py-4 px-4 text-[#FFFFFF] font-medium">State Bank of India (SBI)</td>
                      <td className="py-4 px-4 text-[#94A3B8]">Auto Loan</td>
                      <td className="py-4 px-4 text-[#FFFFFF]">₹10,300</td>
                      <td className="py-4 px-4 text-[#FFFFFF]">₹25,000</td>
                      <td className="py-4 px-4"><span className="text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded whitespace-nowrap">Pays as Agreed</span></td>
                    </tr>
                    <tr className="hover:bg-[#09133E] transition-colors">
                      <td className="py-4 px-4 text-[#FFFFFF] font-medium">ICICI Bank</td>
                      <td className="py-4 px-4 text-[#94A3B8]">Personal Loan</td>
                      <td className="py-4 px-4 text-[#FFFFFF]">₹0</td>
                      <td className="py-4 px-4 text-[#FFFFFF]">₹5,000</td>
                      <td className="py-4 px-4"><span className="text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded whitespace-nowrap">Closed/Paid</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserReport;
