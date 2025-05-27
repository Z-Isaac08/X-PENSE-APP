import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import BudgetForm from "../components/BudgetForm/budgetForm";
import ExpenseForm from "../components/expenseForm/ExpenseForm";
import Progressbar from "../components/progressBar/Progressbar";
import Table from "../components/table/Table";
import { getAllBudgets } from "../services/budgetHelper";
import { getAllExpenses, getBudgetExpenses } from "../services/expenseHelper";

const HomePage = () => {
  const { userId } = useParams();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchBudgets = async () => {
    if (!userId) return;

    try {
      await getAllBudgets(userId);
      const expensesData = await getAllExpenses(userId);
      const budgetsWithExpenses = await getBudgetExpenses(userId);
      setBudgets(budgetsWithExpenses);
      setExpenses(expensesData);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const HandleBudget = (id) => {
    navigate(`/h/${userId}/budgets/${id}`);
  };

  useEffect(() => {
    fetchBudgets();
  }, [userId]);

  if (!user || user.id !== userId) {
    return <Navigate to="/" />;
  }

  return (
    <main className="min-h-screen px-6 py-8 text-neutral-900 md:px-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">
        Bienvenue, <span className="text-blue-600">{user.name} !</span>
      </h1>
      {budgets.length === 0 ? (
        <div className="w-auto h-auto">
          <BudgetForm onBudget={fetchBudgets} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BudgetForm onBudget={fetchBudgets} />
            <ExpenseForm budgets={budgets} onExpense={fetchBudgets} />
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
                      ? "border-neutral-900 text-neutral-900"
                      : "border-blue-600 text-blue-600"
                  } flex flex-col gap-4`}
                >
                  <div className="flex justify-between text-lg font-semibold">
                    <h3>{budget.name}</h3>
                    <p>{budget.amount} FCFA</p>
                  </div>
                  <Progressbar spent={(budget.spent / budget.amount) * 100} />
                  <div className="flex justify-between text-sm">
                    <p>{budget.spent} dépensé</p>
                    <p>{budget.amount - budget.spent} restant</p>
                  </div>
                  <button
                    onClick={() => HandleBudget(budget.id)}
                    className={`mt-2 flex items-center justify-center gap-2 rounded px-4 py-2 text-white ${
                      index % 2 === 0 ? "bg-neutral-900" : "bg-blue-600"
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
              <Table expenses={expenses} onTable={fetchBudgets} />
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default HomePage;
