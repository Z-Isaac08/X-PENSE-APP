// KPICard.tsx
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

interface KPICardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  change?: number;
  showTrend?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({ 
  value, 
  label, 
  icon, 
  change, 
  showTrend = false 
}) => {
  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-gray-500";
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} />;
    if (change < 0) return <TrendingDown size={16} />;
    return null;
  };

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-md hover:shadow-lg transition">
      <div className="text-[#3170dd] text-2xl">{icon}</div>
      <div className="flex-1">
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {showTrend && change !== undefined && (
          <div className={`flex items-center gap-1 text-xs mt-1 ${getTrendColor(change)}`}>
            {getTrendIcon(change)}
            <span>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-gray-400">vs mois précédent</span>
          </div>
        )}
      </div>
    </div>
  );
};
