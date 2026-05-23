import { Radio } from 'lucide-react';
import { useLiveActivity } from '../hooks/useLiveActivity';
import '../Dashboard.css';

export function LiveActivityFeed() {
  const events = useLiveActivity();

  return (
    <section className="chart-card live-activity-card animate-in" data-tour="activity">
      <div className="chart-card-header live-activity-header">
        <div>
          <h2 className="chart-card-title font-serif">Live dispenser activity</h2>
          <p className="chart-card-subtitle">Connected schools in Kigali · updates every few seconds</p>
        </div>
        <span className="live-pulse-badge">
          <span className="live-dot" aria-hidden />
          Live
        </span>
      </div>
      <ul className="activity-feed">
        {events.map((evt) => (
          <li key={evt.id} className={`activity-item activity-${evt.type}`}>
            <Radio size={14} className="activity-icon" aria-hidden />
            <div className="activity-body">
              <p>{evt.message}</p>
              <time>{evt.time}</time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
