import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BrandedTitle } from './shared/BrandedTitle';
import '../Dashboard.css';

const sessionData = [
  { session: 'Session 1', girls: 23 },
  { session: 'Session 2', girls: 28 },
  { session: 'Session 3', girls: 31 },
  { session: 'Session 4', girls: 29 },
  { session: 'Session 5', girls: 34 },
  { session: 'Session 6', girls: 37 },
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-value">{payload[0].value} girls attended</p>
    </div>
  );
}

export function HavenCirclesChart() {
  return (
    <section className="chart-card chart-card-radial animate-in">
      <div className="chart-card-header">
        <BrandedTitle text="Haven Circles Engagement" />
        <p className="chart-card-subtitle">This term at Mother Mary School</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={sessionData} margin={{ top: 28, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="session"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(253,242,248,0.6)' }} />
          <Bar
            dataKey="girls"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
            isAnimationActive
            animationDuration={1000}
          >
            <LabelList dataKey="girls" position="top" fill="#ec4899" fontSize={12} fontWeight={700} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
