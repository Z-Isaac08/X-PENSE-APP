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

const Table = ({
  expenses,
  incomes,
}: {
  expenses: ExpenseInterface[];
  incomes: IncomeInterface[];
}) => {
  const { deleteExpense } = useExpenseStore();
  const { deleteIncome } = useIncomeStore();
  const { getBudgetById } = useBudgetStore();
  const { user } = useUserStore();

  const transactions = [
    ...expenses.map((e) => ({ ...e, type: "expense" })),
    ...incomes.map((i) => ({ ...i, type: "income" })),
  ];

  const sortedTransactions = transactions.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleDelete = async (id: string, type: string) => {
    if (type === "expense") {
      try {
        await deleteExpense(user!.id, id);
        toast.success("Dépense supprimée");
      } catch {
        toast.error("Échec lors de la suppression");
      }
    } else {
      try {
        await deleteIncome(user!.id, id);
        toast.success("Revenu supprimé");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Échec lors de la suppression");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-[#1f1f1f] dark:text-neutral-100 rounded-lg text-sm sm:text-base">
        <thead>
          <tr className="bg-[#3170dd] text-white">
            <th className="text-left px-4 py-3">Nom</th>
            <th className="text-left px-4 py-3">Montant</th>
            <th className="text-left px-4 py-3">Catégorie</th>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Type</th>
            <th className="text-center px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => {
            const budget = getBudgetById(transaction.budget);
            return (
              <tr
                key={transaction.id}
                className="border-b last:border-b-2 border-blue-600 even:bg-blue-50 even:text-[#1f1f1f]"
              >
                <td className="px-4 py-2">{transaction.name}</td>
                <td className="px-4 py-2">{transaction.amount}</td>
                <td className="px-4 py-2">{budget?.name}</td>
                <td className="px-4 py-2">{formatDateDisplay(transaction.date)}</td>
                <td className="px-4 py-2">
                  {transaction.type === "expense" ? "Dépense" : "Revenu"}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-red-600 hover:text-red-800 transition cursor-pointer"
                    onClick={() =>
                      handleDelete(transaction.id, transaction.type)
                    }
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
