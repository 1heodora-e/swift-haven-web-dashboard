import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="content-header">
      <div className="content-header-text">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
