import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Illustration from "../assets/illustration.svg";
import { useAuthStore } from "../stores/authStore";

const RegisterPage = () => {
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

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
    } else if (password.length < 8) {
      setPasswordError("Recommandé : 8+ caractères");
    } else {
      setPasswordError("");
    }
  };

  // Validation confirmation mot de passe
  const validateConfirmPassword = (confirmPwd: string) => {
    if (!confirmPwd) {
      setConfirmPasswordError("");
      return;
    }
    if (confirmPwd !== password) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      toast.success(`Bienvenue ${name} !`);
      navigate("/h");
    } catch (error: any) {
      console.error("Error registering:", error);
      if (error.message.includes("email-already-in-use")) {
        toast.error("Cet email est déjà utilisé.");
      } else if (error.message.includes("invalid-email")) {
        toast.error("Email invalide.");
      } else if (error.message.includes("weak-password")) {
        toast.error("Mot de passe trop faible.");
      } else {
        toast.error("Erreur lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex md:flex-row flex-col items-center justify-center md:items-start md:justify-start md:pt-20 lg:pt-24 p-6 md:p-12 lg:p-16 h-screen overflow-hidden gap-8 lg:gap-16 text-[#1f1f1f] dark:text-neutral-100">
      <form
        onSubmit={handleSubmit}
        className="flex w-full md:w-1/2 lg:max-w-xl flex-col text-center md:text-left"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center md:text-left leading-tight">
          Prenez le contrôle de votre{" "}
          <span className="text-[#3170dd]">djai</span>
        </h1>
        <p className="pt-4 md:pt-5 text-sm sm:text-base md:text-lg font-light leading-relaxed">
          Avec notre Expense Tracker, suivez vos dépenses facilement,{" "}
          <span className="hidden sm:inline"><br /></span>
          <span className="sm:hidden"> </span>
          établissez des budgets efficaces et optimisez votre gestion financière.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Nom complet */}
          <div>
            <label htmlFor="name" className="sr-only">Nom complet</label>
            <input
              id="name"
              type="text"
              value={name}
              placeholder="Nom complet"
              onChange={(e) => setName(e.target.value)}
              required
              aria-label="Nom complet"
              className="w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] border-neutral-400 bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
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
              className={`w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] ${emailError ? 'border-red-500' : 'border-neutral-400'} bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all`}
            />
            <div role="alert" aria-live="polite">
              {emailError && (
                <p id="email-error" className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="sr-only">Mot de passe</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Mot de passe (min. 6 caractères)"
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                  if (confirmPassword) validateConfirmPassword(confirmPassword);
                }}
                onBlur={() => validatePassword(password)}
                required
                minLength={6}
                aria-label="Mot de passe"
                aria-invalid={passwordError ? "true" : "false"}
                aria-describedby={passwordError ? "password-error" : undefined}
                className={`w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] ${passwordError && password.length < 8 ? 'border-orange-500' : passwordError ? 'border-red-500' : 'border-neutral-400'} bg-transparent px-4 pr-12 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-400 hover:text-[#3170dd] transition"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div role="alert" aria-live="polite">
              {passwordError && (
                <p id="password-error" className={`text-sm mt-1 ${password.length < 8 ? 'text-orange-500' : 'text-red-500'}`}>{passwordError}</p>
              )}
            </div>
          </div>

          {/* Confirmer mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirmer le mot de passe"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword)}
                required
                minLength={6}
                aria-label="Confirmer le mot de passe"
                aria-invalid={confirmPasswordError ? "true" : "false"}
                aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                className={`w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] ${confirmPasswordError ? 'border-red-500' : 'border-neutral-400'} bg-transparent px-4 pr-12 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-400 hover:text-[#3170dd] transition"
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div role="alert" aria-live="polite">
              {confirmPasswordError && (
                <p id="confirm-password-error" className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !!emailError || !!passwordError || !!confirmPasswordError}
          className="mt-6 flex items-center justify-center md:justify-start gap-2 rounded w-full md:w-fit bg-[#1f1f1f] dark:bg-white dark:text-[#1f1f1f] px-6 py-3 text-base md:text-lg text-white cursor-pointer hover:opacity-90 transition-all duration-300 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Inscription...</span>
            </>
          ) : (
            <>
              <UserPlus size={20} />
              <span>Créer mon compte</span>
            </>
          )}
        </button>

        <p className="mt-6 md:mt-8 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-[#3170dd] hover:underline font-medium"
          >
            Se connecter
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

export default RegisterPage;
