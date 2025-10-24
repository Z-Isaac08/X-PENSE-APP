import { create } from "zustand";
import { addDoc, collection, db, deleteDoc, doc, getDocs } from "../firebase";

export interface ExpenseInterface {
  id: string;
  name: string;
  amount: number;
  budget: string;
  date: string;
}

interface ExpenseStore {
  expenses: ExpenseInterface[];
  addExpense: (
    userId: string,
    expense: Omit<ExpenseInterface, "id">
  ) => Promise<void>;
  getAllExpenses: (userId: string) => Promise<void>;
  deleteExpense: (userId: string, expenseId: string) => Promise<void>;
  deleteAllExpenses: (userId: string) => Promise<void>;
  getExpensesByBudget: (budgetId: string | undefined) => ExpenseInterface[];
  getExpenseBudget: (budgetId: string | undefined) => number;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],

  addExpense: async (userId, expense) => {
    try {
      const expensesRef = collection(db, "users", userId, "expenses");
      const docRef = await addDoc(expensesRef, expense);

      set((state) => ({
        expenses: [...state.expenses, { ...expense, id: docRef.id }],
      }));
    } catch (error) {
      console.error("Error adding expense:", error);
      throw new Error("Could not add expense");
    }
  },

  getAllExpenses: async (userId) => {
    try {
      const expensesSnapshot = await getDocs(
        collection(db, "users", userId, "expenses")
      );
      const expenses = expensesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as ExpenseInterface)
      );
      set({ expenses });
    } catch (error) {
      console.error("Erreur lors du chargement des dépenses:", error);
    }
  },

  deleteExpense: async (userId, expenseId) => {
    try {
      const expenseRef = doc(db, "users", userId, "expenses", expenseId);
      await deleteDoc(expenseRef);

      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== expenseId),
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      throw error;
    }
  },

  deleteAllExpenses: async (userId) => {
    try {
      const expensesSnapshot = await getDocs(
        collection(db, "users", userId, "expenses")
      );
      const batchPromises = expensesSnapshot.docs.map((docItem) =>
        deleteDoc(doc(db, "users", userId, "expenses", docItem.id))
      );

      await Promise.all(batchPromises);
      set({ expenses: [] });
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de toutes les dépenses:",
        error
      );
      throw new Error("Erreur lors de la suppression de toutes les dépenses");
    }
  },

  getExpensesByBudget: (budgetId) => {
    if (!budgetId) return [];
    return get().expenses.filter((expense) => expense.budget === budgetId);
  },

  getExpenseBudget: (budgetId) => {
    if (!budgetId) return 0;
    const filteredExpenses = get().expenses.filter(
      (expense) => expense.budget === budgetId
    );
    return filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  },
}));
