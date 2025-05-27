import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useBudgetStore, type BudgetInterface } from "../../stores/budgetStore";
import { useExpenseStore } from "../../stores/expenseStore";
import { useUserStore } from "../../stores/userStore";
import { formatDate } from "../../utils";

const ExpenseForm = ({ budget }: { budget: BudgetInterface | null }) => {
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    budgetId: budget ? budget.id : "",
  });
  const { addExpense } = useExpenseStore();
  const { budgets } = useBudgetStore();
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newExpense.name.trim() === "" ||
      newExpense.amount.trim() === "" ||
      newExpense.budgetId.trim() === ""
    ) {
      toast.error(
        "Veuillez entrer le nom, le montant et la catégorie de la dépense."
      );
      return;
    }

    try {
      const expense = {
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        budget: newExpense.budgetId,
        date: formatDate(Date.now()),
      };
      await addExpense(user!.id, expense);
      toast.success("Dépense ajoutée avec succès !");
      // Réinitialiser le formulaire ou mettre à jour l'interface utilisateur si nécessaire
      setNewExpense({ name: "", amount: "", budgetId: "" });
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout de la dépense.");
    }
  };

  return (
    <div className="mt-8 p-6 border-2 border-dashed border-neutral-700 rounded-lg relative w-full">
      <form
        className="flex flex-col h-full justify-between gap-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold text-[#1f1f1f]">
          Nouvelle dépense
        </h2>
        <input
          type="text"
          className="w-full p-3 text-lg border-2 border-neutral-400 rounded focus:border-[#3170dd] focus:outline-none transition-colors"
          value={newExpense.name}
          placeholder="Nom de dépense"
          onChange={(e) =>
            setNewExpense({ ...newExpense, name: e.target.value })
          }
          required
        />
        <input
          type="number"
          className="w-full p-3 text-lg border-2 border-neutral-400 rounded focus:border-[#3170dd] focus:outline-none transition-colors"
          value={newExpense.amount}
          placeholder="Montant"
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          required
        />
        {!budget ? (
          <select
            className="w-full p-3 text-lg border-2 border-neutral-400 rounded focus:border-[#3170dd] focus:outline-none transition-colors"
            value={newExpense.budgetId}
            onChange={(e) =>
              setNewExpense({ ...newExpense, budgetId: e.target.value })
            }
          >
            <option value="" disabled>
              Sélectionner un budget
            </option>
            {budgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.name}
              </option>
            ))}
          </select>
        ) : (
          <></>
        )}

        <button
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1f1f1f] hover:opacity-90 text-white rounded cursor-pointer transition-colors"
          type="submit"
        >
          <CirclePlus />
          <span className="text">Ajouter dépense</span>
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
