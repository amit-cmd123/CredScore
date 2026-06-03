// Global API Base URL
const API_URL = 'http://localhost:5000/api';

// ============================================
// Core Database API Fetchers
// ============================================

export const fetchUsers = async () => {
  // Not used typically unless admin, but keeping for compatibility
  // (In a real app, admins fetch this from an /api/users endpoint)
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) return [];
  return res.json();
};

export const fetchUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
};

export const fetchApplications = async (userId = null) => {
  const url = userId ? `${API_URL}/applications?userId=${userId}` : `${API_URL}/applications`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
};

export const submitApplication = async (data) => {
  const res = await fetch(`${API_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit application');
  return res.json();
};

export const updateApplicationStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update application');
  return res.json();
};

export const fetchNotifications = async (role, userId) => {
  const res = await fetch(`${API_URL}/notifications?role=${role}&userId=${userId}`);
  if (!res.ok) return [];
  return res.json();
};

export const createNotification = async (targetRole, targetUserId, title, desc, type = 'info') => {
  const notif = {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    targetRole,
    targetUserId,
    title,
    desc,
    type,
    read: false,
    time: new Date().toISOString()
  };
  
  await fetch(`${API_URL}/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notif)
  });
};

export const updateNotificationReadStatus = async (id) => {
  await fetch(`${API_URL}/notifications/${id}/read`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
};

// Async version of calculate user credit score
export const fetchUserCreditScore = async (userId) => {
  const apps = await fetchApplications(userId);
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

// ============================================
// LEGACY SHIMS 
// (For components not yet migrated to async)
// ============================================
let _cachedApps = [];
let _cachedNotifs = [];
let _cachedUsers = [];

// Pre-load data so synchronous components don't immediately crash during refactor
export const initCache = async () => {
  try {
    const appsRes = await fetch(`${API_URL}/applications`);
    if (appsRes.ok) _cachedApps = await appsRes.json();
    
    // We can't fetch all notifs easily without user context, so we just return empty
  } catch (e) {
    console.warn("Failed to load cache", e);
  }
}

export const getApplications = () => _cachedApps;
export const getRecentApplications = (limit = 5) => _cachedApps.slice(0, limit);
export const getNotifications = () => _cachedNotifs;
export const saveNotifications = () => {};
export const getUsers = () => _cachedUsers;
export const saveUsers = () => {};
export const saveApplications = () => {};
export const addNotification = createNotification;
export const calculateUserCreditScore = () => 'Loading...'; // Legacy shim
