import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
} from "../firebase";

//ajouter un budget
const addBudget = async (userId, budget) => {
  try {
    const budgetsRef = collection(db, "users", userId, "budgets");
    const budgetRef = await addDoc(budgetsRef, budget);
    return budgetRef.id;
  } catch (error) {
    console.error("Error adding budget:", error);
    throw new Error("Could not add budget");
  }
};

// Obtenir tous les budgets
const getAllBudgets = async (userId) => {
  try {
    const budgetsRef = collection(db, "users", userId, "budgets");
    const budgetsSnapshot = await getDocs(budgetsRef);
    const budgets = budgetsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return budgets;
  } catch (error) {
    console.error("Erreur lors de la récupération des budgets:", error);
    throw new Error("Erreur lors de la récupération des budgets");
  }
};

const getBudgetsbyID = async (userId, id) => {
  try {
    const budgetsRef = collection(db, "users", userId, "budgets");
    const budgetsSnapshot = await getDocs(budgetsRef);
    const budgets = budgetsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    for (const budget of budgets) {
      if (budget.id === id) {
        return budget;
      }
    }

    return null; // Si aucun budget avec l'ID donné n'est trouvé
  } catch (error) {
    console.error("Erreur lors de la récupération des budgets:", error);
    throw new Error("Erreur lors de la récupération des budgets");
  }
};

//vérifier qu'un budget est unique
const verifyBudgetName = async (userId) => {
  try {
    const budgetsRef = collection(db, "users", userId, "budgets");
    const budgetsSnapshot = await getDocs(budgetsRef);
    const budgets = budgetsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    let names = [];
    budgets.forEach((budget) => names.push(budget.name));
    return names;
  } catch (error) {
    console.error("Erreur lors de la récupération des budgets:", error);
    throw new Error("Erreur lors de la récupération des budgets");
  }
};

//Supprimer tous les budgets
const deleteAllBudgets = async (userId) => {
  try {
    const budgetsRef = collection(db, "users", userId, "budgets");
    const budgetsSnapshot = await getDocs(budgetsRef);
    const batch = batch(db);
    budgetsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error("Erreur lors de la suppression des budgets:", error);
    throw error;
  }
};

//Supprimer un budget
const deleteBudget = async (userId, budgetId) => {
  try {
    const budgetRef = doc(db, "users", userId, "budgets", budgetId);
    await deleteDoc(budgetRef);
  } catch (error) {
    console.error("Erreur lors de la suppression du budget:", error);
    throw error;
  }
};

export {
  addBudget,
  deleteAllBudgets,
  deleteBudget,
  getAllBudgets,
  getBudgetsbyID,
  verifyBudgetName,
};
