import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { addBudget, verifyBudgetName } from "../../services/budgetHelper";

const BudgetForm = ({ onBudget }) => {
  const [newBudget, setNewBudget] = useState({ name: "", amount: "" });
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newBudget.name.trim() === "" || newBudget.amount.trim() === "") {
      toast.error("Veuillez entrer le nom et le montant du budget.");
      return;
    }

    try {
      const names = await verifyBudgetName(user.id);

      if (names.includes(newBudget.name)) {
        toast.error("Catégorie existante");
        return;
      }

      const budget = {
        name: newBudget.name,
        amount: parseFloat(newBudget.amount),
      };

      await addBudget(user.id, budget);
      toast.success("Catégorie ajoutée avec succès !");
      if (onBudget) onBudget();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du budget.");
    }
  };

  return (
    <div className="mt-8 p-6 border-2 col-span-1 border-dashed border-neutral-700 rounded-lg relative w-full">
      <form
        className="flex flex-col h-full justify-between gap-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold text-neutral-900">
          Nouvelle catégorie
        </h2>

        <input
          type="text"
          value={newBudget.name}
          placeholder="Nom de catégorie"
          onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
          required
          className="w-full p-3 text-lg border-2 border-neutral-400 rounded focus:border-[#3170dd] focus:outline-none transition-colors"
        />

        <input
          type="number"
          value={newBudget.amount}
          placeholder="Solde de catégorie"
          onChange={(e) =>
            setNewBudget({ ...newBudget, amount: e.target.value })
          }
          required
          className="w-full p-3 text-lg border-2 border-neutral-400 rounded focus:border-[#3170dd] focus:outline-none transition-colors"
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1f1f1f] hover:opacity-90 text-white rounded transition-colors"
        >
          <CirclePlus size={20} />
          <span>Créer catégorie</span>
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;
