import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { generatePadUsageData } from '../../data/padUsageData';
import '../Dashboard.css';

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value">{payload[0].value.toLocaleString()} pads</p>
    </div>
  );
}

export function PadUsageChart() {
  const data = useMemo(() => generatePadUsageData(), []);

  const peak = useMemo(() => {
    return data.reduce((max, d) => (d.pads > max.pads ? d : max), data[0]);
  }, [data]);

  return (
    <section className="chart-card chart-card-glow animate-in" style={{ marginBottom: 24 }}>
      <div className="chart-card-header">
        <h2 className="chart-card-title">Pad Usage Over Time</h2>
        <p className="chart-card-subtitle">Last 30 days</p>
      </div>
      <div className="chart-peak-label">
        <span className="peak-dot" />
        Peak: {peak.pads} pads · {peak.label}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="padGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(236,72,153,0.15)" />
              <stop offset="100%" stopColor="rgba(236,72,153,0)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="pads"
            stroke="none"
            fill="url(#padGradient)"
            isAnimationActive
            animationDuration={1200}
          />
          <Line
            type="monotone"
            dataKey="pads"
            stroke="#ec4899"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive
            animationDuration={1200}
          />
          <ReferenceDot
            x={peak.label}
            y={peak.pads}
            r={6}
            fill="#ec4899"
            stroke="#fff"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}
