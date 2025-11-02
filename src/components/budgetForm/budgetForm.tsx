import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useBudgetStore, type BudgetType } from "../../stores/budgetStore";
import { useUserStore } from "../../stores/userStore";
import HeaderForm from "../ui/HeaderForm";

const BudgetForm = () => {
  const [newBudget, setNewBudget] = useState({ name: "", amount: "" });
  const [budgetType, setBudgetType] = useState<BudgetType>("capped");
  const { verifyBudgetName, addBudget } = useBudgetStore();
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newBudget.name.trim() === "") {
      toast.error("Veuillez entrer le nom de la catégorie.");
      return;
    }

    // Validation : si type = 'capped', amount est obligatoire
    if (budgetType === "capped" && newBudget.amount.trim() === "") {
      toast.error("Veuillez entrer le montant du budget plafonné.");
      return;
    }

    try {
      const names = verifyBudgetName();

      if (names.includes(newBudget.name)) {
        toast.error("Catégorie existante");
        return;
      }

      const budget: any = {
        name: newBudget.name,
        type: budgetType,
      };

      // Ajouter amount seulement si type = 'capped'
      if (budgetType === "capped") {
        budget.amount = parseFloat(newBudget.amount);
      }

      await addBudget(user!.id, budget);
      toast.success("Catégorie ajoutée avec succès !");
      setNewBudget({ name: "", amount: "" });
      setBudgetType("capped");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du budget.");
    }
  };

  return (
    <div className="mt-8 p-6 border-2 col-span-1 border-dashed text-[#1f1f1f] dark:text-neutral-100 border-neutral-700 rounded-lg relative w-full">
      <form
        className="flex flex-col h-full justify-between gap-5"
        onSubmit={handleSubmit}
      >
        <HeaderForm title="Nouvelle catégorie" />

        {/* Sélecteur de type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Type de catégorie
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="budgetType"
                value="capped"
                checked={budgetType === "capped"}
                onChange={(e) => setBudgetType(e.target.value as BudgetType)}
                className="w-4 h-4 text-[#3170dd] focus:ring-[#3170dd]"
              />
              <span className="text-sm">Budget plafonné</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="budgetType"
                value="tracking"
                checked={budgetType === "tracking"}
                onChange={(e) => setBudgetType(e.target.value as BudgetType)}
                className="w-4 h-4 text-[#3170dd] focus:ring-[#3170dd]"
              />
              <span className="text-sm">Catégorie de suivi</span>
            </label>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {budgetType === "capped"
              ? "Vous serez alerté lorsque vous approcherez ou dépasserez ce montant"
              : "Aucune limite fixée. Suivez simplement vos dépenses pour mieux comprendre vos habitudes"}
          </p>
        </div>

        <input
          type="text"
          value={newBudget.name}
          placeholder="Nom de catégorie"
          onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
          required
          className="w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] border-neutral-400 bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
        />

        {/* Champ montant conditionnel */}
        {budgetType === "capped" && (
          <input
            type="number"
            value={newBudget.amount}
            min={0}
            placeholder="Montant maximum"
            onChange={(e) =>
              setNewBudget({ ...newBudget, amount: e.target.value })
            }
            required
            className="w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] border-neutral-400 bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
          />
        )}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1f1f1f] hover:opacity-90 text-white cursor-pointer rounded transition-colors"
        >
          <CirclePlus size={20} />
          <span>Créer catégorie</span>
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;
