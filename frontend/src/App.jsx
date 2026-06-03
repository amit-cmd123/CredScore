import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplications from './pages/AdminApplications';
import AdminApplicants from './pages/AdminApplicants';
import AdminApplicantProfile from './pages/AdminApplicantProfile';
import AdminDecisions from './pages/AdminDecisions';
import AdminRisk from './pages/AdminRisk';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import UserDashboard from './pages/UserDashboard';
import UserApplication from './pages/UserApplication';
import UserScore from './pages/UserScore';
import UserRisk from './pages/UserRisk';
import UserDecision from './pages/UserDecision';
import UserReport from './pages/UserReport';
import UserEmi from './pages/UserEmi';
import UserAnalytics from './pages/UserAnalytics';
import UserHistory from './pages/UserHistory';
import UserRecommendations from './pages/UserRecommendations';
import UserSupport from './pages/UserSupport';
import UserSettings from './pages/UserSettings';

const ProtectedRoute = ({ children, allowedRole }) => {
  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user'));
  
  // Strict check: Must exist, must have keys, and must have a defined role
  if (!currentUser || Object.keys(currentUser).length === 0 || !currentUser.role) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== allowedRole) {
    return <Navigate to={currentUser.role === 'Admin' ? '/admin-dashboard' : '/user-dashboard'} replace />;
  }
  
  return children;
};

function App() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const savedTheme = localStorage.getItem('credscore_theme') || 'light';
      if (savedTheme === 'system') {
        document.documentElement.className = mediaQuery.matches ? 'dark-theme' : 'light-theme';
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="Admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute allowedRole="Admin"><AdminApplications /></ProtectedRoute>} />
        <Route path="/admin/applicants" element={<ProtectedRoute allowedRole="Admin"><AdminApplicants /></ProtectedRoute>} />
        <Route path="/admin/applicants/:id" element={<ProtectedRoute allowedRole="Admin"><AdminApplicantProfile /></ProtectedRoute>} />
        <Route path="/admin/decisions" element={<ProtectedRoute allowedRole="Admin"><AdminDecisions /></ProtectedRoute>} />
        <Route path="/admin/risk" element={<ProtectedRoute allowedRole="Admin"><AdminRisk /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRole="Admin"><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRole="Admin"><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRole="Admin"><AdminSettings /></ProtectedRoute>} />
        
        {/* User Routes */}
        <Route path="/user-dashboard" element={<ProtectedRoute allowedRole="User"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/application" element={<ProtectedRoute allowedRole="User"><UserApplication /></ProtectedRoute>} />
        <Route path="/user/score" element={<ProtectedRoute allowedRole="User"><UserScore /></ProtectedRoute>} />
        <Route path="/user/risk" element={<ProtectedRoute allowedRole="User"><UserRisk /></ProtectedRoute>} />
        <Route path="/user/decision" element={<ProtectedRoute allowedRole="User"><UserDecision /></ProtectedRoute>} />
        <Route path="/user/report" element={<ProtectedRoute allowedRole="User"><UserReport /></ProtectedRoute>} />
        <Route path="/user/emi" element={<ProtectedRoute allowedRole="User"><UserEmi /></ProtectedRoute>} />
        <Route path="/user/analytics" element={<ProtectedRoute allowedRole="User"><UserAnalytics /></ProtectedRoute>} />
        <Route path="/user/history" element={<ProtectedRoute allowedRole="User"><UserHistory /></ProtectedRoute>} />
        <Route path="/user/recommendations" element={<ProtectedRoute allowedRole="User"><UserRecommendations /></ProtectedRoute>} />
        <Route path="/user/support" element={<ProtectedRoute allowedRole="User"><UserSupport /></ProtectedRoute>} />
        <Route path="/user/settings" element={<ProtectedRoute allowedRole="User"><UserSettings /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
