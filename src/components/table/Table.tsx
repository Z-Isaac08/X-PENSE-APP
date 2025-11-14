import { Trash } from "lucide-react";
import { toast } from "react-toastify";
import { useBudgetStore } from "../../stores/budgetStore";
import {
  useExpenseStore,
  type ExpenseInterface,
} from "../../stores/expenseStore";

import { useIncomeStore, type IncomeInterface } from "../../stores/incomeStore";
import { useUserStore } from "../../stores/userStore";
import { formatDateDisplay } from "../../utils";

interface TableProps {
  expenses: ExpenseInterface[];
  incomes: IncomeInterface[];
  showCategory?: boolean;
  showActions?: boolean;
}

const Table = ({
  expenses,
  incomes,
  showCategory = true,
  showActions = true
}: TableProps) => {
  const { deleteExpense } = useExpenseStore();
  const { deleteIncome } = useIncomeStore();
  const { getBudgetById } = useBudgetStore();
  const { user } = useUserStore();

  const transactions = [
    ...expenses.map((e) => ({ ...e, type: "expense" } as const)),
    ...incomes.map((i) => ({ ...i, type: "income" } as const)),
  ];

  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleDelete = async (id: string, type: 'expense' | 'income') => {
    if (!user) return;
    
    try {
      if (type === "expense") {
        await deleteExpense(user.id, id);
        toast.success("Dépense supprimée");
      } else {
        await deleteIncome(user.id, id);
        toast.success("Revenu supprimé");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Échec lors de la suppression");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-[#1f1f1f] dark:text-neutral-100 rounded-lg text-sm sm:text-base">
        <thead>
          <tr className="bg-[#3170dd] text-white">
            <th className="text-left px-4 py-3">Nom</th>
            <th className="text-left px-4 py-3">Montant</th>
            {showCategory && <th className="text-left px-4 py-3">Catégorie</th>}
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Type</th>
            {showActions && <th className="text-center px-4 py-3">Action</th>}
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => {
            const budget = getBudgetById(transaction.budget || '');
            return (
              <tr
                key={`${transaction.type}-${transaction.id}`}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3">{transaction.name}</td>
                <td className={`px-4 py-3 font-medium ${transaction.type === 'expense' ? 'text-gray-900 dark:text-gray-100' : 'text-blue-600 dark:text-blue-400'}`}>
                  {transaction.type === 'expense' ? '-' : '+'} {transaction.amount.toFixed(0)} FCFA
                </td>
                {showCategory && (
                  <td className="px-4 py-3">
                    {budget?.name || 'Non catégorisé'}
                  </td>
                )}
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDateDisplay(transaction.date)}
                </td>
                <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.type === 'expense' 
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {transaction.type === "expense" ? "Dépense" : "Revenu"}
                  </span>
                </td>
                {showActions && (
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(transaction.id, transaction.type)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
