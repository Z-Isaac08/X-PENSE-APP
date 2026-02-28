import { FileDown } from 'lucide-react';
import { useState } from 'react';
import { KPICardsContainer } from '../components/dashboard/cards/KPICardsContainer';
import CategorySpendingChart from '../components/dashboard/graphics/CategorySpendingChart';
import DailySpendingChart from '../components/dashboard/graphics/DailySpendingChart';
import MonthlyTrendsChart from '../components/dashboard/graphics/MonthlyTrendsChart';
import { generateMonthlyReport } from '../components/pdf/generateMonthlyReport';
import { useExpenseStore } from '../stores/expenseStore';
import { useIncomeStore } from '../stores/incomeStore';

import SEO from '../components/SEO';

const DashboardPage = () => {
  const { incomes } = useIncomeStore();
  const { expenses } = useExpenseStore();
  const now = new Date();

  // State for PDF report month selection
  const [selectedPdfMonth, setSelectedPdfMonth] = useState<number>(now.getMonth());
  const [selectedPdfYear, setSelectedPdfYear] = useState<number>(now.getFullYear());

  // Generate list of available months (last 12 months + current)
  const getAvailableMonths = () => {
    const months = [];
    for (let i = 0; i <= 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.getMonth(),
        year: date.getFullYear(),
        label: date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }),
      });
    }
    return months;
  };

  const availableMonths = getAvailableMonths();

  return (
    <main className="min-h-screen px-6 py-8 text-[#1f1f1f] dark:text-neutral-100 md:px-16 transition-colors duration-500">
      <SEO
        title="Analyses - Xpense"
        description="Analysez vos habitudes de dépenses, l'évolution de votre budget et vos tendances mensuelles."
      />
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          Tableau de <span className="text-[#3170dd]">bord</span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">
          {/* Month selector */}
          <select
            value={`${selectedPdfYear}-${selectedPdfMonth}`}
            onChange={e => {
              const [year, month] = e.target.value.split('-');
              setSelectedPdfYear(Number(year));
              setSelectedPdfMonth(Number(month));
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#3170dd] appearance-none cursor-pointer transition-all"
          >
            {availableMonths.map(({ month, year, label }) => (
              <option key={`${year}-${month}`} value={`${year}-${month}`}>
                {label}
              </option>
            ))}
          </select>

          {/* Download button */}
          <button
            onClick={() => {
              generateMonthlyReport(expenses, incomes, selectedPdfMonth, selectedPdfYear);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3170dd] hover:bg-[#225a89] transition-all cursor-pointer text-white px-6 py-2.5 rounded-xl shadow-sm whitespace-nowrap font-medium"
          >
            <FileDown size={20} />
            Télécharger le rapport
          </button>
        </div>
      </div>

      <KPICardsContainer />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
          <MonthlyTrendsChart />
        </div>
        <div className="w-full bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
          <CategorySpendingChart />
        </div>
      </div>

      <div className="mt-8 w-full bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
        <DailySpendingChart />
      </div>
    </main>
  );
};

export default DashboardPage;
