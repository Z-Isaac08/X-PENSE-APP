import { type ExpenseInterface } from "../../stores/expenseStore";
import { type IncomeInterface } from "../../stores/incomeStore";
import { useNotificationStore } from "../../stores/notificationStore";

export const checkMonthlyTriggers = async (
  userId: string,
  expenses: ExpenseInterface[],
  incomes: IncomeInterface[]
) => {
  const { addNotifications } = useNotificationStore.getState();

  console.log(expenses, incomes);

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const day = now.getDate();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  // Filtrage des données du mois courant
  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    console.log(d)
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

  // Résumé mensuel intermédiaire (le 15, seulement si activité)
  if (day === 15 && (totalExpenses > 0 || totalIncomes > 0)) {
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

  // Rappel d’inactivité (le 15)
  if (day === 15 && totalIncomes === 0 && totalExpenses === 0) {
    const midMonthReminder = `Aucune activité détectée ce mois-ci. N’oubliez pas de saisir vos revenus ou dépenses.`;
    await addNotifications(userId, {
      message: midMonthReminder,
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

    // Notif rapport disponible
    const reportMessage = `Votre rapport PDF pour ${now.toLocaleString(
      "fr-FR",
      {
        month: "long",
      }
    )} est disponible dans le tableau de bord.`;
    await addNotifications(userId, {
      message: reportMessage,
      type: "alert",
      date: now.toISOString(),
      read: false,
    });
  }

  // Catégorie dominante (le 20)
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

  // Rappel le 1er si aucun revenu
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

  // Rappel le 1er si aucune dépense
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
};
