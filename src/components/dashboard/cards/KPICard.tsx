// KPICard.tsx
import { Info, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

interface KPICardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  change?: number;
  showTrend?: boolean;
  description?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  value,
  label,
  icon,
  change,
  showTrend = false,
  description,
}) => {
  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} />;
    if (change < 0) return <TrendingDown size={16} />;
    return null;
  };

  return (
    <div className="relative flex items-center gap-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-md hover:shadow-lg transition">
      <div className="text-[#3170dd] text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">{value}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">{label}</p>
          {description && (
            <div className="group relative">
              <Info
                size={14}
                className="text-gray-400 cursor-help hover:text-[#3170dd] transition-colors"
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                {description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>

        {showTrend && change !== undefined && (
          <div className={`flex items-center gap-1 text-xs mt-1 ${getTrendColor(change)}`}>
            {getTrendIcon(change)}
            <span>
              {change > 0 ? '+' : ''}
              {change.toFixed(1)}%
            </span>
            <span className="text-gray-400">vs mois précédent</span>
          </div>
        )}
      </div>
    </div>
  );
};
