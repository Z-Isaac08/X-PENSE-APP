import { useEffect, useState } from "react";
import { useBudgetStore } from "../../stores/budgetStore";
import { useExpenseStore } from "../../stores/expenseStore";
import { useIncomeStore } from "../../stores/incomeStore";
import { useUserStore } from "../../stores/userStore";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { useNotificationStore } from "../../stores/notificationStore";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();
  const { getAllBudgets } = useBudgetStore();
  const { getAllExpenses } = useExpenseStore();
  const { getAllIncomes } = useIncomeStore();
  const { AllNotifications } = useNotificationStore()

  const [loading, setLoading] = useState(user !== null); // chargement uniquement si user est présent

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false); // important : sinon la page reste bloquée
        return;
      }

      try {
        await Promise.all([
          getAllBudgets(user.id),
          getAllExpenses(user.id),
          getAllIncomes(user.id),
          AllNotifications(user.id)
        ]);
      } catch (err) {
        console.error("Erreur de chargement global :", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [AllNotifications, getAllBudgets, getAllExpenses, getAllIncomes, user]);

  if (loading) return <p className="text-center py-20">Chargement...</p>;

  return (
    <section className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow h-full">{children}</main>
      <Footer />
    </section>
  );
};

export default Layout;
