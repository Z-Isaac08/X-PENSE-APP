import { Trash } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import ExpenseForm from '../components/expenseForm/ExpenseForm';
import IncomeForm from '../components/incomeForm/incomeForm';
import Progressbar from '../components/progressBar/Progressbar';
import SEO from '../components/SEO';
import Table from '../components/table/Table';
import { useBudgetStore } from '../stores/budgetStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useIncomeStore } from '../stores/incomeStore';
import { useUserStore } from '../stores/userStore';
import { formatCurrency } from '../utils';

const BudgetPage = () => {
  const { budgetID } = useParams();
  const { expenses, getExpenseBudget, deleteExpensesByBudget } = useExpenseStore();
  const { incomes, getIncomeBudget, deleteIncomesByBudget } = useIncomeStore();
  const { getBudgetById, deleteBudget } = useBudgetStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const budget = getBudgetById(budgetID);
  const spent = getExpenseBudget(budgetID);
  const added = getIncomeBudget(budgetID);

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleDelete = async () => {
    try {
      if (!budgetID || !user) return;

      const confirmDelete = window.confirm(
        'Êtes-vous sûr de vouloir supprimer cette catégorie ? Toutes les transactions associées seront également supprimées.'
      );

      if (!confirmDelete) return;

      // Supprimer toutes les transactions liées
      await deleteExpensesByBudget(user.id, budgetID);
      await deleteIncomesByBudget(user.id, budgetID);

      // Supprimer le budget lui-même
      await deleteBudget(user.id, budgetID);

      toast.success('Catégorie et transactions supprimées');
      navigate(`/h`);
    } catch (error) {
      console.error('Erreur lors de la suppression en cascade:', error);
      toast.error('Échec lors de la suppression');
    }
  };

  if (!budget) {
    return (
      <>
        <SEO title="Chargement..." description="Chargement des détails du budget." />
        <div className="p-8 text-lg text-center">Chargement...</div>
      </>
    );
  }

  // Calculs selon le type
  const isCapped = budget.type === 'capped';
  const restant = isCapped ? (budget.amount || 0) + added - spent : 0;
  const dangerClass =
    isCapped && restant < 0 ? 'text-[#e33131] dark:text-[#e33131]' : 'dark:text-neutral-100';

  return (
    <main className="min-h-screen px-6 py-8 space-y-8 md:px-16 text-[#1f1f1f] dark:text-neutral-100 transition-colors duration-500">
      <SEO
        title={`${budget.name} - Budget`}
        description={`Suivi des dépenses pour le budget ${budget.name}.`}
      />
      <h1 className="text-4xl md:text-6xl font-bold mb-8">
        Aperçu de <span className="text-[#3170dd]">{budget.name}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isCapped ? (
          // BUDGET PLAFONNÉ
          <div className="p-6 flex flex-col gap-5 justify-center border-2 border-neutral-300 dark:border-neutral-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                Budget plafonné
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-semibold ${dangerClass}`}>{budget.name}</h3>
              <p className={`text-lg font-medium ${dangerClass}`}>
                {formatCurrency(budget.amount || 0)}
              </p>
            </div>
            <Progressbar
              spent={
                (budget.amount || 0) + added > 0
                  ? (spent / ((budget.amount || 0) + added)) * 100
                  : 0
              }
              state={restant > 0 ? true : false}
              even
            />
            <div className="flex justify-between text-sm mt-4">
              <div className="flex flex-col justify-center items-start gap-2">
                <p className={`${dangerClass}`}>{formatCurrency(spent)} dépensé</p>
                <p className={`${dangerClass}`}>{formatCurrency(added)} ajouté</p>
              </div>
              <p className={`${dangerClass}`}>{formatCurrency(restant)} restant</p>
            </div>
            <div className="text-center text-sm mt-2">
              {restant > 0 ? (
                <span className="text-green-600 dark:text-green-400">Dans les limites</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">Budget dépassé</span>
              )}
            </div>
            <button
              onClick={handleDelete}
              className="mt-4 flex items-center justify-center gap-2 px-4 cursor-pointer py-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
            >
              <Trash className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        ) : budget.type === 'savings' ? (
          // BUDGET ÉPARGNE
          <div className="p-6 flex flex-col gap-5 justify-center border-2 border-emerald-500/50 dark:border-emerald-400/50 bg-emerald-50/10 dark:bg-emerald-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded">
                Objectif d'épargne
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                {budget.name}
              </h3>
              <p className="text-lg font-medium text-emerald-700 dark:text-emerald-300">
                Obj. {formatCurrency(budget.amount || 0)}
              </p>
            </div>

            {/* Calculs Spécifiques Épargne */}
            {(() => {
              const currentSaved = added - spent;
              const goal = budget.amount || 0;
              const percentage = goal > 0 ? (currentSaved / goal) * 100 : 0;
              const remainingToGoal = Math.max(0, goal - currentSaved);

              return (
                <>
                  <Progressbar
                    spent={percentage}
                    state={true}
                    even={false}
                    customColor="bg-emerald-500"
                  />
                  <div className="flex justify-between text-sm mt-4">
                    <div className="flex flex-col justify-center items-start gap-2">
                      <p className="text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(currentSaved)} épargné
                      </p>
                      <div className="text-xs text-neutral-500">
                        (+{formatCurrency(added)} revenus / -{formatCurrency(spent)} retraits)
                      </div>
                    </div>
                    <p className="text-neutral-500">{formatCurrency(remainingToGoal)} restants</p>
                  </div>
                  <div className="text-center text-sm mt-2">
                    {currentSaved >= goal ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Objectif atteint ! Félicitations !
                      </span>
                    ) : (
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Continuez comme ça !
                      </span>
                    )}
                  </div>
                </>
              );
            })()}

            <button
              onClick={handleDelete}
              className="mt-4 flex items-center justify-center gap-2 px-4 cursor-pointer py-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
            >
              <Trash className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        ) : (
          // CATÉGORIE DE SUIVI
          <div className="p-6 flex flex-col gap-5 justify-center border-2 border-neutral-300 dark:border-neutral-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded">
                Catégorie de suivi
              </span>
            </div>
            <h3 className="text-xl font-semibold">{budget.name}</h3>

            <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <p className="text-4xl font-bold text-[#3170dd]">{formatCurrency(spent)}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                dépensé ce mois-ci
              </p>
            </div>

            {added > 0 && (
              <div className="text-center text-sm">
                <p className="text-neutral-600 dark:text-neutral-400">
                  + {formatCurrency(added)} ajouté
                </p>
              </div>
            )}

            <div className="text-xs text-center text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 p-3 rounded">
              Aucune limite fixée • Cette catégorie sert uniquement à suivre vos dépenses
            </div>

            <button
              onClick={handleDelete}
              className="mt-4 flex items-center justify-center gap-2 px-4 cursor-pointer py-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
            >
              <Trash className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        )}

        <ExpenseForm budget={budget} />
        <IncomeForm budget={budget} />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Transactions récentes</h2>
        <div>
          <Table
            expenses={expenses.filter(e => e.budget === budgetID)}
            incomes={incomes.filter(e => e.budget === budgetID)}
          />
          {(expenses.length > 10 || incomes.length > 10) && (
            <div className="mt-4 text-center">
              <Link
                to="/h/transactions"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#3170dd] hover:text-[#1e5bbf] transition-colors duration-200 rounded-md border border-[#3170dd] hover:bg-[#f0f5ff] dark:border-[#4a8aff] dark:text-[#4a8aff] dark:hover:bg-[#1a2236]"
              >
                Voir toutes les transactions
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default BudgetPage;
