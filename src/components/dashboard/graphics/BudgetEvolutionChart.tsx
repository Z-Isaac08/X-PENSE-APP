import { useEffect, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useBudgetStore } from "../../../stores/budgetStore";
import { useExpenseStore } from "../../../stores/expenseStore";
import { useIncomeStore } from "../../../stores/incomeStore";
import { getMonth } from "../../../utils";

type dataInterface = {
  mois: string;
  dépenses: number;
  revenus: number;
};

const BudgetEvolutionChart = () => {
  const { budgets } = useBudgetStore();
  const { expenses } = useExpenseStore();
  const { incomes } = useIncomeStore();

  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<dataInterface[]>([]);

  useEffect(() => {
    if (!selectedBudgetId) return;

    const exp = expenses.filter((e) => e.budget === selectedBudgetId);
    const inc = incomes.filter((i) => i.budget === selectedBudgetId);

    const allDates = [
      ...exp.map((e) => getMonth(e.date)),
      ...inc.map((i) => getMonth(i.date)),
    ];
    const uniqueMonths = Array.from(new Set(allDates)).sort();

    const data = uniqueMonths.map((month) => {
      const totalExp = exp
        .filter((e) => getMonth(e.date) === month)
        .reduce((sum, e) => sum + e.amount, 0);
      const totalInc = inc
        .filter((i) => getMonth(i.date) === month)
        .reduce((sum, i) => sum + i.amount, 0);
      console.log({ mois: month, dépenses: totalExp, revenus: totalInc })
      return { mois: month, dépenses: totalExp, revenus: totalInc };
    });

    setChartData(data);
  }, [selectedBudgetId, expenses, incomes]);

  // if (budgets.length === 0) return null;

  return (
    <div className="w-full mt-12">
      <h2 className="text-xl font-semibold mb-4">Évolution par budget</h2>
      <div className="mb-4">
        <select
          className="border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white dark:border-neutral-600"
          value={selectedBudgetId || ""}
          onChange={(e) => setSelectedBudgetId(e.target.value)}
        >
          <option value="">Choisir un budget</option>
          {budgets.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="dépenses"
              stroke="#e33131"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="revenus"
              stroke="#31c48d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">
          Aucune donnée disponible pour ce budget.
        </p>
      )}
    </div>
  );
};

export default BudgetEvolutionChart;
