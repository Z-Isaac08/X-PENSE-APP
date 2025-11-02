import { Filter, AlertCircle, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React from "react";

interface NotificationFiltersProps {
  activeFilter: {
    type?: string;
    read?: boolean;
    priority?: string;
  };
  onFilterChange: (filter: { type?: string; read?: boolean; priority?: string }) => void;
  stats: {
    total: number;
    unread: number;
    byType: Record<string, number>;
  };
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  onFilterChange,
  stats,
}) => {
  const typeFilters = [
    {
      value: "all",
      label: "Toutes",
      icon: <Filter size={16} />,
      count: stats.total,
    },
    {
      value: "alert",
      label: "Alertes",
      icon: <AlertCircle size={16} className="text-red-500" />,
      count: stats.byType.alert || 0,
    },
    {
      value: "expense",
      label: "Dépenses",
      icon: <TrendingDown size={16} className="text-orange-500" />,
      count: stats.byType.expense || 0,
    },
    {
      value: "income",
      label: "Revenus",
      icon: <TrendingUp size={16} className="text-green-500" />,
      count: stats.byType.income || 0,
    },
    {
      value: "budget",
      label: "Budget",
      icon: <Wallet size={16} className="text-blue-500" />,
      count: stats.byType.budget || 0,
    },
  ];

  const readStatusFilters = [
    { value: undefined, label: "Toutes", count: stats.total },
    { value: false, label: "Non lues", count: stats.unread },
    { value: true, label: "Lues", count: stats.total - stats.unread },
  ];

  const priorityFilters = [
    { value: "all", label: "Toutes priorités" },
    { value: "critical", label: "Critique", color: "text-red-600" },
    { value: "important", label: "Important", color: "text-orange-600" },
    { value: "normal", label: "Normal", color: "text-gray-600" },
  ];

  const handleTypeFilter = (type: string) => {
    const newFilter = { ...activeFilter };
    if (type === "all") {
      delete newFilter.type;
    } else {
      newFilter.type = type;
    }
    onFilterChange(newFilter);
  };

  const handleReadFilter = (read: boolean | undefined) => {
    const newFilter = { ...activeFilter };
    if (read === undefined) {
      delete newFilter.read;
    } else {
      newFilter.read = read;
    }
    onFilterChange(newFilter);
  };

  const handlePriorityFilter = (priority: string) => {
    const newFilter = { ...activeFilter };
    if (priority === "all") {
      delete newFilter.priority;
    } else {
      newFilter.priority = priority;
    }
    onFilterChange(newFilter);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Filter size={20} className="text-[#3170dd]" />
        Filtres
      </h3>

      {/* Type filters */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type de notification
        </h4>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleTypeFilter(filter.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                (activeFilter.type === filter.value || 
                 (filter.value === "all" && !activeFilter.type))
                  ? "bg-[#3170dd] text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
              <span className="bg-gray-200 dark:bg-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Read status filters */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Statut de lecture
        </h4>
        <div className="flex flex-wrap gap-2">
          {readStatusFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleReadFilter(filter.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                activeFilter.read === filter.value
                  ? "bg-[#3170dd] text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <span>{filter.label}</span>
              <span className="bg-gray-200 dark:bg-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Priority filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Priorité
        </h4>
        <div className="flex flex-wrap gap-2">
          {priorityFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handlePriorityFilter(filter.value)}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                (activeFilter.priority === filter.value || 
                 (filter.value === "all" && !activeFilter.priority))
                  ? "bg-[#3170dd] text-white"
                  : `bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${filter.color || "text-gray-700 dark:text-gray-300"}`
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;