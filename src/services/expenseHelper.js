import { db, deleteDoc, addDoc, getDocs, collection, doc, getDoc } from '../../firebase'


//ajouter une dépense
const addExpense = async (userId, expense) => {
    try {
        const ExpensesRef = collection(db, 'users', userId, 'expenses');
        const ExpenseRef = await addDoc(ExpensesRef, expense);
        return ExpenseRef.id;
    } catch (error) {
        console.error('Error adding expense:', error);
        throw new Error('Could not add expense');
    }
};


// Obtenir toutes les dépenses
const getAllExpenses = async (userId) => {
    try {
        const ExpensesRef = collection(db, 'users', userId, 'expenses');
        const ExpensesSnapshot = await getDocs(ExpensesRef);
        const Expenses = ExpensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return Expenses;
    } catch (error) {
        console.error('Erreur lors de la récupération des Expenses:', error);
        throw new Error('Erreur lors de la récupération des Expenses');
    }
};

const getExpensesByBudget = async (userId, budgetId) => {
    try {
        const budgetRef = doc(db, 'users', userId, 'budgets', budgetId);
        const budgetDoc = await getDoc(budgetRef);

        if (!budgetDoc.exists()) {
            throw new Error('Budget not found');
        }

        const budgetData = budgetDoc.data();
        const budgetName = budgetData.name;

        const expensesRef = collection(db, 'users', userId, 'expenses');
        const expensesSnapshot = await getDocs(expensesRef);
        let expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        expenses = expenses.filter(expense => expense.budget === budgetName);
        return expenses;
    } catch (error) {
        console.error('Erreur lors de la récupération des dépenses:', error);
        throw new Error('Erreur lors de la récupération des dépenses');
    }
};

const getExpenseBudget = async (userId, budgetId) => {
    try {
        const budgetRef = doc(db, 'users', userId, 'budgets', budgetId);
        const budgetDoc = await getDoc(budgetRef);

        if (!budgetDoc.exists()) {
            throw new Error('Budget not found');
        }

        const budgetData = budgetDoc.data();
        const budgetName = budgetData.name;

        const expensesRef = collection(db, 'users', userId, 'expenses');
        const expensesSnapshot = await getDocs(expensesRef);
        let expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const spent = expenses.reduce((acc, expense) => {
            if (expense.budget !== budgetName) return acc;
            return acc + parseFloat(expense.amount);
        }, 0);

        return spent;
    } catch (error) {
        console.error('Erreur lors de la récupération des dépenses:', error);
        throw new Error('Erreur lors de la récupération des dépenses');
    }
};

//Supprimer toutes les dépenses
const deleteAllExpenses = async (userId) => {
    try {
        const ExpensesRef = collection(db, 'users', userId, 'expenses');
        const ExpensesSnapshot = await getDocs(ExpensesRef);
        const batch = batch(db);
        ExpensesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log('Tous les Expenses ont été supprimés');
    } catch (error) {
        console.error('Erreur lors de la suppression des Expenses:', error);
        throw error;
    }
};

//Supprimer une dépense
const deleteExpense = async (userId, expenseId) => {
    try {
        const ExpenseRef = doc(db, 'users', userId, 'expenses', expenseId);
        await deleteDoc(ExpenseRef);
        console.log('Expense supprimé avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression du Expense:', error);
        throw error;
    }
};

// Fonction pour récupérer les dépenses d'un budget spécifique
const getBudgetExpenses = async (userId) => {
    try {
        const budgetRef = collection(db, 'users', userId, 'budgets');
        const budgetSnapshot = await getDocs(budgetRef);
        const budgets = budgetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const expenseRef = collection(db, 'users', userId, 'expenses');
        const expenseSnapshot = await getDocs(expenseRef);
        const expenses = expenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        let budgetExpenses = budgets.map(budget => {
            const spent = expenses.reduce((acc, expense) => {
                if (expense.budget !== budget.name) return acc;
                return acc + expense.amount;
            }, 0);
            return { ...budget, spent };
        });
        return budgetExpenses;
    } catch (error) {
        console.error('Erreur lors de la récupération des dépenses:', error);
        return [];
    }
};

// Fonction pour formater une date
function formatDate(timestamp) {
    const date = new Date(timestamp);

    // Obtenir les composants de la date
    const day = String(date.getDate()).padStart(2, '0'); // Obtenir le jour et ajouter un zéro devant si nécessaire
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtenir le mois (0-indexé) et ajouter un zéro devant si nécessaire
    const year = date.getFullYear(); // Obtenir l'année

    // Retourner la date formatée
    return `${day}-${month}-${year}`;
}


export { addExpense, getAllExpenses, deleteAllExpenses, deleteExpense, getBudgetExpenses, formatDate, getExpensesByBudget, getExpenseBudget };