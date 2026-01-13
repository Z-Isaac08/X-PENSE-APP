import { FileDown } from "lucide-react";
import { useState } from "react";
import { KPICardsContainer } from "../components/dashboard/cards/KPICardsContainer";
import DateRangeFilter, { type DateRange } from "../components/dashboard/filters/DateRangeFilter";
import BudgetEvolutionChart from "../components/dashboard/graphics/BudgetEvolutionChart";
import CategorySpendingChart from "../components/dashboard/graphics/CategorySpendingChart";
import MonthlyTrendsChart from "../components/dashboard/graphics/MonthlyTrendsChart";
import { generateMonthlyReport } from "../components/pdf/generateMonthlyReport";
import { useExpenseStore } from "../stores/expenseStore";
import { useIncomeStore } from "../stores/incomeStore";

import SEO from "../components/SEO";

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

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

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
        
        <button
          onClick={() => {
            generateMonthlyReport(expenses, incomes);
          }}
          className="flex items-center gap-2 bg-[#3170dd] hover:bg-[#225a89] transition-all cursor-pointer text-white px-4 py-2 rounded shadow"
        >
          <FileDown size={18} />
          Télécharger le rapport du mois
        </button>
      </div>

      <DateRangeFilter
        currentRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />
      
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
