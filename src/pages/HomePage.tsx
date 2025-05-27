import { Info } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import BudgetForm from "../components/budgetForm/BudgetForm";
import ExpenseForm from "../components/expenseForm/ExpenseForm";
import Progressbar from "../components/progressBar/Progressbar";
import Table from "../components/table/Table";
import { useBudgetStore } from "../stores/budgetStore";
import { useExpenseStore } from "../stores/expenseStore";
import { useUserStore } from "../stores/userStore";

const HomePage = () => {
  const { budgets, getAllBudgets } = useBudgetStore();
  const { expenses, getAllExpenses, getExpenseBudget } = useExpenseStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatas = async () => {
      if (!user) return;

      try {
        getAllBudgets(user.id);
        getAllExpenses(user.id);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchDatas();
  }, [getAllBudgets, getAllExpenses, user]);

  const HandleBudget = (id: string) => {
    navigate(`/h/budgets/${id}`);
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <main className="min-h-screen px-6 py-8 text-[#1f1f1f] md:px-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">
        Bienvenue, <span className="text-[#3170dd]">{user.name} !</span>
      </h1>
      {budgets.length === 0 ? (
        <div className="w-auto h-auto">
          <BudgetForm />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BudgetForm />
            <ExpenseForm budget={null} />
            {/* Ton futur troisième élément ici */}
            <div className="bg-neutral-100 p-4 rounded-lg">
              Troisième élément (placeholder)
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Catégories récentes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget, index) => (
                <div
                  key={budget.id}
                  className={`rounded-lg p-6 border ${
                    index % 2 === 0
                      ? "border-[#1f1f1f] text-[#1f1f1f]"
                      : "border-blue-600 text-[#3170dd]"
                  } flex flex-col gap-4`}
                >
                  <div className="flex justify-between text-lg font-semibold">
                    <h3>{budget.name}</h3>
                    <p>{budget.amount} FCFA</p>
                  </div>
                  <Progressbar
                    spent={(getExpenseBudget(budget.id) / budget.amount) * 100}
                  />
                  <div className="flex justify-between text-sm">
                    <p>{getExpenseBudget(budget.id)} dépensé</p>
                    <p>{budget.amount - getExpenseBudget(budget.id)} restant</p>
                  </div>
                  <button
                    onClick={() => HandleBudget(budget.id)}
                    className={`mt-2 flex items-center justify-center cursor-pointer gap-2 rounded px-4 py-2 text-white ${
                      index % 2 === 0 ? "bg-[#1f1f1f]" : "bg-[#3170dd]"
                    } hover:opacity-90`}
                  >
                    <Info size={18} />
                    <span>Détails</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Dépenses récentes
            </h2>
            <div>
              <Table expenses={expenses} />
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default HomePage;
