import {
  LayoutDashboard,
  Building2,
  FileText,
  Package,
  Settings,
} from 'lucide-react';
import type { PageId } from '../types';
import { useDashboard } from '../context/DashboardContext';
import { PitchTourPanel } from './PitchTour';
import '../Dashboard.css';

const navItems: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'schools', label: 'Schools', icon: Building2 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { activePage, setActivePage } = useDashboard();

  const goTo = (id: PageId) => {
    setActivePage(id);
    onNavigate?.();
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-title gradient-text">Swift Haven</div>
        <div className="sidebar-logo-tagline">Restoring Womens Dignity</div>
      </div>
      <div className="sidebar-divider" aria-hidden />
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              type="button"
              className={`sidebar-nav-item${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => goTo(id)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-tour-slot">
        <PitchTourPanel />
      </div>
      <div className="sidebar-glow" aria-hidden />
    </aside>
  );
}
