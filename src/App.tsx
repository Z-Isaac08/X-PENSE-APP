import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useThemeStore } from "./stores/ThemeStore";
import { useAuthStore } from "./stores/authStore";
import { syncUserStore } from "./stores/userStore";
import { initializeGroqClient } from "./services/agent/groqClient";

// Chargement du Layout
import Layout from "./components/layout/Layout";

// Chargement dynamiques des pages
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));
const TransactionPage = lazy(() => import("./pages/TransactionPage"));
const ChatBotPage = lazy(() => import("./pages/ChatBotPage"));

const App = () => {
  const { user, loading, initialized, initializeAuth } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  // Initialiser l'authentification au démarrage
  useEffect(() => {
    initializeAuth();
    syncUserStore(); // Synchroniser userStore avec authStore
    
    // Initialiser le client Groq automatiquement
    initializeGroqClient();
  }, [initializeAuth]);

  // Afficher un loader pendant l'initialisation
  if (!initialized || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3170dd] mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <main className={isDarkMode ? "bg-theme-dark" : "bg-theme-light"}>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3170dd]"></div>
          </div>
        }
      >
        <Layout>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/h" /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/h" /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/h" /> : <RegisterPage />}
            />
            <Route
              path="/forgot-password"
              element={user ? <Navigate to="/h" /> : <ForgotPasswordPage />}
            />
            <Route
              path="/h"
              element={user ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/h/profile"
              element={user ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/h/budgets/:budgetID"
              element={user ? <BudgetPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/h/dashboard"
              element={user ? <DashboardPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/h/notifications"
              element={user ? <NotificationPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/h/chat"
              element={user ? <ChatBotPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/h/transactions"
              element={user ? <TransactionPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </Layout>
        <ToastContainer />
      </Suspense>
    </main>
  );
};

export default App;
