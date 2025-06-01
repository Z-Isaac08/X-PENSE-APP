import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDashboardStore } from "../../../stores/dashboardStore";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

const CategorySpendingChart = () => {
  const { getTopExpensesCategories } = useDashboardStore();
  const topExpenses = getTopExpensesCategories();

  return (
    <div className="rounded-2xl shadow p-4 md:w-1/2 w-full text-[#1f1f1f] dark:text-neutral-100">
      <h2 className="text-xl font-semibold mb-4">Répartition des dépenses</h2>
      {topExpenses.length === 0 ? (
        <p className="text-gray-500">
          Aucune donnée disponible pour le moment.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topExpenses}
              dataKey="total"
              nameKey="budget"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              label
            >
              {topExpenses.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategorySpendingChart;
