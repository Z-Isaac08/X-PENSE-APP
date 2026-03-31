import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Logo from "../assets/logo.svg";
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

  const validateEmail = (email: string) => {
    if (!email) { setEmailError(""); return; }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(regex.test(email) ? "" : "Email invalide");
  };

  const validatePassword = (password: string) => {
    if (!password) { setPasswordError(""); return; }
    setPasswordError(password.length < 6 ? "Minimum 6 caractères" : "");
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
      const from = (location.state as any)?.from?.pathname || "/h";
      navigate(from, { replace: true });
    } catch (error: any) {
      if (error.message.includes("invalid-credential") || error.message.includes("user-not-found")) {
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
    <main className="relative min-h-screen flex items-center justify-center bg-neutral-950 overflow-hidden px-4 py-12">
      <SEO
        title="Connexion - Xpense"
        description="Connectez-vous à votre espace Xpense pour gérer votre budget."
      />

      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <img src={Logo} alt="Xpense Logo" className="h-8" />
          <span className="text-2xl font-black tracking-tight text-white">
            <span className="text-[#3170dd]">X</span>pense
          </span>
        </div>

        {/* Glass card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          <h1 className="text-3xl font-black text-white leading-tight mb-2">
            Bon retour sur{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3170dd] via-blue-400 to-indigo-400">
              Xpense
            </span>
          </h1>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            Connectez-vous pour accéder à vos données financières depuis n'importe quel appareil.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                onBlur={() => validateEmail(email)}
                required
                aria-label="Email"
                aria-invalid={emailError ? "true" : "false"}
                aria-describedby={emailError ? "email-error" : undefined}
                className={`w-full h-12 rounded-xl bg-white/8 border ${emailError ? "border-red-500/70" : "border-white/10"} text-white placeholder-neutral-500 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3170dd]/60 focus:border-transparent transition-all`}
              />
              <div role="alert" aria-live="polite">
                {emailError && <p id="email-error" className="text-red-400 text-xs mt-1.5 ml-1">{emailError}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Mot de passe"
                  onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }}
                  onBlur={() => validatePassword(password)}
                  required
                  minLength={6}
                  aria-label="Mot de passe"
                  aria-invalid={passwordError ? "true" : "false"}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  className={`w-full h-12 rounded-xl bg-white/8 border ${passwordError ? "border-red-500/70" : "border-white/10"} text-white placeholder-neutral-500 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#3170dd]/60 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#3170dd] transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div role="alert" aria-live="polite">
                {passwordError && <p id="password-error" className="text-red-400 text-xs mt-1.5 ml-1">{passwordError}</p>}
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link to="/forgot-password" className="text-xs text-[#3170dd] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!emailError || !!passwordError}
              className="mt-2 w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#3170dd] hover:bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /><span>Connexion...</span></>
              ) : (
                <><LogIn size={18} /><span>Se connecter</span></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-[#3170dd] hover:underline font-semibold">
              Créer un compte
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginPage;
