import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Illustration from "../assets/illustration.svg";
import { useAuthStore } from "../stores/authStore";

import SEO from "../components/SEO";

const LoginPage = () => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Validation email en temps réel
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("");
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Email invalide");
    } else {
      setEmailError("");
    }
  };

  // Validation mot de passe en temps réel
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Minimum 6 caractères");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);

      toast.success("Connexion réussie !");

      // Redirection intelligente : retour à la page d'origine ou /h
      const from = (location.state as any)?.from?.pathname || "/h";
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Error logging in:", error);
      if (
        error.message.includes("invalid-credential") ||
        error.message.includes("user-not-found")
      ) {
        toast.error("Email ou mot de passe incorrect.");
      } else if (error.message.includes("too-many-requests")) {
        toast.error("Trop de tentatives. Réessayez plus tard.");
      } else {
        toast.error("Erreur lors de la connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex md:flex-row flex-col items-center justify-center md:items-start md:justify-end md:pt-20 lg:pt-24 p-6 md:p-12 lg:p-16 h-screen overflow-hidden gap-8 lg:gap-16 text-[#1f1f1f] dark:text-neutral-100">
      <SEO 
        title="Connexion - Xpense" 
        description="Connectez-vous à votre espace Xpense pour gérer votre budget." 
      />
      <form
        onSubmit={handleSubmit}
        className="flex w-full md:w-1/2 lg:max-w-xl flex-col text-center md:text-left"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center md:text-left leading-tight">
          Bon retour sur <span className="text-[#3170dd]">Xpense</span>
        </h1>
        <p className="pt-4 md:pt-5 text-sm sm:text-base md:text-lg font-light leading-relaxed">
          Connectez-vous pour accéder à vos données financières{" "}
          <span className="hidden sm:inline">
            <br />
          </span>
          <span className="sm:hidden"> </span>
          depuis n'importe quel appareil.
        </p>

        {/* Grid 1 ligne × 2 colonnes */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              required
              aria-label="Email"
              aria-invalid={emailError ? "true" : "false"}
              aria-describedby={emailError ? "email-error" : undefined}
              className={`w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] ${
                emailError ? "border-red-500" : "border-neutral-400"
              } bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all`}
            />
            <div role="alert" aria-live="polite">
              {emailError && (
                <p id="email-error" className="text-red-500 text-sm mt-1">
                  {emailError}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Mot de passe"
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(password)}
                required
                minLength={6}
                aria-label="Mot de passe"
                aria-invalid={passwordError ? "true" : "false"}
                aria-describedby={passwordError ? "password-error" : undefined}
                className={`w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] ${
                  passwordError ? "border-red-500" : "border-neutral-400"
                } bg-transparent px-4 pr-12 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-400 hover:text-[#3170dd] transition"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div role="alert" aria-live="polite">
              {passwordError && (
                <p id="password-error" className="text-red-500 text-sm mt-1">
                  {passwordError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mot de passe oublié */}
        <div className="mt-6 text-center sm:text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-[#3170dd] hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading || !!emailError || !!passwordError}
          className="mt-6 flex items-center justify-center md:justify-start gap-2 rounded w-full md:w-fit bg-[#1f1f1f] dark:bg-white dark:text-[#1f1f1f] px-6 py-3 text-base md:text-lg text-white cursor-pointer hover:opacity-90 transition-all duration-300 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Connexion...</span>
            </>
          ) : (
            <>
              <LogIn size={20} />
              <span>Se connecter</span>
            </>
          )}
        </button>

        <p className="mt-6 md:mt-8 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            className="text-[#3170dd] hover:underline font-medium"
          >
            Créer un compte
          </Link>
        </p>
      </form>

      <div className="hidden md:flex items-center justify-center flex-1">
        <img
          src={Illustration}
          className="w-full max-w-md lg:max-w-lg xl:max-w-2xl h-auto object-contain"
          alt="Illustration"
        />
      </div>
    </main>
  );
};

export default LoginPage;
