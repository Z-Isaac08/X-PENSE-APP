import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useBudgetStore, type BudgetInterface } from '../../stores/budgetStore';
import { useExpenseStore } from '../../stores/expenseStore';
import { useIncomeStore } from '../../stores/incomeStore';
import { useUserStore } from '../../stores/userStore';
import { cleanAmountInput, formatAmountInput } from '../../utils';
import { checkSavingsMilestones } from '../notifications/checkSavingsMilestones';
import HeaderForm from '../ui/HeaderForm';

const IncomeForm = ({ budget }: { budget: BudgetInterface | null }) => {
  const [newIncome, setNewIncome] = useState({
    name: '',
    amount: '',
    budgetId: budget ? budget.id : '',
  });
  const { addIncome } = useIncomeStore();
  const { budgets } = useBudgetStore();
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newIncome.name.trim() === '' ||
      newIncome.amount.trim() === '' ||
      newIncome.budgetId.trim() === ''
    ) {
      toast.error('Veuillez entrer le nom, le montant et la catégorie du revenu.');
      return;
    }

    try {
      const income = {
        name: newIncome.name,
        amount: cleanAmountInput(newIncome.amount),
        budget: newIncome.budgetId,
        date: new Date().toISOString(),
      };
      await addIncome(user!.id, income);
      toast.success('Revenu ajouté avec succès !');

      // Check milestones for savings budget
      // Get the target budget
      const targetBudget = budget || budgets.find(b => b.id === newIncome.budgetId);
      if (targetBudget && targetBudget.type === 'savings') {
        // Fetch fresh data
        const currentIncomes = useIncomeStore.getState().incomes;
        const currentExpenses = useExpenseStore.getState().expenses;
        await checkSavingsMilestones(user!.id, targetBudget, currentExpenses, currentIncomes);
      }

      // Réinitialiser le formulaire ou mettre à jour l'interface utilisateur si nécessaire
      setNewIncome({ name: '', amount: '', budgetId: '' });
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout du revenu.");
    }
  };

  return (
    <div className="mt-8 p-6 border-2 border-dashed text-[#1f1f1f] dark:text-neutral-100 border-neutral-700 rounded-lg relative w-full">
      <form className="flex flex-col h-full justify-between gap-5" onSubmit={handleSubmit}>
        <HeaderForm title="Nouveau revenu" />
        <input
          type="text"
          className="w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] border-neutral-400 bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
          value={newIncome.name}
          placeholder="Source du revenu"
          onChange={e => setNewIncome({ ...newIncome, name: e.target.value })}
          required
        />
        <input
          type="text"
          className="w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] border-neutral-400 bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
          value={newIncome.amount}
          placeholder="Montant"
          onChange={e => setNewIncome({ ...newIncome, amount: formatAmountInput(e.target.value) })}
          required
        />
        {!budget && (
          <select
            className="w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] border-neutral-400 bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
            value={newIncome.budgetId}
            onChange={e => setNewIncome({ ...newIncome, budgetId: e.target.value })}
          >
            <option value="" disabled>
              Sélectionner un budget
            </option>
            {budgets.map(budget => (
              <option key={budget.id} value={budget.id} className="text-[#1f1f1f]">
                {budget.name}
              </option>
            ))}
          </select>
        )}

        <button
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1f1f1f] hover:opacity-90 text-white rounded cursor-pointer transition-colors"
          type="submit"
        >
          <CirclePlus />
          <span className="text">Ajouter revenu</span>
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;
