import { FileDown } from 'lucide-react';
import { useState } from 'react';
import { KPICardsContainer } from '../components/dashboard/cards/KPICardsContainer';
import DateRangeFilter, { type DateRange } from '../components/dashboard/filters/DateRangeFilter';
import BudgetEvolutionChart from '../components/dashboard/graphics/BudgetEvolutionChart';
import CategorySpendingChart from '../components/dashboard/graphics/CategorySpendingChart';
import MonthlyTrendsChart from '../components/dashboard/graphics/MonthlyTrendsChart';
import { generateMonthlyReport } from '../components/pdf/generateMonthlyReport';
import { useExpenseStore } from '../stores/expenseStore';
import { useIncomeStore } from '../stores/incomeStore';

import SEO from '../components/SEO';

const DashboardPage = () => {
  const { incomes } = useIncomeStore();
  const { expenses } = useExpenseStore();
  const now = new Date();

  // Initialize with current month
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
      preset: 'current_month',
    };
  });

  // State for PDF report month selection
  const [selectedPdfMonth, setSelectedPdfMonth] = useState<number>(now.getMonth());
  const [selectedPdfYear, setSelectedPdfYear] = useState<number>(now.getFullYear());

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

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
  const selectedMonthLabel = new Date(selectedPdfYear, selectedPdfMonth, 1).toLocaleString(
    'fr-FR',
    { month: 'long', year: 'numeric' }
  );

  return (
    <main className="min-h-screen px-6 py-8 text-[#1f1f1f] dark:text-neutral-100 md:px-16 transition-colors duration-500">
      <SEO
        title="Analyses - Xpense"
        description="Analysez vos habitudes de dépenses, l'évolution de votre budget et vos tendances mensuelles."
      />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-0">
          Tableau de <span className="text-[#3170dd]">bord</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          {/* Month selector */}
          <select
            value={`${selectedPdfYear}-${selectedPdfMonth}`}
            onChange={e => {
              const [year, month] = e.target.value.split('-');
              setSelectedPdfYear(Number(year));
              setSelectedPdfMonth(Number(month));
            }}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#1f1f1f] dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#3170dd]"
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
            className="flex items-center gap-2 bg-[#3170dd] hover:bg-[#225a89] transition-all cursor-pointer text-white px-4 py-2 rounded shadow whitespace-nowrap"
          >
            <FileDown size={18} />
            Télécharger{' '}
            {selectedMonthLabel ===
            new Date(now.getFullYear(), now.getMonth(), 1).toLocaleString('fr-FR', {
              month: 'long',
              year: 'numeric',
            })
              ? 'le rapport du mois'
              : selectedMonthLabel}
          </button>
        </div>
      </div>

      <DateRangeFilter currentRange={dateRange} onDateRangeChange={handleDateRangeChange} />

      <KPICardsContainer />
      <div className="mt-8 flex md:flex-row flex-col gap-4 items-center">
        <MonthlyTrendsChart />
        <CategorySpendingChart />
      </div>
      <BudgetEvolutionChart />
    </main>
  );
};

export default DashboardPage;
