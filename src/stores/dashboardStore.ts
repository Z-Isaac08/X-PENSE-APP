import { create } from "zustand";
import { getMonthLabel, getCurrentMonth, getPreviousMonth } from "../utils";
import { useBudgetStore, type BudgetInterface } from "./budgetStore";
import { useExpenseStore } from "./expenseStore";
import { useIncomeStore } from "./incomeStore";

export interface DashboardStore {
  getTotalExpenses: () => number;
  getTotalIncomes: () => number;
  getBalance: () => number;
  getTopBudgets: () => BudgetInterface[];
  getTopExpensesCategories: () => { budget: string; total: number }[];
  getBudgetUsage: (budgetId: string) => {
    spent: number;
    remaining: number;
    percentage: number;
  };
  getMonthlyReport: () => {
    month: string;
    totalExpenses: number;
    totalIncomes: number;
  }[];
  getTotalTransactions: () => number;
  // New KPIs
  getSavingsRate: () => number;
  getMonthlyAverageSpending: () => number;
  getBudgetUtilizationRate: () => number;
  getExpenseGrowthRate: () => number;
  getCurrentMonthData: () => {
    expenses: number;
    incomes: number;
    balance: number;
    transactions: number;
  };
  getPreviousMonthData: () => {
    expenses: number;
    incomes: number;
    balance: number;
    transactions: number;
  };
  getMonthlyComparison: () => {
    expenses: { current: number; previous: number; change: number };
    incomes: { current: number; previous: number; change: number };
    balance: { current: number; previous: number; change: number };
  };
}

export const useDashboardStore = create<DashboardStore>((get, set) => ({
  getTotalExpenses: () => {
    const expenses = useExpenseStore.getState().expenses;
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  },

  getTotalIncomes: () => {
    const incomes = useIncomeStore.getState().incomes;
    return incomes.reduce((sum, inc) => sum + inc.amount, 0);
  },

  getBalance: () => {
    const incomes = useIncomeStore.getState().incomes;
    const expenses = useExpenseStore.getState().expenses;
    const totalIncomes = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return totalIncomes - totalExpenses;
  },

  getTopBudgets: () => {
    const budgets = useBudgetStore.getState().budgets;
    return [...budgets].sort((a, b) => b.amount - a.amount).slice(0, 5);
  },

  getTopExpensesCategories: () => {
    const expenses = useExpenseStore.getState().expenses;
    const budgets = useBudgetStore.getState().budgets;

    const categoryMap: Record<string, number> = {};
    expenses.forEach((exp) => {
      categoryMap[exp.budget] = (categoryMap[exp.budget] || 0) + exp.amount;
    });

    return Object.entries(categoryMap)
      .map(([budgetId, total]) => {
        const budget = budgets.find((b) => b.id === budgetId);
        return {
          budget: budget ? budget.name : "Inconnu",
          total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  },

  getBudgetUsage: (budgetId) => {
    const budgets = useBudgetStore.getState().budgets;
    const expenses = useExpenseStore.getState().expenses;

    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) return { spent: 0, remaining: 0, percentage: 0 };

    const spent = expenses
      .filter((exp) => exp.budget === budget.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    const remaining = budget.amount - spent;
    const percentage = budget.amount === 0 ? 0 : (spent / budget.amount) * 100;

    return { spent, remaining, percentage: Math.min(100, percentage) };
  },

  getMonthlyReport: () => {
    const expenses = useExpenseStore.getState().expenses;
    const incomes = useIncomeStore.getState().incomes;

    const reportMap: Record<
      string,
      { totalExpenses: number; totalIncomes: number }
    > = {};

    expenses.forEach((exp) => {
      const month = getMonthLabel(exp.date);
      reportMap[month] = reportMap[month] || {
        totalExpenses: 0,
        totalIncomes: 0,
      };
      reportMap[month].totalExpenses += exp.amount;
    });

    incomes.forEach((inc) => {
      const month = getMonthLabel(inc.date);

      reportMap[month] = reportMap[month] || {
        totalExpenses: 0,
        totalIncomes: 0,
      };
      reportMap[month].totalIncomes += inc.amount;
    });

    return Object.entries(reportMap).map(
      ([month, { totalExpenses, totalIncomes }]) => ({
        month,
        totalExpenses,
        totalIncomes,
      })
    );
  },

  getTotalTransactions: () => {
    const expenses = useExpenseStore.getState().expenses;
    const incomes = useIncomeStore.getState().incomes;
    return expenses.length + incomes.length;
  },

  // New KPI implementations
  getSavingsRate: () => {
    const incomes = useIncomeStore.getState().incomes;
    const expenses = useExpenseStore.getState().expenses;
    const totalIncomes = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    if (totalIncomes === 0) return 0;
    return ((totalIncomes - totalExpenses) / totalIncomes) * 100;
  },

  getMonthlyAverageSpending: () => {
    const expenses = useExpenseStore.getState().expenses;
    if (expenses.length === 0) return 0;

    const monthlyTotals: Record<string, number> = {};
    expenses.forEach((exp) => {
      const monthKey = getMonthLabel(exp.date);
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + exp.amount;
    });

    const months = Object.keys(monthlyTotals);
    if (months.length === 0) return 0;

    const totalSpending = Object.values(monthlyTotals).reduce((sum, amount) => sum + amount, 0);
    return totalSpending / months.length;
  },

  getBudgetUtilizationRate: () => {
    const budgets = useBudgetStore.getState().budgets;
    const expenses = useExpenseStore.getState().expenses;
    
    if (budgets.length === 0) return 0;

    let totalBudget = 0;
    let totalSpent = 0;

    budgets.forEach((budget) => {
      totalBudget += budget.amount;
      const budgetExpenses = expenses
        .filter((exp) => exp.budget === budget.id)
        .reduce((sum, exp) => sum + exp.amount, 0);
      totalSpent += budgetExpenses;
    });

    if (totalBudget === 0) return 0;
    return (totalSpent / totalBudget) * 100;
  },

  getExpenseGrowthRate: (): number => {
    const store = get();
    const current = store.getCurrentMonthData();
    const previous = store.getPreviousMonthData();
    
    if (previous.expenses === 0) return current.expenses > 0 ? 100 : 0;
    return ((current.expenses - previous.expenses) / previous.expenses) * 100;
  },

  getCurrentMonthData: () => {
    const { month, year } = getCurrentMonth();
    const expenses = useExpenseStore.getState().expenses;
    const incomes = useIncomeStore.getState().incomes;

    const currentMonthExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const currentMonthIncomes = incomes.filter((i) => {
      const d = new Date(i.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncomes = currentMonthIncomes.reduce((sum, i) => sum + i.amount, 0);

    return {
      expenses: totalExpenses,
      incomes: totalIncomes,
      balance: totalIncomes - totalExpenses,
      transactions: currentMonthExpenses.length + currentMonthIncomes.length,
    };
  },

  getPreviousMonthData: () => {
    const { month, year } = getPreviousMonth();
    const expenses = useExpenseStore.getState().expenses;
    const incomes = useIncomeStore.getState().incomes;

    const previousMonthExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const previousMonthIncomes = incomes.filter((i) => {
      const d = new Date(i.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const totalExpenses = previousMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncomes = previousMonthIncomes.reduce((sum, i) => sum + i.amount, 0);

    return {
      expenses: totalExpenses,
      incomes: totalIncomes,
      balance: totalIncomes - totalExpenses,
      transactions: previousMonthExpenses.length + previousMonthIncomes.length,
    };
  },

  getMonthlyComparison: (): {
    expenses: { current: number; previous: number; change: number };
    incomes: { current: number; previous: number; change: number };
    balance: { current: number; previous: number; change: number };
  } => {
    const store = get();
    const current = store.getCurrentMonthData();
    const previous = store.getPreviousMonthData();

    const calculateChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    return {
      expenses: {
        current: current.expenses,
        previous: previous.expenses,
        change: calculateChange(current.expenses, previous.expenses),
      },
      incomes: {
        current: current.incomes,
        previous: previous.incomes,
        change: calculateChange(current.incomes, previous.incomes),
      },
      balance: {
        current: current.balance,
        previous: previous.balance,
        change: calculateChange(current.balance, previous.balance),
      },
    };
  },
}));
