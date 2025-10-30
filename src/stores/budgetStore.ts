import { create } from "zustand";
import { addDoc, collection, db, deleteDoc, doc, getDocs, updateDoc } from "../firebase";

export type BudgetType = 'capped' | 'tracking';

export interface BudgetInterface {
  id: string;
  name: string;
  type: BudgetType;
  amount?: number; // Optionnel - requis seulement si type = 'capped'
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
      // Validation : si type = 'capped', amount doit être fourni
      if (budget.type === 'capped' && (budget.amount === undefined || budget.amount === null)) {
        throw new Error("Le montant est obligatoire pour un budget plafonné");
      }

      const budgetsRef = collection(db, "users", userId, "budgets");
      const budgetData: any = {
        name: budget.name || "",
        type: budget.type || 'capped',
      };

      // Ajouter amount seulement si défini
      if (budget.amount !== undefined && budget.amount !== null) {
        budgetData.amount = Number(budget.amount);
      }

      const docRef = await addDoc(budgetsRef, budgetData);

      set((state) => ({
        budgets: [...state.budgets, { ...budget, id: docRef.id }],
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
        
        // Migration automatique : si pas de type, considérer comme 'capped'
        const type: BudgetType = data.type || 'capped';
        
        return {
          id: doc.id,
          name: data.name || "",
          type: type,
          amount: data.amount !== undefined ? Number(data.amount) : undefined,
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
