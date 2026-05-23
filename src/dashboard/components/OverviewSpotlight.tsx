import { Heart, Shield, Sparkles } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import '../Dashboard.css';

export function OverviewSpotlight() {
  const { schools } = useDashboard();
  const schoolCount = schools.length;

  return (
    <aside className="overview-spotlight" aria-label="Swift Haven impact highlights">
      <span className="overview-spotlight-mark" aria-hidden>
        &ldquo;
      </span>
      <p className="overview-spotlight-eyebrow">Swift Haven Africa</p>
      <h2 className="overview-spotlight-title font-serif">Dignity, delivered daily</h2>
      <p className="overview-spotlight-lead">
        Smart pad dispensers in Kigali schools so girls never miss class for lack of
        supplies.
      </p>
      <ul className="overview-spotlight-list">
        <li>
          <span className="overview-spotlight-icon" aria-hidden>
            <Heart size={16} />
          </span>
          <span>
            <strong>{schoolCount} live schools</strong>
            <span className="overview-spotlight-detail">Connected in Kigali</span>
          </span>
        </li>
        <li>
          <span className="overview-spotlight-icon" aria-hidden>
            <Shield size={16} />
          </span>
          <span>
            <strong>24/7 monitoring</strong>
            <span className="overview-spotlight-detail">Stock &amp; dispenser alerts</span>
          </span>
        </li>
        <li>
          <span className="overview-spotlight-icon" aria-hidden>
            <Sparkles size={16} />
          </span>
          <span>
            <strong>Pitch-ready reports</strong>
            <span className="overview-spotlight-detail">PDF impact in one click</span>
          </span>
        </li>
      </ul>
      <p className="overview-spotlight-foot">Restoring Women&apos;s Dignity</p>
    </aside>
  );
}
