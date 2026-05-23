import { RefreshCw } from 'lucide-react';

interface RestockIconProps {
  size?: number;
  className?: string;
}

/** Shared restock / refill icon across the dashboard */
export function RestockIcon({ size = 16, className }: RestockIconProps) {
  return <RefreshCw size={size} className={className} aria-hidden />;
}
