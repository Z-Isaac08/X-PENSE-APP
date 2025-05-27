import { Trash } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import ExpenseForm from "../components/expenseForm/ExpenseForm";
import Progressbar from "../components/progressBar/Progressbar";
import Table from "../components/table/Table";
import { useExpenseStore } from "../stores/expenseStore";
import { useUserStore } from "../stores/userStore";
import { useBudgetStore } from "../stores/budgetStore";

const BudgetPage = () => {
  const { budgetID } = useParams();
  const { expenses, getAllExpenses, getExpenseBudget } = useExpenseStore();
  const { getAllBudgets, getBudgetById, deleteBudget } = useBudgetStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllBudgets(user!.id);
        await getAllExpenses(user!.id);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchData();
  }, [getAllBudgets, getAllExpenses, user]);
  
  const budget = getBudgetById(budgetID);
  const spent = getExpenseBudget(budgetID);
  
  if (!user) {
    return <Navigate to="/" />;
  }
  const handleDelete = async () => {
    try {
      if (!budgetID) return;
      await deleteBudget(user.id, budgetID);
      toast.success("Catégorie supprimée");
      navigate(`/h`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <p>{spent} FCFA dépensé</p>
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

        <ExpenseForm budget={budget} />
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Dépenses récentes</h2>
        <Table expenses={expenses.filter((e) => e.budget === budgetID)} />
      </div>
    </main>
  );
};

export default BudgetPage;
