import { Info } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import BudgetForm from "../components/budgetForm/budgetForm";
import ExpenseForm from "../components/expenseForm/ExpenseForm";
import IncomeForm from "../components/incomeForm/incomeForm";
import { checkMonthlyTriggers } from "../components/notifications/checkMonthlyTriggers";
import Progressbar from "../components/progressBar/Progressbar";
import Table from "../components/table/Table";
import { useBudgetStore } from "../stores/budgetStore";
import { useExpenseStore } from "../stores/expenseStore";
import { useIncomeStore } from "../stores/incomeStore";
import { useUserStore } from "../stores/userStore";

import SEO from "../components/SEO";

const HomePage = () => {
  const { budgets } = useBudgetStore();
  const { expenses, getExpenseBudget } = useExpenseStore();
  const { incomes, getIncomeBudget } = useIncomeStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  // Combiner et trier toutes les transactions par date (du plus récent au plus ancien)
  const allTransactions = [
    ...expenses.map((expense) => ({ ...expense, type: "expense" as const })),
    ...incomes.map((income) => ({ ...income, type: "income" as const })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Prendre les 5 plus récentes

  // Séparer à nouveau pour le composant Table
  const visibleExpenses = allTransactions
    .filter((tx) => tx.type === "expense")
    .map(({ type, ...expense }) => expense);

  const visibleIncomes = allTransactions
    .filter((tx) => tx.type === "income")
    .map(({ type, ...income }) => income);

  useEffect(() => {
    const runMonthlyCheck = async () => {
      const lastCheck = localStorage.getItem("lastMonthlyCheck");
      const today = new Date().toDateString();

      if (user && lastCheck !== today) {
        localStorage.setItem("lastMonthlyCheck", today);
        try {
          await checkMonthlyTriggers(user.id, expenses, incomes);
        } catch (error) {
          console.error("Erreur lors du check mensuel :", error);
        }
      }
    };

    runMonthlyCheck();
  }, [user, expenses, incomes]);

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
      <h1 className="text-4xl md:text-6xl font-bold mb-8">
        Bienvenue, <span className="text-[#3170dd]">{user.name} !</span>
      </h1>
      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-700 dark:text-neutral-300">
              Aucun budget pour le moment
            </h2>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-md">
              Commencez par créer votre premier budget pour suivre vos dépenses
              et optimiser votre gestion financière.
            </p>
          </div>
          <div className="w-full max-w-md">
            <BudgetForm />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <BudgetForm />
            </div>
            <div>
              <ExpenseForm budget={null} />
            </div>
            <div>
              <IncomeForm budget={null} />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Catégories récentes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget, index) => {
                const spent = getExpenseBudget(budget.id);
                const added = getIncomeBudget(budget.id);

                // Affichage différent selon le type
                if (budget.type === "capped") {
                  // BUDGET PLAFONNÉ
                  const restant = (budget.amount || 0) - spent + added;
                  const total = (budget.amount || 0) + added;
                  const percentage = total > 0 ? (spent / total) * 100 : 0;

                  return (
                    <div
                      key={budget.id}
                      className={`rounded-lg p-6 border ${
                        index % 2 === 0
                          ? "border-[#1f1f1f] "
                          : "border-[#3170dd] text-[#3170dd]"
                      } ${
                        restant < 0
                          ? "border-[#e33131] dark:border-[#e33131] text-[#e33131]"
                          : "dark:border-neutral-100"
                      } flex flex-col gap-4`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 w-fit">
                            Plafonné
                          </span>
                          <h3 className="text-lg font-semibold">
                            {budget.name}
                          </h3>
                        </div>
                        <p className="text-lg font-semibold">
                          {budget.amount} FCFA
                        </p>
                      </div>
                      <Progressbar
                        spent={percentage}
                        state={restant > 0 ? true : false}
                        even={index % 2 === 0 ? false : true}
                      />
                      <div className="flex justify-between text-sm mt-4">
                        <div className="flex flex-col justify-center items-start gap-2">
                          <p>{spent} FCFA dépensé</p>
                          <p>{added} FCFA ajouté</p>
                        </div>
                        <p>{restant} FCFA restant</p>
                      </div>
                      <div className="text-sm text-center font-medium">
                        {restant > 0 ? (
                          <span className="text-green-600 dark:text-green-400">
                            Dans les limites
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">
                            Budget dépassé
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => HandleBudget(budget.id)}
                        className={`mt-2 flex items-center justify-center cursor-pointer gap-2 rounded px-4 py-2 text-white ${
                          index % 2 === 0 ? "bg-[#1f1f1f]" : "bg-[#3170dd]"
                        }  ${restant < 0 && "bg-[#e33131]"} hover:opacity-90`}
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
                          <h3 className="text-lg font-semibold">
                            {budget.name}
                          </h3>
                        </div>
                      </div>

                      <div className="text-center py-4">
                        <p className="text-4xl font-bold text-[#3170dd]">
                          {spent.toLocaleString()}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          FCFA dépensé ce mois-ci
                        </p>
                      </div>

                      {added > 0 && (
                        <div className="text-sm text-center text-neutral-600 dark:text-neutral-400">
                          + {added} FCFA ajouté
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
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Transactions récentes
            </h2>
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
