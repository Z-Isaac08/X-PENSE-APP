import { useEffect } from "react";
import { KPICardsContainer } from "../components/dashboard/cards/KPICardsContainer";
import BudgetEvolutionChart from "../components/dashboard/graphics/BudgetEvolutionChart";
import CategorySpendingChart from "../components/dashboard/graphics/CategorySpendingChart";
import MonthlyTrendsChart from "../components/dashboard/graphics/MonthlyTrendsChart";
import { checkMonthlyTriggers } from "../components/notifications/checkMonthlyTriggers";
import { useBudgetStore } from "../stores/budgetStore";
import { useExpenseStore } from "../stores/expenseStore";
import { useIncomeStore } from "../stores/incomeStore";
import { useUserStore } from "../stores/userStore";

const DashboardPage = () => {
  const { getAllExpenses } = useExpenseStore();
  const { getAllIncomes } = useIncomeStore();
  const { getAllBudgets } = useBudgetStore();
  const { user } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllBudgets(user!.id);
        await getAllExpenses(user!.id);
        await getAllIncomes(user!.id);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchData();
  }, [getAllBudgets, getAllExpenses, getAllIncomes, user]);

  useEffect(() => {
    const runMonthlyCheck = async () => {
      if (user) {
        await checkMonthlyTriggers(user.id);
      }
    };
    runMonthlyCheck();
  }, [user]);

  return (
    <main className="min-h-screen px-6 py-8 text-[#1f1f1f] dark:text-neutral-100 md:px-16 transition-colors duration-500">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">
        Tableau de <span className="text-[#3170dd]">bord</span>
      </h1>
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
