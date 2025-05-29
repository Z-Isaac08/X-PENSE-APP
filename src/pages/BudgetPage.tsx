import { Trash } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import ExpenseForm from "../components/expenseForm/ExpenseForm";
import IncomeForm from "../components/incomeForm/incomeForm";
import Progressbar from "../components/progressBar/Progressbar";
import Table from "../components/table/Table";
import { useBudgetStore } from "../stores/budgetStore";
import { useExpenseStore } from "../stores/expenseStore";
import { useIncomeStore } from "../stores/incomeStore";
import { useUserStore } from "../stores/userStore";

const BudgetPage = () => {
  const { budgetID } = useParams();
  const { expenses, getAllExpenses, getExpenseBudget } = useExpenseStore();
  const { incomes, getAllIncomes, getIncomeBudget } = useIncomeStore();
  const { getAllBudgets, getBudgetById, deleteBudget } = useBudgetStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllBudgets(user!.id);
        await getAllExpenses(user!.id);
        await getAllIncomes(user!.id);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchData();
  }, [getAllBudgets, getAllExpenses, getAllIncomes, user]);

  const budget = getBudgetById(budgetID);
  const spent = getExpenseBudget(budgetID);
  const added = getIncomeBudget(budgetID);
  const restant = budget!.amount + added - spent;
  const dangerClass =
    restant > 0 ? "dark:text-neutral-100" : "dark:text-[#e33131]";

  if (!user) {
    return <Navigate to="/" />;
  }
  const handleDelete = async () => {
    try {
      if (!budgetID) return;
      await deleteBudget(user.id, budgetID);
      toast.success("Catégorie supprimée");
      navigate(`/h`);
    } catch {
      toast.error("Échec lors de la suppression");
    }
  };

  if (!budget) {
    return <div className="p-8 text-lg text-center">Chargement...</div>;
  }

  return (
    <main className="p-8 sm:p-6 md:p-10 lg:p-14 h-full space-y-8 text-[#1f1f1f] dark:text-neutral-100">
      <h1 className="text-5xl md:text-7xl font-bold">
        Aperçu de <span className="text-[#3170dd]">{budget.name}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 flex flex-col gap-5 justify-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${dangerClass}`}>
              {budget.name}
            </h3>
            <p className={`text-lg font-medium ${dangerClass}`}>
              {budget.amount} FCFA
            </p>
          </div>
          <Progressbar
            spent={(spent / (budget.amount + added)) * 100}
            state={restant > 0 ? true : false}
          />
          <div className="flex justify-between text-sm mt-4">
            <div className="flex flex-col justify-center items-start gap-2">
              <p className={`${dangerClass}`}>{spent} FCFA dépensé</p>
              <p className={`${dangerClass}`}>{added} FCFA ajouté</p>
            </div>
            <p className={`${dangerClass}`}>{restant} FCFA restant</p>
          </div>
          <button
            onClick={handleDelete}
            className="mt-4 flex items-center justify-center gap-2 px-4 cursor-pointer py-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
          >
            <Trash className="w-4 h-4" />
            Supprimer
          </button>
        </div>

        <ExpenseForm budget={budget} />
        <IncomeForm budget={budget} />
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Transactions récentes</h2>
        <Table
          expenses={expenses.filter((e) => e.budget === budgetID)}
          incomes={incomes.filter((e) => e.budget === budgetID)}
        />
      </div>
    </main>
  );
};

export default BudgetPage;
