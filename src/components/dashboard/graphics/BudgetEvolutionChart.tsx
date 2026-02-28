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
import { getMonthLabel, formatCurrency } from "../../../utils";

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
      ...exp.map((e) => getMonthLabel(e.date)),
      ...inc.map((i) => getMonthLabel(i.date)),
    ];
    const uniqueMonths = Array.from(new Set(allDates)).sort();

    const data = uniqueMonths.map((month) => {
      const totalExp = exp
        .filter((e) => getMonthLabel(e.date) === month)
        .reduce((sum, e) => sum + e.amount, 0);
      const totalInc = inc
        .filter((i) => getMonthLabel(i.date) === month)
        .reduce((sum, i) => sum + i.amount, 0);
      console.log({ mois: month, dépenses: totalExp, revenus: totalInc });
      return { mois: month, dépenses: totalExp, revenus: totalInc };
    });

    setChartData(data);
  }, [selectedBudgetId, expenses, incomes]);

  // if (budgets.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === "dépenses" ? "Dépenses" : "Revenus"}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mt-12">
      <div className="rounded-2xl shadow p-4 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Évolution par budget</h2>
        <div className="mb-4">
          <select
            className="border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white dark:border-neutral-600 focus:ring-2 focus:ring-[#3170dd] focus:border-transparent"
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

        {!selectedBudgetId ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-gray-400 mb-2">📈</div>
            <p className="text-gray-500 font-medium">Sélectionnez un budget</p>
            <p className="text-gray-400 text-sm">
              Choisissez un budget pour voir son évolution dans le temps
            </p>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <XAxis 
                dataKey="mois" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#9ca3af' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#9ca3af' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="dépenses"
                stroke="#e33131"
                strokeWidth={3}
                dot={{ fill: '#e33131', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#e33131', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="revenus"
                stroke="#31c48d"
                strokeWidth={3}
                dot={{ fill: '#31c48d', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#31c48d', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-gray-400 mb-2">📊</div>
            <p className="text-gray-500 font-medium">Aucune donnée pour ce budget</p>
            <p className="text-gray-400 text-sm">
              Ajoutez des transactions à ce budget pour voir son évolution
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetEvolutionChart;
