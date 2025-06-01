import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardStore } from "../../../stores/dashboardStore";

const MonthlyTrendsChart = () => {
  const { getMonthlyReport } = useDashboardStore();
  const monthlyReport = getMonthlyReport();

  return (
    <div className="rounded-2xl shadow p-4 md:w-1/2 w-full text-[#1f1f1f] dark:text-neutral-100">
      <h2 className="text-xl font-semibold mb-4">Tendances mensuelles</h2>
      {monthlyReport.length === 0 ? (
        <p className="text-gray-500">
          Aucune donnée disponible pour le moment.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyReport} barCategoryGap={30}>
            {" "}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="totalExpenses"
              name="Dépenses"
              fill="#ef4444"
              barSize={12} // Mince
              radius={[6, 6, 0, 0]} // Arrondi en haut
            />
            <Bar
              dataKey="totalIncomes"
              name="Revenus"
              fill="#22c55e"
              barSize={12} // Mince
              radius={[6, 6, 0, 0]} // Arrondi en haut
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyTrendsChart;
