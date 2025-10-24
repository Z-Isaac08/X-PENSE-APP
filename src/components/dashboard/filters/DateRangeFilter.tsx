import { Calendar } from "lucide-react";
import React, { useState } from "react";

interface DateRangeFilterProps {
  onDateRangeChange: (range: DateRange) => void;
  currentRange: DateRange;
}

export interface DateRange {
  startDate: string;
  endDate: string;
  preset?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateRangeChange,
  currentRange,
}) => {
  const [showCustom, setShowCustom] = useState(false);

  const presets = [
    { label: "Ce mois", value: "current_month" },
    { label: "Mois dernier", value: "last_month" },
    { label: "3 derniers mois", value: "last_3_months" },
    { label: "6 derniers mois", value: "last_6_months" },
    { label: "Cette année", value: "current_year" },
    { label: "Personnalisé", value: "custom" },
  ];

  const getDateRange = (preset: string): DateRange => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    switch (preset) {
      case "current_month":
        return {
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0],
          preset,
        };
      case "last_month":
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          startDate: lastMonthStart.toISOString().split('T')[0],
          endDate: lastMonthEnd.toISOString().split('T')[0],
          preset,
        };
      case "last_3_months":
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        return {
          startDate: threeMonthsAgo.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0],
          preset,
        };
      case "last_6_months":
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        return {
          startDate: sixMonthsAgo.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0],
          preset,
        };
      case "current_year":
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        return {
          startDate: startOfYear.toISOString().split('T')[0],
          endDate: endOfYear.toISOString().split('T')[0],
          preset,
        };
      default:
        return currentRange;
    }
  };

  const handlePresetChange = (preset: string) => {
    if (preset === "custom") {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      const newRange = getDateRange(preset);
      onDateRangeChange(newRange);
    }
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newRange = {
      ...currentRange,
      [field]: value,
      preset: 'custom',
    };
    onDateRangeChange(newRange);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} className="text-[#3170dd]" />
        <h3 className="text-lg font-semibold">Période d'analyse</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetChange(preset.value)}
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
              currentRange.preset === preset.value
                ? "bg-[#3170dd] text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {(showCustom || currentRange.preset === 'custom') && (
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Du
            </label>
            <input
              type="date"
              value={currentRange.startDate}
              onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
              className="border rounded px-3 py-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-[#3170dd] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Au
            </label>
            <input
              type="date"
              value={currentRange.endDate}
              onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
              className="border rounded px-3 py-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-[#3170dd] focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;