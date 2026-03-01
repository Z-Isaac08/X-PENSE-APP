import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronUp, Info, Plus, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import BudgetForm from '../components/budgetForm/budgetForm';
import ExpenseForm from '../components/expenseForm/ExpenseForm';
import IncomeForm from '../components/incomeForm/incomeForm';
import { checkMonthlyTriggers } from '../components/notifications/checkMonthlyTriggers';
import Progressbar from '../components/progressBar/Progressbar';
import Table from '../components/table/Table';
import { useBudgetStore } from '../stores/budgetStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useIncomeStore } from '../stores/incomeStore';
import { useUserStore } from '../stores/userStore';
import { formatCurrency } from '../utils';

import SEO from '../components/SEO';

const HomePage = () => {
  const { budgets } = useBudgetStore();
  const { expenses, getExpenseBudget } = useExpenseStore();
  const { incomes, getIncomeBudget } = useIncomeStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  // Combiner et trier toutes les transactions par date (du plus récent au plus ancien)
  const allTransactions = [
    ...expenses.map(expense => ({ ...expense, type: 'expense' as const })),
    ...incomes.map(income => ({ ...income, type: 'income' as const })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Prendre les 5 plus récentes

  // Séparer à nouveau pour le composant Table
  const visibleExpenses = allTransactions
    .filter(tx => tx.type === 'expense')
    .map(({ type, ...expense }) => expense);

  const visibleIncomes = allTransactions
    .filter(tx => tx.type === 'income')
    .map(({ type, ...income }) => income);

  const displayBudgets = (() => {
    const sorted = [...budgets].sort((a, b) =>
      (b.createdAt || '').localeCompare(a.createdAt || '')
    );
    const top3: typeof budgets = [];
    const types = ['capped', 'savings', 'tracking'] as const;

    types.forEach(type => {
      const found = sorted.find(b => b.type === type);
      if (found) top3.push(found);
    });

    sorted.forEach(b => {
      if (top3.length < 3 && !top3.some(existing => existing.id === b.id)) {
        top3.push(b);
      }
    });

    return top3.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  })();

  const isRunningCheck = useRef(false);

  useEffect(() => {
    const runMonthlyCheck = async () => {
      // On n'exécute le check que si l'utilisateur et les budgets sont là
      // On ajoute la sécurité isRunningCheck pour éviter les doublons SI le check est déjà en cours
      if (!user || budgets.length === 0 || isRunningCheck.current) return;

      const lastCheck = localStorage.getItem('lastMonthlyCheck');
      const today = new Date().toDateString();

      // Si déjà fait aujourd'hui, on ne refait pas
      if (lastCheck === today) return;

      // VERROU DE SESSION : On marque comme "en cours" immédiatement
      isRunningCheck.current = true;

      try {
        // VERROU PERSISTANT : On marque comme "fait" AVANT le await
        // Comme ça, si une autre instance du useEffect se lance pendant le 'await',
        // elle verra que c'est déjà fait et s'arrêtera.
        localStorage.setItem('lastMonthlyCheck', today);

        await checkMonthlyTriggers(user.id, expenses, incomes);
      } catch (error) {
        console.error('Erreur lors du check mensuel :', error);
        // En cas d'erreur seulement, on permet de réessayer
        localStorage.removeItem('lastMonthlyCheck');
      } finally {
        isRunningCheck.current = false;
      }
    };

    runMonthlyCheck();
  }, [user, expenses, incomes, budgets]);

  const HandleBudget = (id: string) => {
    navigate(`/h/budgets/${id}`);
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen px-6 py-8 text-[#1f1f1f] dark:text-neutral-100 md:px-16 transition-colors duration-500">
      <SEO
        title="Tableau de bord - Xpense"
        description="Vue d'ensemble de vos finances personnelles, budgets et dernières transactions."
      />
      <h1 className="text-4xl md:text-6xl font-extrabold mb-10 tracking-tight">
        Bienvenue, <span className="text-[#3170dd]">{user.name} !</span>
      </h1>
      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10 px-4">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
              Prêt à économiser ?
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
              Créez votre premier budget en quelques secondes pour reprendre le contrôle de vos
              finances.
            </p>
          </div>
          <div className="w-full max-w-lg">
            <BudgetForm />
          </div>
        </div>
      ) : (
        <>
          {/* Section Configuration Budgets */}
          <div className="mb-12 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-all duration-300">
            <button
              onClick={() => setShowBudgetForm(!showBudgetForm)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Settings size={22} />
                </div>
                <div className="text-left">
                  <h2 className="lg:text-xl text-lg font-bold">Gestion des catégories</h2>
                  <p className="text-sm text-neutral-500 hidden sm:block">
                    Configurez vos plafonds et objectifs d'épargne
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#3170dd] font-bold">
                <span className="hidden sm:inline">
                  {showBudgetForm ? 'Fermer' : 'Nouvelle catégorie'}
                </span>
                {showBudgetForm ? <ChevronUp size={24} /> : <Plus size={24} />}
              </div>
            </button>

            <AnimatePresence>
              {showBudgetForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <div className="max-w-2xl mx-auto">
                      <BudgetForm standalone={false} onSuccess={() => setShowBudgetForm(false)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions Quotidiennes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-full">
              <ExpenseForm budget={null} />
            </div>
            <div className="h-full">
              <IncomeForm budget={null} />
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Vos catégories</h2>
              <Link
                to="/h/budgets"
                className="text-neutral-500 dark:text-neutral-400 text-sm font-semibold hover:text-[#3170dd] dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                Toutes
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayBudgets.map((budget, index) => {
                const spent = getExpenseBudget(budget.id);
                const added = getIncomeBudget(budget.id);

                // Affichage différent selon le type
                if (budget.type === 'capped') {
                  // BUDGET PLAFONNÉ
                  const restant = (budget.amount || 0) - spent + added;
                  const total = (budget.amount || 0) + added;
                  const percentage = total > 0 ? (spent / total) * 100 : 0;

                  return (
                    <div
                      key={budget.id}
                      className={`rounded-lg p-6 border flex flex-col gap-4 ${
                        restant < 0
                          ? 'border-red-500/50 bg-red-50/10 text-red-700 dark:text-red-400'
                          : 'border-blue-500/50 bg-blue-50/10 text-[#3170dd] dark:text-blue-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 w-fit">
                            Plafonné
                          </span>
                          <h3 className="text-lg font-semibold">{budget.name}</h3>
                        </div>
                        <p className="text-lg font-semibold">
                          Max. {formatCurrency(budget.amount || 0)}
                        </p>
                      </div>
                      <Progressbar
                        spent={percentage}
                        state={restant > 0 ? true : false}
                        even={index % 2 === 0 ? false : true}
                      />
                      <div className="flex justify-between text-sm mt-4">
                        <div className="flex flex-col justify-center items-start gap-2">
                          <p className={restant < 0 ? 'text-red-600' : 'text-blue-600'}>
                            {formatCurrency(spent)} dépensé
                          </p>
                          <p className="text-neutral-500">{formatCurrency(added)} ajouté</p>
                        </div>
                        <p className={restant < 0 ? 'text-red-700 font-bold' : 'text-neutral-500'}>
                          {formatCurrency(restant)} restant
                        </p>
                      </div>
                      <div className="text-sm text-center font-medium">
                        {restant > 0 ? (
                          <span className="text-green-600 dark:text-green-400">
                            Dans les limites
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 font-bold">
                            Budget dépassé
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => HandleBudget(budget.id)}
                        className={`mt-2 flex items-center justify-center cursor-pointer gap-2 rounded px-4 py-2 text-white hover:opacity-90 transition-colors ${
                          restant < 0 ? 'bg-red-600' : 'bg-[#3170dd]'
                        }`}
                      >
                        <Info size={18} />
                        <span>Détails</span>
                      </button>
                    </div>
                  );
                } else if (budget.type === 'savings') {
                  // BUDGET ÉPARGNE
                  const totalExpenses = getExpenseBudget(budget.id);
                  const totalIncomes = getIncomeBudget(budget.id);
                  const currentSaved = totalIncomes - totalExpenses;
                  const goal = budget.amount || 0;
                  const percentage = goal > 0 ? (currentSaved / goal) * 100 : 0;
                  const remainingToGoal = Math.max(0, goal - currentSaved);

                  return (
                    <div
                      key={budget.id}
                      className="rounded-lg p-6 border border-emerald-500/50 dark:border-emerald-400/50 flex flex-col gap-4 bg-emerald-50/10 dark:bg-emerald-900/10"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 w-fit">
                            Épargne
                          </span>
                          <h3 className="text-lg font-semibold">{budget.name}</h3>
                        </div>
                        <p className="text-lg font-semibold">
                          Obj. {formatCurrency(budget.amount || 0)}
                        </p>
                      </div>
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
                            (Revenus: {formatCurrency(totalIncomes)} - Dépenses:{' '}
                            {formatCurrency(totalExpenses)})
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-center font-medium">
                        {currentSaved >= goal ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            Objectif atteint !
                          </span>
                        ) : (
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Reste {formatCurrency(remainingToGoal)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => HandleBudget(budget.id)}
                        className="mt-2 flex items-center justify-center cursor-pointer gap-2 rounded px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                      >
                        <Info size={18} />
                        <span>Détails</span>
                      </button>
                    </div>
                  );
                } else {
                  // CATÉGORIE DE SUIVI
                  return (
                    <div
                      key={budget.id}
                      className="rounded-lg p-6 border border-neutral-400 dark:border-neutral-600 flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 w-fit">
                            Suivi
                          </span>
                          <h3 className="text-lg font-semibold">{budget.name}</h3>
                        </div>
                      </div>

                      <div className="text-center py-4">
                        <p className="text-4xl font-bold text-[#3170dd]">{formatCurrency(spent)}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          dépensé ce mois-ci
                        </p>
                      </div>

                      {added > 0 && (
                        <div className="text-sm text-center text-neutral-600 dark:text-neutral-400">
                          + {formatCurrency(added)} ajouté
                        </div>
                      )}

                      <div className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                        Aucune limite fixée • Analyse des tendances
                      </div>

                      <button
                        onClick={() => HandleBudget(budget.id)}
                        className="mt-2 flex items-center justify-center cursor-pointer gap-2 rounded px-4 py-2 text-white bg-neutral-600 hover:bg-neutral-700 transition-colors"
                      >
                        <Info size={18} />
                        <span>Détails</span>
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Transactions récentes</h2>
            <div>
              <Table expenses={visibleExpenses} incomes={visibleIncomes} />
              {(expenses.length > 5 || incomes.length > 5) && (
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
        </>
      )}
    </main>
  );
};

export default HomePage;
