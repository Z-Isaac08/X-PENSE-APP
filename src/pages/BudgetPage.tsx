import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import ExpenseForm from "../components/expenseForm/ExpenseForm";
import Progressbar from "../components/progressBar/Progressbar";
import Table from "../components/table/Table";
import { deleteBudget, getBudgetsbyID } from "../services/budgetHelper";
import {
  getExpenseBudget,
  getExpensesByBudget,
} from "../services/expenseHelper";

const BudgetPage = () => {
  const { userID, budgetID } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [spent, setSpent] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" />;
  }

  const fetchExpenses = async () => {
    try {
      const expensesData = await getExpensesByBudget(user.id, budgetID);
      const budgetData = await getBudgetsbyID(user.id, budgetID);
      const spent = await getExpenseBudget(user.id, budgetID);
      setExpenses(expensesData);
      setBudget(budgetData);
      setSpent(spent);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user.id, budgetID]);

  const handleDelete = async () => {
    try {
      await deleteBudget(user.id, budgetID);
      toast.success("Catégorie supprimée");
      navigate(`/h/${user.id}`);
    } catch (error) {
      toast.error("Échec lors de la suppression");
    }
  };

  if (!budget) {
    return <div className="p-8 text-lg text-center">Chargement...</div>;
  }

  return (
    <main className="p-8 sm:p-6 md:p-10 lg:p-14 h-full space-y-8">
      <h1 className="text-5xl md:text-7xl font-bold">
        <span className="text-[#3170dd]">{budget.name}</span> Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 flex flex-col gap-5 justify-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{budget.name}</h3>
            <p className="text-lg font-medium">{budget.amount} FCFA</p>
          </div>
          <Progressbar spent={(spent / budget.amount) * 100} />
          <div className="flex justify-between text-sm mt-4">
            <p>{spent} dépensé</p>
            <p>{budget.amount - spent} FCFA restant</p>
          </div>
          <button
            onClick={handleDelete}
            className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
          >
            <Trash className="w-4 h-4" />
            Supprimer
          </button>
        </div>

        <ExpenseForm budgets={[budget]} onExpense={fetchExpenses} />
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Dépenses récentes</h2>
        <Table expenses={expenses} onTable={fetchExpenses} />
      </div>
    </main>
  );
};

export default BudgetPage;
