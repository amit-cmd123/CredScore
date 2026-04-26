import React from 'react';
import Layout from './Layout';
import { 
  LayoutDashboard, FilePlus, Activity, ShieldAlert, 
  CheckSquare, FileText, Calculator, BarChart2, 
  History, Sparkles, HelpCircle, Settings 
} from 'lucide-react';

const userNavItems = [
  { name: 'Dashboard', path: '/user-dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Loan Application', path: '/user/application', icon: <FilePlus size={20} /> },
  { name: 'Credit Score', path: '/user/score', icon: <Activity size={20} /> },
  { name: 'Risk Status', path: '/user/risk', icon: <ShieldAlert size={20} /> },
  { name: 'Loan Decision', path: '/user/decision', icon: <CheckSquare size={20} /> },
  { name: 'Credit Report', path: '/user/report', icon: <FileText size={20} /> },
  { name: 'EMI Calculator', path: '/user/emi', icon: <Calculator size={20} /> },
  { name: 'Analytics', path: '/user/analytics', icon: <BarChart2 size={20} /> },
  { name: 'History', path: '/user/history', icon: <History size={20} /> },
  { name: 'Recommendations', path: '/user/recommendations', icon: <Sparkles size={20} /> },
  { name: 'Help & Support', path: '/user/support', icon: <HelpCircle size={20} /> },
  { name: 'Settings', path: '/user/settings', icon: <Settings size={20} /> },
];

const UserLayout = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  
  return (
    <Layout 
      navItems={userNavItems} 
      title="User Portal"
      userRole="Applicant"
      userName={currentUser.name || "Applicant User"}
    >
      {children}
    </Layout>
  );
};

export default UserLayout;
