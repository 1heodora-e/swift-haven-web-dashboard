import { useEffect, useState } from 'react';
import { Users, Heart, Building2, TrendingUp, ArrowUp } from 'lucide-react';
import '../Dashboard.css';

const INITIAL_PADS = 3847;

export function StatCards() {
  const [padsDispensed, setPadsDispensed] = useState(INITIAL_PADS);

  useEffect(() => {
    const interval = setInterval(() => {
      setPadsDispensed((n) => n + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stats-row">
      <article className="stat-card stat-card-girls animate-in">
        <div className="stat-card-icon-wrap stat-icon-girls">
          <Users />
        </div>
        <div className="stat-card-label">Total Girls Reached</div>
        <div className="stat-card-value stat-value-girls">1,247</div>
        <div className="stat-card-subtitle">Across 3 active schools</div>
        <div className="stat-card-trend">
          <ArrowUp />
          <span>+12% this term</span>
        </div>
      </article>

      <article className="stat-card stat-card-hero animate-in" style={{ animationDelay: '50ms' }}>
        <div className="stat-card-icon-wrap stat-icon-hero">
          <Heart />
        </div>
        <div className="stat-card-label">Pads Dispensed This Term</div>
        <div className="stat-card-value">{padsDispensed.toLocaleString()}</div>
        <div className="stat-card-subtitle stat-subtitle-hero">Live counter</div>
        <div className="stat-card-live stat-live-hero">
          <span className="live-dot live-dot-white" aria-hidden />
          <span>Live</span>
        </div>
      </article>

      <article className="stat-card stat-card-schools animate-in" style={{ animationDelay: '100ms' }}>
        <div className="stat-card-icon-wrap stat-icon-schools">
          <Building2 />
        </div>
        <div className="stat-card-label">Active Schools</div>
        <div className="stat-card-value stat-value-schools">3</div>
        <div className="stat-card-subtitle">Kigali, Rwanda</div>
        <div className="stat-card-trend stat-trend-schools">
          <ArrowUp />
          <span>+1 this quarter</span>
        </div>
      </article>

      <article className="stat-card stat-card-attendance animate-in" style={{ animationDelay: '150ms' }}>
        <div className="stat-card-icon-wrap stat-icon-attendance">
          <TrendingUp />
        </div>
        <div className="stat-card-label">Average Attendance Rate</div>
        <div className="stat-card-value stat-value-attendance">94%</div>
        <div className="stat-card-subtitle">During menstrual cycle</div>
        <div className="stat-card-trend">
          <ArrowUp />
          <span>+8% vs last term</span>
        </div>
      </article>
    </div>
  );
}
