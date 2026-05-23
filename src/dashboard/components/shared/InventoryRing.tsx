interface InventoryRingProps {
  percent: number;
  variant?: 'pink' | 'amber' | 'red';
  size?: number;
}

const strokeColors = {
  pink: '#ec4899',
  amber: '#d97706',
  red: '#dc2626',
};

export function InventoryRing({ percent, variant = 'pink', size = 100 }: InventoryRingProps) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = strokeColors[variant];

  return (
    <div className="inventory-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="inventory-ring-value" style={{ color }}>
        {percent}%
      </span>
    </div>
  );
}
