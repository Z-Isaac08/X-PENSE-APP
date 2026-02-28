import { useBudgetStore } from '../../stores/budgetStore';
import { useExpenseStore } from '../../stores/expenseStore';
import { useIncomeStore } from '../../stores/incomeStore';
import { useNotificationStore } from '../../stores/notificationStore';

export const checkExpenseTriggers = async (userId: string, budgetId: string) => {
  const { getBudgetById } = useBudgetStore.getState();
  const { getExpenseBudget, expenses } = useExpenseStore.getState();
  const { getIncomeBudget } = useIncomeStore.getState();
  const { addNotifications } = useNotificationStore.getState();

  const budget = getBudgetById(budgetId);
  if (!budget) return;

  const spent = getExpenseBudget(budgetId);
  const added = getIncomeBudget(budgetId);

  // Comportement différent selon le type de budget
  if (budget.type === 'capped') {
    // MODE BUDGET PLAFONNÉ : Alertes de dépassement
    if (!budget.amount) return; // Sécurité : budget plafonné doit avoir un montant

    const total = budget.amount + added;
    const usage = (spent / total) * 100;

    // Alerte à 80%
    if (usage >= 80 && usage < 90) {
      await addNotifications(userId, {
        message: `⚠️ Attention ! Le budget ${budget.name} a été utilisé à ${Math.round(usage)}%.`,
        type: 'alert',
        date: new Date().toISOString(),
        read: false,
      });
    }

    // Alerte à 90%
    if (usage >= 90 && usage < 100) {
      await addNotifications(userId, {
        message: `⚠️ Alerte ! Le budget ${budget.name} a été utilisé à ${Math.round(usage)}%. Limite proche !`,
        type: 'alert',
        date: new Date().toISOString(),
        read: false,
      });
    }

    // Alerte dépassement
    if (spent > total) {
      const dépassement = spent - total;
      await addNotifications(userId, {
        message: `🚨 Le budget ${budget.name} a été dépassé de ${dépassement.toLocaleString()} FCFA.`,
        type: 'alert',
        date: new Date().toISOString(),
        read: false,
      });
    }
  } else if (budget.type === 'savings') {
    // MODE BUDGET ÉPARGNE : Alertes de progression vers l'objectif
    const goal = budget.amount || 0;
    if (goal === 0) return;

    // Montant net épargné = revenus - dépenses de ce budget
    const netSaved = added - spent;
    const percentage = (netSaved / goal) * 100;

    // Alerte si un retrait fait passer sous 50% de l'objectif
    if (netSaved >= 0 && percentage < 50 && spent > 0) {
      await addNotifications(userId, {
        message: `⚠️ Retrait sur "${budget.name}" : il ne reste que ${netSaved.toLocaleString()} FCFA épargnés (${Math.round(percentage)}% de l'objectif).`,
        type: 'alert',
        date: new Date().toISOString(),
        read: false,
      });
    }

    // Alerte si l'objectif est atteint
    if (netSaved >= goal) {
      await addNotifications(userId, {
        message: `🎉 Objectif d'épargne "${budget.name}" atteint ! ${netSaved.toLocaleString()} FCFA épargnés sur ${goal.toLocaleString()} FCFA.`,
        type: 'income',
        date: new Date().toISOString(),
        read: false,
      });
    }
  } else if (budget.type === 'tracking') {
    // MODE CATÉGORIE DE SUIVI : Insights informatifs basés sur comparaison mensuelle

    // Calculer les dépenses du mois précédent pour cette catégorie
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return (
        e.budget === budgetId && d.getMonth() === currentMonth && d.getFullYear() === currentYear
      );
    });

    const previousMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return (
        e.budget === budgetId && d.getMonth() === previousMonth && d.getFullYear() === previousYear
      );
    });

    const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const previousTotal = previousMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Générer notification seulement si variation significative (>30%) et qu'on a des données du mois précédent
    if (previousTotal > 0) {
      const variation = ((currentTotal - previousTotal) / previousTotal) * 100;

      if (Math.abs(variation) >= 30) {
        const trend = variation > 0 ? 'augmenté' : 'diminué';

        await addNotifications(userId, {
          message: `📊 À noter : Vos dépenses pour ${budget.name} ont ${trend} de ${Math.abs(Math.round(variation))}% par rapport au mois dernier.`,
          type: 'expense',
          date: new Date().toISOString(),
          read: false,
        });
      }
    }
  }

  // Notification commune : dépense élevée (tous types)
  if (spent > 50000) {
    await addNotifications(userId, {
      message: `💰 Dépense élevée : ${spent.toLocaleString()} FCFA pour ${budget.name}.`,
      type: 'expense',
      date: new Date().toISOString(),
      read: false,
    });
  }
};
