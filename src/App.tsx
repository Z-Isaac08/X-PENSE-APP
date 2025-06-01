import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import { useUserStore } from "./stores/userStore";
import { useThemeStore } from "./stores/ThemeStore";

const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

const App = () => {
  const { user } = useUserStore();
  const { isDarkMode } = useThemeStore();

  return (
    <main className={isDarkMode ? 'bg-theme-dark' : 'bg-theme-light'}>
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
              element={
                user ? <Navigate to={`/h`} /> : <RegisterPage />
              }
            />
            <Route path="/h/" element={<HomePage />} />
            <Route
              path="/h/budgets/:budgetID"
              element={<BudgetPage />}
            />
            <Route
              path="/h/dashboard"
              element={<DashboardPage />}
            />
          </Routes>
        </Layout>
        <ToastContainer />
      </Suspense>
    </main>
  );
};

export default App;
