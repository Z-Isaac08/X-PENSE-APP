import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useThemeStore } from "./stores/ThemeStore";
import { useUserStore } from "./stores/userStore";

// Chargement du Layout
import Layout from "./components/layout/Layout";

// Chargement dynamiques des pages
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));
const TransactionPage = lazy(() => import("./pages/TransactionPage"));

const App = () => {
  const { user } = useUserStore();
  const { isDarkMode } = useThemeStore();

  return (
    <main className={isDarkMode ? "bg-theme-dark" : "bg-theme-light"}>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            Loading
          </div>
        }
      >
        <Layout>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to={`/h`} /> : <RegisterPage />}
            />
            <Route path="/h/" element={<HomePage />} />
            <Route path="/h/budgets/:budgetID" element={<BudgetPage />} />
            <Route path="/h/dashboard" element={<DashboardPage />} />
            <Route path="/h/notifications" element={<NotificationPage />} />
            <Route path="/h/transactions" element={<TransactionPage />} />
          </Routes>
        </Layout>
        <ToastContainer />
      </Suspense>
    </main>
  );
};

export default App;
