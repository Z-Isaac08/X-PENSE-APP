import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useBudgetStore, type BudgetType } from '../../stores/budgetStore';
import { useUserStore } from '../../stores/userStore';
import { cleanAmountInput, formatAmountInput } from '../../utils';
import HeaderForm from '../ui/HeaderForm';

const BudgetForm = ({
  standalone = true,
  onSuccess,
}: {
  standalone?: boolean;
  onSuccess?: () => void;
}) => {
  const [newBudget, setNewBudget] = useState({ name: '', amount: '' });
  const [budgetType, setBudgetType] = useState<BudgetType>('capped');
  const { verifyBudgetName, addBudget } = useBudgetStore();
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newBudget.name.trim() === '') {
      toast.error('Veuillez entrer le nom de la catégorie.');
      return;
    }

    // Validation : si type = 'capped' ou 'savings', amount est obligatoire
    if ((budgetType === 'capped' || budgetType === 'savings') && newBudget.amount.trim() === '') {
      toast.error(
        budgetType === 'capped'
          ? 'Veuillez entrer le montant du budget plafonné.'
          : "Veuillez entrer le montant de l'objectif d'épargne."
      );
      return;
    }

    try {
      const names = verifyBudgetName();

      if (names.includes(newBudget.name)) {
        toast.error('Catégorie existante');
        return;
      }

      const budget: any = {
        name: newBudget.name,
        type: budgetType,
      };

      // Ajouter amount seulement si type = 'capped' ou 'savings'
      if (budgetType === 'capped' || budgetType === 'savings') {
        budget.amount = cleanAmountInput(newBudget.amount);
      }

      await addBudget(user!.id, budget);
      toast.success('Catégorie ajoutée avec succès !');
      setNewBudget({ name: '', amount: '' });
      setBudgetType('capped');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du budget.");
    }
  };

  return (
    <div
      className={`${standalone ? 'mt-8 p-6 border-2 border-dashed border-neutral-700 rounded-lg' : ''} text-[#1f1f1f] dark:text-neutral-100 relative w-full`}
    >
      <form className="flex flex-col h-full justify-between gap-5" onSubmit={handleSubmit}>
        {standalone && <HeaderForm title="Nouvelle catégorie" />}

        {/* Sélecteur de type */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Type de catégorie
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="budgetType"
                value="capped"
                checked={budgetType === 'capped'}
                onChange={e => setBudgetType(e.target.value as BudgetType)}
                className="w-4 h-4 text-[#3170dd] focus:ring-[#3170dd]"
              />
              <span className="text-sm font-medium">Budget plafonné</span>
            </label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-6 mb-2">
              Vous serez alerté lorsque vous approcherez ou dépasserez ce montant.
            </p>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="budgetType"
                value="tracking"
                checked={budgetType === 'tracking'}
                onChange={e => setBudgetType(e.target.value as BudgetType)}
                className="w-4 h-4 text-[#3170dd] focus:ring-[#3170dd]"
              />
              <span className="text-sm font-medium">Catégorie de suivi</span>
            </label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-6 mb-2">
              Aucune limite. Suivez simplement vos dépenses.
            </p>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="budgetType"
                value="savings"
                checked={budgetType === 'savings'}
                onChange={e => setBudgetType(e.target.value as BudgetType)}
                className="w-4 h-4 text-[#3170dd] focus:ring-[#3170dd]"
              />
              <span className="text-sm font-medium">Objectif d'épargne</span>
            </label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-6">
              Définissez un montant cible à atteindre.
            </p>
          </div>
        </div>

        <input
          type="text"
          value={newBudget.name}
          placeholder="Nom de catégorie"
          onChange={e => setNewBudget({ ...newBudget, name: e.target.value })}
          required
          className="w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] border-neutral-400 bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
        />

        {/* Champ montant conditionnel */}
        {(budgetType === 'capped' || budgetType === 'savings') && (
          <input
            type="text"
            value={newBudget.amount}
            placeholder={budgetType === 'capped' ? 'Montant maximum' : 'Objectif à atteindre'}
            onChange={e =>
              setNewBudget({ ...newBudget, amount: formatAmountInput(e.target.value) })
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
