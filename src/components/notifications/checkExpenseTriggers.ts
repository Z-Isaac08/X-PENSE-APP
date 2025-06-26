import { useBudgetStore } from "../../stores/budgetStore";
import { useExpenseStore } from "../../stores/expenseStore";
import { useIncomeStore } from "../../stores/incomeStore";
import { useNotificationStore } from "../../stores/notificationStore";

export const checkExpenseTriggers = async (
  userId: string,
  budgetId: string
) => {
  const { getBudgetById } = useBudgetStore.getState();
  const { getExpenseBudget } = useExpenseStore.getState();
  const { getIncomeBudget } = useIncomeStore.getState();
  const { addNotifications } = useNotificationStore.getState();

  const budget = getBudgetById(budgetId);
  if (!budget) return;

  const spent = getExpenseBudget(budgetId);
  const added = getIncomeBudget(budgetId);
  const total = budget.amount + added;
  const usage = (spent / total) * 100;

  if (usage >= 80) {
    await addNotifications(userId, {
      message: `Le budget ${budget.name} a été utilisé à ${Math.round(
        usage
      )} %.`,
      type: "alert",
      date: new Date().toISOString(),
      read: false,
    });
  }

  if (spent > total) {
    const dépassement = spent - total;
    await addNotifications(userId, {
      message: `Le budget ${
        budget.name
      } a été dépassé de ${dépassement.toLocaleString()} FCFA.`,
      type: "alert",
      date: new Date().toISOString(),
      read: false,
    });
  }

  if (spent > 50000) {
    await addNotifications(userId, {
      message: `Dépense élevée : ${spent.toLocaleString()} FCFA pour ${
        budget.name
      }.`,
      type: "expense",
      date: new Date().toISOString(),
      read: false,
    });
  }
};
