import { useState } from 'react';
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
    <div className="dashboard">
      <Sidebar />
      <Header />
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
