import { create } from 'zustand';
import { getCurrentMonth, getMonthLabel, getPreviousMonth } from '../utils';
import { useBudgetStore, type BudgetInterface } from './budgetStore';
import { useExpenseStore } from './expenseStore';
import { useIncomeStore } from './incomeStore';

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
  getDailyExpenses: () => { day: number; amount: number }[];
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
    return [...budgets].sort((a, b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5);
  },

  getTopExpensesCategories: () => {
    const expenses = useExpenseStore.getState().expenses;
    const budgets = useBudgetStore.getState().budgets;

    const categoryMap: Record<string, number> = {};
    expenses.forEach(exp => {
      categoryMap[exp.budget] = (categoryMap[exp.budget] || 0) + exp.amount;
    });

    return Object.entries(categoryMap)
      .map(([budgetId, total]) => {
        const budget = budgets.find(b => b.id === budgetId);
        return {
          budget: budget ? budget.name : 'Inconnu',
          total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  },

  getBudgetUsage: budgetId => {
    const budgets = useBudgetStore.getState().budgets;
    const expenses = useExpenseStore.getState().expenses;
    const incomes = useIncomeStore.getState().incomes;

    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return { spent: 0, remaining: 0, percentage: 0 };

    // Logique spéciale pour les budgets ÉPARGNE
    if (budget.type === 'savings') {
      const totalIncomes = incomes
        .filter(inc => inc.budget === budget.id)
        .reduce((sum, inc) => sum + inc.amount, 0);

      const totalExpenses = expenses
        .filter(exp => exp.budget === budget.id)
        .reduce((sum, exp) => sum + exp.amount, 0);

      const currentSaved = totalIncomes - totalExpenses; // Ce qu'on a réellement mis de côté
      const goal = budget.amount || 0;

      // Pour l'épargne :
      // "spent" = Montant épargné (pour réutiliser l'affichage existant)
      // "remaining" = Reste à épargner pour atteindre l'objectif
      const percentage = goal === 0 ? 0 : (currentSaved / goal) * 100;

      return {
        spent: currentSaved,
        remaining: Math.max(0, goal - currentSaved),
        percentage: Math.min(100, percentage),
      };
    }

    const spent = expenses
      .filter(exp => exp.budget === budget.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    // Pour les catégories de suivi, pas de notion de remaining/percentage
    if (budget.type === 'tracking') {
      return { spent, remaining: 0, percentage: 0 };
    }

    const remaining = (budget.amount || 0) - spent;
    const percentage = (budget.amount || 0) === 0 ? 0 : (spent / (budget.amount || 0)) * 100;

    return { spent, remaining, percentage: Math.min(100, percentage) };
  },

  getMonthlyReport: () => {
    const expenses = useExpenseStore.getState().expenses;
    const incomes = useIncomeStore.getState().incomes;

    const reportMap: Record<string, { totalExpenses: number; totalIncomes: number }> = {};

    expenses.forEach(exp => {
      const month = getMonthLabel(exp.date);
      reportMap[month] = reportMap[month] || {
        totalExpenses: 0,
        totalIncomes: 0,
      };
      reportMap[month].totalExpenses += exp.amount;
    });

    incomes.forEach(inc => {
      const month = getMonthLabel(inc.date);

      reportMap[month] = reportMap[month] || {
        totalExpenses: 0,
        totalIncomes: 0,
      };
      reportMap[month].totalIncomes += inc.amount;
    });

    return Object.entries(reportMap).map(([month, { totalExpenses, totalIncomes }]) => ({
      month,
      totalExpenses,
      totalIncomes,
    }));
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
    expenses.forEach(exp => {
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

    budgets.forEach(budget => {
      // Compter seulement les budgets plafonnés pour le taux d'utilisation
      if (budget.type === 'capped' && budget.amount) {
        totalBudget += budget.amount;
        const budgetExpenses = expenses
          .filter(exp => exp.budget === budget.id)
          .reduce((sum, exp) => sum + exp.amount, 0);
        totalSpent += budgetExpenses;
      }
    });

    if (totalBudget === 0) return 0;
    return (totalSpent / totalBudget) * 100;
  },

  getExpenseGrowthRate: (): number => {
    const current = useDashboardStore.getState().getCurrentMonthData();
    const previous = useDashboardStore.getState().getPreviousMonthData();

    if (previous.expenses === 0) return current.expenses > 0 ? 100 : 0;
    return ((current.expenses - previous.expenses) / previous.expenses) * 100;
  },

  getCurrentMonthData: () => {
    const { month, year } = getCurrentMonth();
    const expenses = useExpenseStore.getState().expenses;
    const incomes = useIncomeStore.getState().incomes;

    const currentMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const currentMonthIncomes = incomes.filter(i => {
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

    const previousMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const previousMonthIncomes = incomes.filter(i => {
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
    const current = useDashboardStore.getState().getCurrentMonthData();
    const previous = useDashboardStore.getState().getPreviousMonthData();

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

  getDailyExpenses: () => {
    const { month, year } = getCurrentMonth();
    const expenses = useExpenseStore.getState().expenses;
    const now = new Date();
    const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;

    // If it's the current month, we stop at today. Otherwise (past months), we show the full month.
    const daysLimit = isCurrentMonth ? now.getDate() : new Date(year, month + 1, 0).getDate();

    // Initialize array with days up to the limit
    const dailyData = Array.from({ length: daysLimit }, (_, i) => ({
      day: i + 1,
      amount: 0,
    }));

    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      if (expDate.getMonth() === month && expDate.getFullYear() === year) {
        const day = expDate.getDate();
        // Only add if the day is within our displayed range
        if (day <= daysLimit && dailyData[day - 1]) {
          dailyData[day - 1].amount += exp.amount;
        }
      }
    });

    return dailyData;
  },
}));
