'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardWidgetProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function DashboardWidget({
  title,
  icon: Icon,
  children,
  action,
  className = '',
}: DashboardWidgetProps) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-50 flex items-center">
          {Icon && <Icon className="w-5 h-5 text-gold-400 mr-2" />}
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}
