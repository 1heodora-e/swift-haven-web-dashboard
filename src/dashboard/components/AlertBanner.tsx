import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { RestockIcon } from './shared/RestockIcon';
import { useDashboard } from '../context/DashboardContext';
import '../Dashboard.css';

export function AlertBanner() {
  const [visible, setVisible] = useState(true);
  const { requestRestockForSchool } = useDashboard();

  if (!visible) return null;

  return (
    <div className="alert-banner" role="alert" data-tour="alert">
      <button
        type="button"
        className="alert-dismiss"
        aria-label="Dismiss alert"
        onClick={() => setVisible(false)}
      >
        <X size={18} />
      </button>
      <AlertTriangle className="alert-icon" aria-hidden />
      <div className="alert-banner-body">
        <p className="alert-banner-text">
          <strong>Gentle reminder:</strong> St. Josephine School is running low on pad stock —
          restock recommended within 3 days.
        </p>
        <button
          type="button"
          className="btn-soft btn-alert-action"
          onClick={() => requestRestockForSchool('St. Josephine Secondary School')}
        >
          <RestockIcon size={16} />
          Restock now
        </button>
      </div>
    </div>
  );
}
