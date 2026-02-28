import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { formatCurrency } from '../../../utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MonthlyTrendsChart = () => {
  const { getMonthlyReport } = useDashboardStore();
  const monthlyReport = getMonthlyReport();

  return (
    <div className="w-full h-full">
      <h2 className="text-xl font-semibold mb-6">Tendances mensuelles</h2>
      {monthlyReport.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-500 font-medium">Aucune donnée disponible</p>
          <p className="text-gray-400 text-sm">
            Ajoutez des transactions pour voir vos tendances mensuelles
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyReport} barCategoryGap={30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={{ stroke: '#9ca3af' }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#9ca3af' }}
              tickFormatter={value => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="totalExpenses"
              name="Dépenses"
              fill="#ef4444"
              barSize={12}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="totalIncomes"
              name="Revenus"
              fill="#22c55e"
              barSize={12}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyTrendsChart;
