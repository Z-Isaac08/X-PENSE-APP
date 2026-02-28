import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import React, { useState } from 'react';

interface NotificationFiltersProps {
  activeFilter: {
    type?: string;
    read?: boolean;
  };
  onFilterChange: (filter: { type?: string; read?: boolean }) => void;
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
  const [isExpanded, setIsExpanded] = useState(false);

  const typeFilters = [
    {
      value: 'all',
      label: 'Toutes',
      icon: <Filter size={16} />,
      count: stats.total,
    },
    {
      value: 'alert',
      label: 'Alertes',
      icon: <AlertCircle size={16} className="text-red-500" />,
      count: stats.byType.alert || 0,
    },
    {
      value: 'expense',
      label: 'Dépenses',
      icon: <TrendingDown size={16} className="text-orange-500" />,
      count: stats.byType.expense || 0,
    },
    {
      value: 'income',
      label: 'Revenus',
      icon: <TrendingUp size={16} className="text-green-500" />,
      count: stats.byType.income || 0,
    },
    {
      value: 'budget',
      label: 'Budget',
      icon: <Wallet size={16} className="text-blue-500" />,
      count: stats.byType.budget || 0,
    },
  ];

  const readStatusFilters = [
    { value: undefined, label: 'Toutes', count: stats.total },
    { value: false, label: 'Non lues', count: stats.unread },
    { value: true, label: 'Lues', count: stats.total - stats.unread },
  ];

  const handleTypeFilter = (type: string) => {
    const newFilter = { ...activeFilter };
    if (type === 'all') {
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

  const hasActiveFilters = activeFilter.type || activeFilter.read !== undefined;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-6">
      <div
        className="flex items-center justify-between cursor-pointer md:cursor-default"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter size={20} className="text-[#3170dd]" />
          Filtres {hasActiveFilters && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
        </h3>
        <button className="md:hidden text-gray-500">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div className={`${isExpanded ? 'block' : 'hidden'} md:block mt-4`}>
        {/* Type filters */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type de notification
          </h4>
          <div className="flex flex-wrap gap-2">
            {typeFilters.map(filter => (
              <button
                key={filter.value}
                onClick={() => handleTypeFilter(filter.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeFilter.type === filter.value ||
                  (filter.value === 'all' && !activeFilter.type)
                    ? 'bg-[#3170dd] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
        <div>
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
                    ? 'bg-[#3170dd] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
      </div>
    </div>
  );
};

export default NotificationFilters;
