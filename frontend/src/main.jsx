import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ====================================================
// Centralized Backend Synchronization Interceptor
// ====================================================
const BACKEND_URL = 'http://127.0.0.1:5000';
const SYNC_KEYS = ['credscore_users', 'credscore_applications', 'credscore_notifications'];
let isSyncing = false;

// Override localStorage.setItem to automatically upload local changes to the database
const originalSetItem = localStorage.setItem;
localStorage.setItem = function (key, value) {
  originalSetItem.apply(this, arguments);

  if (!isSyncing && SYNC_KEYS.includes(key)) {
    const endpoint = key.replace('credscore_', '');
    fetch(`${BACKEND_URL}/api/sync/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: JSON.parse(value) })
    })
    .then(res => {
      if (!res.ok) console.error(`Failed to sync key ${key} to backend`);
    })
    .catch(err => console.error(`Sync error for key ${key}:`, err));
  }
};

// Function to pull latest state from backend master database
const pullMasterState = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/sync/pull`);
    if (res.ok) {
      const data = await res.json();
      isSyncing = true;
      
      // Compare and overwrite if changed to avoid unnecessary storage events
      if (data.users) {
        const localUsers = localStorage.getItem('credscore_users');
        const remoteUsersStr = JSON.stringify(data.users);
        if (localUsers !== remoteUsersStr) {
          originalSetItem.call(localStorage, 'credscore_users', remoteUsersStr);
        }
      }
      
      if (data.applications) {
        const localApps = localStorage.getItem('credscore_applications');
        const remoteAppsStr = JSON.stringify(data.applications);
        if (localApps !== remoteAppsStr) {
          originalSetItem.call(localStorage, 'credscore_applications', remoteAppsStr);
        }
      }
      
      if (data.notifications) {
        const localNotifs = localStorage.getItem('credscore_notifications');
        const remoteNotifsStr = JSON.stringify(data.notifications);
        if (localNotifs !== remoteNotifsStr) {
          originalSetItem.call(localStorage, 'credscore_notifications', remoteNotifsStr);
        }
      }
      
      isSyncing = false;
      
      // Dispatch storage event to alert React components of data updates
      window.dispatchEvent(new Event('storage'));
    }
  } catch (err) {
    console.error('Failed to pull master state from backend database:', err);
  }
};

// Run initial sync and configure background polling every 5 seconds for real-time collaboration
pullMasterState().then(() => {
  setInterval(pullMasterState, 5000);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
