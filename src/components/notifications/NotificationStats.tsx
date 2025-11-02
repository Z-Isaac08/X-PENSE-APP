import { Bell, Clock, Eye, EyeOff } from "lucide-react";
import React from "react";

interface NotificationStatsProps {
  stats: {
    total: number;
    unread: number;
    recent: number;
    byType: Record<string, number>;
  };
}

const NotificationStats: React.FC<NotificationStatsProps> = ({ stats }) => {
  const readPercentage = stats.total > 0 ? ((stats.total - stats.unread) / stats.total) * 100 : 0;

  const statCards = [
    {
      label: "Total notifications",
      value: stats.total,
      icon: <Bell size={20} />,
      color: "text-blue-600",
    },
    {
      label: "Non lues",
      value: stats.unread,
      icon: <EyeOff size={20} />,
      color: "text-red-600",
    },
    {
      label: "Dernières 24h",
      value: stats.recent,
      icon: <Clock size={20} />,
      color: "text-orange-600",
    },
    {
      label: "Taux de lecture",
      value: `${readPercentage.toFixed(1)}%`,
      icon: <Eye size={20} />,
      color: "text-green-600",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Statistiques des notifications</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"
          >
            <div className={`${stat.color} mb-2 flex justify-center`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar for read percentage */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progression de lecture</span>
          <span>{readPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${readPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Type breakdown */}
      {Object.keys(stats.byType).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Répartition par type
          </h4>
          <div className="space-y-2">
            {Object.entries(stats.byType).map(([type, count]) => {
              const percentage = (count / stats.total) * 100;
              const typeColors = {
                alert: "bg-red-500",
                expense: "bg-orange-500",
                income: "bg-green-500",
                budget: "bg-blue-500",
              };
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        typeColors[type as keyof typeof typeColors] || "bg-gray-500"
                      }`}
                    ></div>
                    <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                      {type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationStats;