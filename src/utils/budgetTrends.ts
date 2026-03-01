import { type ExpenseInterface } from '../stores/expenseStore';

/**
 * Calcule la tendance mensuelle pour une catégorie de suivi
 * Compare le mois actuel avec les 3 derniers mois
 */
export const calculateTrackingTrend = (
  budgetId: string,
  expenses: ExpenseInterface[],
  targetMonth?: number,
  targetYear?: number
): {
  currentMonth: number;
  previousMonth: number;
  average3Months: number;
  variation: number;
  trend: 'up' | 'down' | 'stable';
} => {
  const now = new Date();
  const monthToAnalyze = targetMonth !== undefined ? targetMonth : now.getMonth();
  const yearToAnalyze = targetYear !== undefined ? targetYear : now.getFullYear();

  // Mois analysé (actuel au moment du calcul)
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return (
      e.budget === budgetId && d.getMonth() === monthToAnalyze && d.getFullYear() === yearToAnalyze
    );
  });
  const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Mois précédent l'analyse
  const previousMonth = monthToAnalyze === 0 ? 11 : monthToAnalyze - 1;
  const previousYear = monthToAnalyze === 0 ? yearToAnalyze - 1 : yearToAnalyze;
  const previousMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return (
      e.budget === budgetId && d.getMonth() === previousMonth && d.getFullYear() === previousYear
    );
  });
  const previousTotal = previousMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Moyenne des 3 derniers mois
  const last3Months: number[] = [];
  for (let i = 1; i <= 3; i++) {
    let targetM = monthToAnalyze - i;
    let targetY = yearToAnalyze;

    while (targetM < 0) {
      targetM += 12;
      targetY -= 1;
    }

    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return e.budget === budgetId && d.getMonth() === targetM && d.getFullYear() === targetY;
    });
    last3Months.push(monthExpenses.reduce((sum, e) => sum + e.amount, 0));
  }

  const average3Months =
    last3Months.length > 0
      ? last3Months.reduce((sum, val) => sum + val, 0) / last3Months.length
      : 0;

  // Calcul de la variation
  const variation =
    previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : currentTotal > 0
        ? 100
        : 0;

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
