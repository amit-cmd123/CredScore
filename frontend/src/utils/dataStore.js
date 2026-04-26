import seedData from '../data/seed.json';

export const initGlobalData = () => {
  // Ensure notifications array exists
  if (!localStorage.getItem('credscore_notifications')) {
    localStorage.setItem('credscore_notifications', JSON.stringify(seedData.notifications || []));
  }

  let users = JSON.parse(localStorage.getItem('credscore_users') || 'null');
  let applications = JSON.parse(localStorage.getItem('credscore_applications') || 'null');

  let needsSave = false;

  // Initialize from seed if null
  if (!users) {
    users = seedData.users || [];
    needsSave = true;
  }
  if (!applications) {
    applications = seedData.applications || [];
    needsSave = true;
  }

  // Ensure default Admin exists so the user can immediately log in as admin to test
  if (!users.some(u => u.email === 'admin@credscore.com')) {
    users.unshift({
      id: 'USR-ADMIN',
      name: 'Super Admin',
      email: 'admin@credscore.com',
      password: 'password123',
      role: 'Admin',
      phone: '+1 (555) 999-9999',
      location: 'Headquarters',
      income: '$150,000',
      employer: 'CredScore Inc.',
      activeLoans: 0
    });
    needsSave = true;
  }

  if (needsSave) {
    localStorage.setItem('credscore_users', JSON.stringify(users));
    localStorage.setItem('credscore_applications', JSON.stringify(applications));
  }
};

export const getUsers = () => {
  initGlobalData();
  return JSON.parse(localStorage.getItem('credscore_users'));
};

export const saveUsers = (users) => {
  localStorage.setItem('credscore_users', JSON.stringify(users));
};

export const calculateUserCreditScore = (userId) => {
  const apps = JSON.parse(localStorage.getItem('credscore_applications') || '[]').filter(a => a.userId === userId);
  
  if (apps.length === 0) return 'N/A';

  let score = 550; // Base Score

  // 1. Evaluate based on the most recent financial snapshot provided in their latest application
  const latestApp = apps[0];
  
  // Parse income
  let incomeRaw = latestApp.income ? String(latestApp.income).replace(/\D/g, '') : '0';
  let monthlyIncome = parseInt(incomeRaw) || 0;
  
  if (monthlyIncome >= 10000) score += 120;
  else if (monthlyIncome >= 6000) score += 80;
  else if (monthlyIncome >= 3000) score += 50;
  else if (monthlyIncome >= 1500) score += 20;

  // Employment status
  if (latestApp.employment === 'Full-time') score += 50;
  else if (latestApp.employment === 'Self-employed') score += 30;
  else if (latestApp.employment === 'Part-time') score += 15;
  else if (latestApp.employment === 'Unemployed') score -= 50;

  // 2. Application History (Approvals boost score, Rejections hurt score)
  const approved = apps.filter(a => a.status === 'Approved').length;
  const rejected = apps.filter(a => a.status === 'Rejected').length;
  const pending = apps.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

  score += (approved * 45); // Positive payment history/approval
  score -= (rejected * 35); // Derogatory mark
  score -= (pending * 5);   // Hard inquiries slightly lower score temporarily

  // 3. Debt-to-Income Request Check (If they ask for too much compared to income, slight penalty)
  const totalRequested = apps.reduce((sum, app) => sum + parseInt(String(app.amount).replace(/\D/g, '') || '0'), 0);
  if (monthlyIncome > 0 && totalRequested > (monthlyIncome * 24)) {
    score -= 40; // Asking for > 2 years of income
  }

  // Cap the score between standard bounds
  if (score > 900) score = 900;
  if (score < 300) score = 300;

  return score;
};

export const getApplications = () => {
  initGlobalData();
  return JSON.parse(localStorage.getItem('credscore_applications'));
};

export const saveApplications = (applications) => {
  localStorage.setItem('credscore_applications', JSON.stringify(applications));
};

export const getRecentApplications = (limit = 5) => {
  const apps = getApplications();
  return apps.slice(0, limit);
};

export const getNotifications = () => {
  initGlobalData();
  return JSON.parse(localStorage.getItem('credscore_notifications') || '[]');
};

export const saveNotifications = (notifs) => {
  localStorage.setItem('credscore_notifications', JSON.stringify(notifs));
};

export const addNotification = (targetRole, targetUserId, title, desc, type = 'info') => {
  const notifs = getNotifications();
  const newNotif = {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    targetRole, // 'Admin' or 'User'
    targetUserId, // 'ALL' or specific user id
    title,
    desc,
    type, // 'info', 'success', 'warning', 'error'
    time: new Date().toISOString(),
    read: false
  };
  notifs.unshift(newNotif);
  saveNotifications(notifs);
};
