import { type ExpenseInterface } from "../stores/expenseStore";

/**
 * Calcule la tendance mensuelle pour une catégorie de suivi
 * Compare le mois actuel avec les 3 derniers mois
 */
export const calculateTrackingTrend = (
  budgetId: string,
  expenses: ExpenseInterface[]
): {
  currentMonth: number;
  previousMonth: number;
  average3Months: number;
  variation: number;
  trend: 'up' | 'down' | 'stable';
} => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Mois actuel
  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return e.budget === budgetId && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Mois précédent
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const previousMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return e.budget === budgetId && d.getMonth() === previousMonth && d.getFullYear() === previousYear;
  });
  const previousTotal = previousMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Moyenne des 3 derniers mois
  const last3Months: number[] = [];
  for (let i = 1; i <= 3; i++) {
    let targetMonth = currentMonth - i;
    let targetYear = currentYear;
    
    while (targetMonth < 0) {
      targetMonth += 12;
      targetYear -= 1;
    }

    const monthExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return e.budget === budgetId && d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    });
    last3Months.push(monthExpenses.reduce((sum, e) => sum + e.amount, 0));
  }

  const average3Months = last3Months.length > 0 
    ? last3Months.reduce((sum, val) => sum + val, 0) / last3Months.length 
    : 0;

  // Calcul de la variation
  const variation = previousTotal > 0 
    ? ((currentTotal - previousTotal) / previousTotal) * 100 
    : (currentTotal > 0 ? 100 : 0);

  // Déterminer la tendance
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (Math.abs(variation) < 10) {
    trend = 'stable';
  } else if (variation > 0) {
    trend = 'up';
  } else {
    trend = 'down';
  }

  return {
    currentMonth: currentTotal,
    previousMonth: previousTotal,
    average3Months,
    variation,
    trend,
  };
};

/**
 * Formatte la variation en texte lisible
 */
export const formatTrendText = (variation: number, trend: 'up' | 'down' | 'stable'): string => {
  if (trend === 'stable') {
    return '➡️ Stable';
  } else if (trend === 'up') {
    return `📈 +${Math.abs(Math.round(variation))}% vs mois dernier`;
  } else {
    return `📉 -${Math.abs(Math.round(variation))}% vs mois dernier`;
  }
};
