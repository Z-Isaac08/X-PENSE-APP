import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import { useUserStore } from "./stores/userStore";

const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

const App = () => {
  const { user } = useUserStore();

  return (
    <>
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
          </Routes>
        </Layout>
        <ToastContainer />
      </Suspense>
    </>
  );
};

export default App;
