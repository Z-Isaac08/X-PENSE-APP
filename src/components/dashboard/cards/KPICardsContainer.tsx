import { CreditCard, DollarSign, List, Wallet } from "lucide-react";
import React from "react";
import { useDashboardStore } from "../../../stores/dashboardStore";
import { KPICard } from "./KPICard";

export const KPICardsContainer: React.FC = () => {
  const {
    getBalance,
    getTotalExpenses,
    getTotalTransactions,
    getTotalIncomes,
  } = useDashboardStore();

  const balance = getBalance();
  const totalIncomes = getTotalIncomes();
  const totalExpenses = getTotalExpenses();
  const totalTransactions = getTotalTransactions();

  const kpis = [
    { value: totalExpenses, label: "Dépenses Totales", icon: <CreditCard /> },
    { value: totalIncomes, label: "Revenus Totaux", icon: <Wallet /> },
    { value: balance, label: "Solde", icon: <DollarSign /> },
    { value: totalTransactions, label: "Transactions", icon: <List /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};
