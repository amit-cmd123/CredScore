import React from 'react';
import Layout from './Layout';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckSquare, 
  AlertTriangle, 
  BarChart3, 
  FileCheck, 
  Settings 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Applications', path: '/admin/applications', icon: <FileText size={20} /> },
  { name: 'Applicant Management', path: '/admin/applicants', icon: <Users size={20} /> },
  { name: 'Loan Decisions', path: '/admin/decisions', icon: <CheckSquare size={20} /> },
  { name: 'Risk Analysis', path: '/admin/risk', icon: <AlertTriangle size={20} /> },
  { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
  { name: 'Credit Reports', path: '/admin/reports', icon: <FileCheck size={20} /> },
  { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
];

const AdminLayout = ({ children }) => {
  const [adminName, setAdminName] = React.useState('Admin User');

  React.useEffect(() => {
    const userStr = localStorage.getItem('credscore_current_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.name) {
          setAdminName(user.name);
        }
      } catch (e) {}
    }
  }, []);

  return (
    <Layout 
      navItems={navItems} 
      title="Admin Portal"
      userRole="System Admin"
      userName={adminName}
    >
      {children}
    </Layout>
  );
};

export default AdminLayout;
