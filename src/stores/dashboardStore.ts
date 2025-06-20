import { create } from "zustand";
import { getMonth } from "../utils";
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
}

export const useDashboardStore = create<DashboardStore>(() => ({
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
      const month = getMonth(exp.date);
      reportMap[month] = reportMap[month] || {
        totalExpenses: 0,
        totalIncomes: 0,
      };
      reportMap[month].totalExpenses += exp.amount;
    });

    incomes.forEach((inc) => {
      const month = getMonth(inc.date);

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
}));
