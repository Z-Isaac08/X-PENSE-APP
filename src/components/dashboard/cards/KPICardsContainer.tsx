import {
  Activity,
  CreditCard,
  DollarSign,
  List,
  PiggyBank,
  Target,
  Wallet,
} from "lucide-react";
import React from "react";
import { useDashboardStore } from "../../../stores/dashboardStore";
import { formatCurrency, formatPercentage } from "../../../utils";
import { KPICard } from "./KPICard";

export const KPICardsContainer: React.FC = () => {
  // ✅ Toujours appeler les hooks Zustand en haut du composant
  const getCurrentMonthData = useDashboardStore(
    (state) => state.getCurrentMonthData
  );
  const getMonthlyComparison = useDashboardStore(
    (state) => state.getMonthlyComparison
  );
  const getSavingsRate = useDashboardStore((state) => state.getSavingsRate);
  const getMonthlyAverageSpending = useDashboardStore(
    (state) => state.getMonthlyAverageSpending
  );
  const getBudgetUtilizationRate = useDashboardStore(
    (state) => state.getBudgetUtilizationRate
  );

  try {
    const currentMonth = getCurrentMonthData?.();
    const comparison = getMonthlyComparison?.();

    if (!currentMonth || !comparison) {
      return <div>Chargement des données KPI...</div>;
    }

    const savingsRate = getSavingsRate?.() || 0;
    const avgSpending = getMonthlyAverageSpending?.() || 0;
    const budgetUtilization = getBudgetUtilizationRate?.() || 0;

    const kpis = [
      {
        value: formatCurrency(currentMonth.expenses),
        label: "Dépenses ce mois",
        icon: <CreditCard />,
        change: comparison.expenses?.change ?? 0,
        showTrend: true,
      },
      {
        value: formatCurrency(currentMonth.incomes),
        label: "Revenus ce mois",
        icon: <Wallet />,
        change: comparison.incomes?.change ?? 0,
        showTrend: true,
      },
      {
        value: formatCurrency(currentMonth.balance),
        label: "Solde actuel",
        icon: <DollarSign />,
        change: comparison.balance?.change ?? 0,
        showTrend: true,
      },
      {
        value: currentMonth.transactions,
        label: "Transactions",
        icon: <List />,
      },
      {
        value: formatPercentage(savingsRate),
        label: "Taux d'épargne",
        icon: <PiggyBank />,
      },
      {
        value: formatCurrency(avgSpending),
        label: "Dépenses moyennes/mois",
        icon: <Activity />,
      },
      {
        value: formatPercentage(budgetUtilization),
        label: "Utilisation budget",
        icon: <Target />,
      },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error in KPICardsContainer:", error);
    return <div>Erreur lors du chargement des données KPI</div>;
  }
};
