/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { formatCurrency } from '../../../utils';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
        <p className="font-semibold">{data.budget}</p>
        <p className="text-sm">Montant: {formatCurrency(data.total)}</p>
        <p className="text-sm text-gray-500">
          {((data.total / payload[0].payload.totalSum) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const CategorySpendingChart = () => {
  const { getTopExpensesCategories } = useDashboardStore();
  const topExpenses = getTopExpensesCategories();

  // Add total sum for percentage calculation
  const totalSum = topExpenses.reduce((sum: number, item: any) => sum + item.total, 0);
  const dataWithTotal = topExpenses.map((item: any) => ({ ...item, totalSum }));

  return (
    <div className="w-full h-full">
      <h2 className="text-xl font-semibold mb-6">Répartition des dépenses</h2>
      {topExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-400 mb-2">🥧</div>
          <p className="text-gray-500 font-medium">Aucune dépense enregistrée</p>
          <p className="text-gray-400 text-sm">
            Ajoutez des dépenses pour voir la répartition par catégorie
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataWithTotal}
              dataKey="total"
              nameKey="budget"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              label={({ budget, total, totalSum }) =>
                `${budget}: ${((total / totalSum) * 100).toFixed(1)}%`
              }
              labelLine={false}
            >
              {dataWithTotal.map((_entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategorySpendingChart;
