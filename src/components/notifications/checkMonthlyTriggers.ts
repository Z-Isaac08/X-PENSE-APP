import { useExpenseStore } from "../../stores/expenseStore";
import { useIncomeStore } from "../../stores/incomeStore";
import { useNotificationStore } from "../../stores/notificationStore";

export const checkMonthlyTriggers = async (userId: string) => {
  const { expenses } = useExpenseStore.getState();
  const { incomes } = useIncomeStore.getState();
  const { addNotifications } = useNotificationStore.getState();

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const day = now.getDate();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  // Filtrage des données du mois courant
  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  const currentMonthIncomes = incomes.filter((i) => {
    const d = new Date(i.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const totalExpenses = currentMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalIncomes = currentMonthIncomes.reduce(
    (sum, i) => sum + i.amount,
    0
  );

  // Résumé mensuel intermédiaire (le 15)
  if (day === 15) {
    const midSummary = `Résumé intermédiaire de ${now.toLocaleString("fr-FR", {
      month: "long",
    })} : ${totalExpenses.toLocaleString()} FCFA de dépenses, ${totalIncomes.toLocaleString()} FCFA de revenus.`;

    await addNotifications(userId, {
      message: midSummary,
      type: "alert",
      date: now.toISOString(),
      read: false,
    });
  }

  // Résumé mensuel final (dernier jour du mois)
  if (day === lastDayOfMonth) {
    const finalSummary = `Résumé final de ${now.toLocaleString("fr-FR", {
      month: "long",
    })} : ${totalExpenses.toLocaleString()} FCFA de dépenses, ${totalIncomes.toLocaleString()} FCFA de revenus.`;

    await addNotifications(userId, {
      message: finalSummary,
      type: "alert",
      date: now.toISOString(),
      read: false,
    });
  }

  // Catégorie dominante
  const categories: Record<string, number> = {};
  currentMonthExpenses.forEach((e) => {
    categories[e.name] = (categories[e.name] || 0) + e.amount;
  });
  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

  if (day === 20 && topCategory) {
    const categoryMessage = `Vous avez principalement dépensé dans ${topCategory[0]} ce mois-ci.`;
    await addNotifications(userId, {
      message: categoryMessage,
      type: "expense",
      date: now.toISOString(),
      read: false,
    });
  }

  // Rappel le 1er du mois si aucun revenu encore
  if (day === 1 && totalIncomes === 0) {
    const reminderMessage = `N’oubliez pas d’ajouter vos revenus mensuels pour ${now.toLocaleString(
      "fr-FR",
      { month: "long" }
    )}.`;
    await addNotifications(userId, {
      message: reminderMessage,
      type: "income",
      date: now.toISOString(),
      read: false,
    });
  }
  
  // Rappel le 1er du mois si aucune dépense encore
  if (day === 1 && totalExpenses === 0) {
    const reminderMessage = `N’oubliez pas d’ajouter vos dépenses tout au long du mois de ${now.toLocaleString(
      "fr-FR",
      { month: "long" }
    )}.`;
    await addNotifications(userId, {
      message: reminderMessage,
      type: "expense",
      date: now.toISOString(),
      read: false,
    });
  }
  // Rappel le 15 du mois si aucune transaction (dépense + revenu)
  if (day === 15 && totalIncomes === 0 && totalExpenses === 0) {
    const midMonthReminder = `Aucune activité détectée ce mois-ci. N’oubliez pas de saisir vos revenus ou dépenses.`;
      await addNotifications(userId, {
        message: midMonthReminder,
        type: "alert",
        date: now.toISOString(),
        read: false,
      });
  }
};
