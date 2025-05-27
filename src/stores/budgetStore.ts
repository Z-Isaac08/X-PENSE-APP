import { create } from "zustand";
import { addDoc, collection, db, deleteDoc, doc, getDocs } from "../firebase";

export interface BudgetInterface {
  id: string;
  name: string;
  amount: number;
}

interface BudgetStore {
  budgets: BudgetInterface[];
  addBudget: (
    userId: string,
    budget: Omit<BudgetInterface, "id">
  ) => Promise<void>;
  getAllBudgets: (userId: string) => Promise<void>;
  deleteBudget: (userId: string, budgetId: string) => Promise<void>;
  deleteAllBudgets: (userId: string) => Promise<void>;
  getBudgetById: (budgetId: string | undefined) => BudgetInterface | null;
  verifyBudgetName: () => string[];
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budgets: [],

  addBudget: async (userId, budget) => {
    try {
      const budgetsRef = collection(db, "users", userId, "budgets");
      const docRef = await addDoc(budgetsRef, {
        name: budget.name || "",
        amount: Number(budget.amount) || 0,
      });

      set((state) => ({
        budgets: [...state.budgets, { ...budget, id: docRef.id, amount: Number(budget.amount) || 0 }],
      }));
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      throw new Error("Erreur lors de l'ajout du budget");
    }
  },

  getAllBudgets: async (userId) => {
    try {
      const budgetsSnapshot = await getDocs(
        collection(db, "users", userId, "budgets")
      );
      const budgets = budgetsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          amount: Number(data.amount) || 0,
        };
      });
      set({ budgets });
    } catch (error) {
      console.error("Erreur lors du chargement des budgets:", error);
    }
  },

  deleteBudget: async (userId, budgetId) => {
    try {
      const docRef = doc(db, "users", userId, "budgets", budgetId);
      await deleteDoc(docRef);

      set((state) => ({
        budgets: state.budgets.filter((budget) => budget.id !== budgetId),
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
      throw error;
    }
  },

  deleteAllBudgets: async (userId) => {
    try {
      const budgetsSnapshot = await getDocs(
        collection(db, "users", userId, "budgets")
      );
      const batchPromises = budgetsSnapshot.docs.map((docItem) =>
        deleteDoc(doc(db, "users", userId, "budgets", docItem.id))
      );

      await Promise.all(batchPromises);

      set({ budgets: [] });
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les budgets:", error);
      throw new Error("Erreur lors de la suppression de tous les budgets");
    }
  },

  getBudgetById: (budgetId) => {
    const allBudgets = get().budgets;
    return allBudgets.find((budget) => budget.id === budgetId) || null;
  },

  verifyBudgetName: () => {
    const allBudgets = get().budgets;
    return allBudgets.map((budget) => budget.name);
  },
}));
