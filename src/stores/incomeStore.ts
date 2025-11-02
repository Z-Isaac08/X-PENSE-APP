import { create } from "zustand";
import { addDoc, collection, db, deleteDoc, doc, getDocs } from "../firebase";

export interface IncomeInterface {
  id: string;
  name: string;
  amount: number;
  budget: string;
  date: string;
}

interface IncomeStore {
  incomes: IncomeInterface[];
  addIncome: (
    userId: string,
    income: Omit<IncomeInterface, "id">
  ) => Promise<void>;
  getAllIncomes: (userId: string) => Promise<void>;
  deleteIncome: (userId: string, incomeId: string) => Promise<void>;
  deleteAllIncomes: (userId: string) => Promise<void>;
  getIncomesByBudget: (budgetId: string | undefined) => IncomeInterface[];
  getIncomeBudget: (budgetId: string | undefined) => number;
}

export const useIncomeStore = create<IncomeStore>((set, get) => ({
  incomes: [],

  addIncome: async (userId, income) => {
    try {
      const incomesRef = collection(db, "users", userId, "incomes");
      const docRef = await addDoc(incomesRef, income);

      set((state) => ({
        incomes: [...state.incomes, { ...income, id: docRef.id }],
      }));
    } catch (error) {
      console.error("Error adding income:", error);
      throw new Error("Could not add income");
    }
  },

  getAllIncomes: async (userId) => {
    try {
      const incomesSnapshot = await getDocs(
        collection(db, "users", userId, "incomes")
      );
      const incomes = incomesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as IncomeInterface)
      );
      set({ incomes });
    } catch (error) {
      console.error("Erreur lors du chargement des revenus:", error);
    }
  },

  deleteIncome: async (userId, incomeId) => {
    try {
      const incomeRef = doc(db, "users", userId, "incomes", incomeId);
      await deleteDoc(incomeRef);

      set((state) => ({
        incomes: state.incomes.filter((income) => income.id !== incomeId),
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      throw error;
    }
  },

  deleteAllIncomes: async (userId) => {
    try {
      const incomesSnapshot = await getDocs(
        collection(db, "users", userId, "incomes")
      );
      const batchPromises = incomesSnapshot.docs.map((docItem) =>
        deleteDoc(doc(db, "users", userId, "incomes", docItem.id))
      );

      await Promise.all(batchPromises);
      set({ incomes: [] });
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de toutes les dépenses:",
        error
      );
      throw new Error("Erreur lors de la suppression de toutes les dépenses");
    }
  },

  getIncomesByBudget: (budgetId) => {
    if (!budgetId) return [];
    return get().incomes.filter((income) => income.budget === budgetId);
  },

  getIncomeBudget: (budgetId) => {
    if (!budgetId) return 0;
    const filteredIncomes = get().incomes.filter(
      (income) => income.budget === budgetId
    );
    return filteredIncomes.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  },
}));
