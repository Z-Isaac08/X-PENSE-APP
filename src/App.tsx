import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";

const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

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
                user ? <Navigate to={`/h/${user.id}`} /> : <RegisterPage />
              }
            />
            <Route path="/h/:userId" element={<HomePage />} />
            <Route
              path="/h/:userId/budgets/:budgetID"
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
