import { Calendar } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { formatCurrency, getCurrentMonth } from '../../../utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
        <p className="font-semibold">
          {label} {new Date().toLocaleString('fr-FR', { month: 'long' })}
        </p>
        <p className="text-sm text-[#3170dd]">Dépensé : {formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const DailySpendingChart = () => {
  const { getDailyExpenses } = useDashboardStore();
  const dailyData = getDailyExpenses();
  const { month, year } = getCurrentMonth();

  const monthName = new Date(year, month, 1).toLocaleString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6">Évolution quotidienne ({monthName})</h2>

      {dailyData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-neutral-400 dark:text-neutral-500">
          <div className="mb-4">
            <Calendar size={48} strokeWidth={1.5} />
          </div>
          <p className="font-medium">Aucune donnée ce mois-ci</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#9ca3af' }}
              interval={2} // Show every 3rd day to avoid clutter
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#9ca3af' }}
              tickFormatter={value => `${(value / 1).toFixed(0)}`} // Show full numbers if small, or k if large? Let's stick to simple first
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3170dd"
              strokeWidth={3}
              dot={{ fill: '#3170dd', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3170dd', strokeWidth: 2 }}
              name="Dépenses"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DailySpendingChart;
