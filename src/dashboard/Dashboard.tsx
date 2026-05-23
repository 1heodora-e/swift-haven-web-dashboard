import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AlertBanner } from './components/AlertBanner';
import { ToastStack } from './components/shared/ToastStack';
import { DashboardModals } from './components/DashboardModals';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { OverviewPage } from './pages/OverviewPage';
import { SchoolsPage } from './pages/SchoolsPage';
import { ReportsPage } from './pages/ReportsPage';
import { InventoryPage } from './pages/InventoryPage';
import { SettingsPage } from './pages/SettingsPage';
import type { PageId } from './types';
import './Dashboard.css';
import './cozy-theme.css';
import './editorial-theme.css';

function DashboardShell() {
  const { activePage, toasts } = useDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [activePage]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1400px)');
    const onChange = () => {
      if (!mq.matches) setSidebarOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'schools':
        return <SchoolsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className={`dashboard${sidebarOpen ? ' sidebar-open' : ''}`}>
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar onNavigate={() => setSidebarOpen(false)} />
      <Header
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen((open) => !open)}
      />
      <main className="dashboard-main">
        <div className="dashboard-content">
          <AlertBanner />
          <div key={activePage} className="page-content page-fade">
            {renderPage()}
          </div>
        </div>
      </main>
      <ToastStack toasts={toasts} />
      <DashboardModals />
    </div>
  );
}

export function Dashboard() {
  const [activePage, setActivePage] = useState<PageId>('overview');

  return (
    <DashboardProvider activePage={activePage} setActivePage={setActivePage}>
      <DashboardShell />
    </DashboardProvider>
  );
}
