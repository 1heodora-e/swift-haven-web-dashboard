import { useMemo, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import '../Dashboard.css';

const PADS_PER_GIRL_TERM = 24;
const AVG_GIRLS_PER_SCHOOL = 280;

export function InvestmentSlider() {
  const { schools } = useDashboard();
  const [targetSchools, setTargetSchools] = useState(Math.max(schools.length, 10));

  const metrics = useMemo(() => {
    const girls = targetSchools * AVG_GIRLS_PER_SCHOOL;
    const pads = girls * PADS_PER_GIRL_TERM;
    const daysSupported = Math.round(girls * 4.5);
    return { girls, pads, daysSupported };
  }, [targetSchools]);

  return (
    <section className="chart-card investment-card animate-in" data-tour="investment">
      <div className="chart-card-header">
        <h2 className="chart-card-title font-serif">Scale the impact</h2>
        <p className="chart-card-subtitle">
          Projected reach if Swift Haven expands across more Kigali schools
        </p>
      </div>
      <div className="investment-slider-wrap">
        <label htmlFor="school-scale">
          Partner schools: <strong>{targetSchools}</strong>
        </label>
        <input
          id="school-scale"
          type="range"
          min={3}
          max={25}
          value={targetSchools}
          onChange={(e) => setTargetSchools(Number(e.target.value))}
          className="investment-range"
        />
        <div className="investment-labels">
          <span>3 (today)</span>
          <span>25 schools</span>
        </div>
      </div>
      <div className="investment-results">
        <div className="investment-stat">
          <span className="investment-value">{metrics.girls.toLocaleString()}</span>
          <span className="investment-label">girls reached per term</span>
        </div>
        <div className="investment-stat">
          <span className="investment-value">{metrics.pads.toLocaleString()}</span>
          <span className="investment-label">pads dispensed per term</span>
        </div>
        <div className="investment-stat">
          <span className="investment-value">{metrics.daysSupported.toLocaleString()}</span>
          <span className="investment-label">estimated days of dignity supported*</span>
        </div>
      </div>
      <p className="investment-footnote">
        *Illustrative projection based on current pilot averages. Not a financial guarantee.
      </p>
    </section>
  );
}
