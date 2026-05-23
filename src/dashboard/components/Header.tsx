import { Bell } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import '../Dashboard.css';

export function Header() {
  const { openModal, setActivePage, showToast, lastSynced } = useDashboard();

  const syncedLabel = lastSynced.toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <header className="dashboard-header">
      <div className="header-brand">
        <span className="header-brand-dot" aria-hidden />
        <span className="header-brand-title gradient-text font-serif">Haven Dashboard</span>
      </div>
      <div className="header-actions">
        <span className="header-sync">Synced {syncedLabel}</span>
        <button
          type="button"
          className="header-bell"
          aria-label="Notifications"
          onClick={() => openModal({ type: 'notifications' })}
        >
          <Bell size={20} />
          <span className="header-bell-dot" aria-hidden />
        </button>
        <button
          type="button"
          className="header-user"
          onClick={() => {
            setActivePage('settings');
            showToast('Here are your account settings', 'info');
          }}
        >
          <div className="header-avatar" aria-hidden>
            PO
          </div>
          <span className="header-user-label">NGO Programme Officer</span>
        </button>
      </div>
    </header>
  );
}
