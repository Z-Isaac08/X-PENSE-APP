import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import Logo from "../assets/logo.svg";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "" || !email.includes("@")) {
      toast.error("Veuillez entrer un email valide.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success("Email de réinitialisation envoyé !");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") toast.error("Aucun compte associé à cet email.");
      else if (error.code === "auth/too-many-requests") toast.error("Trop de tentatives. Réessayez plus tard.");
      else toast.error("Erreur lors de l'envoi de l'email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-neutral-950 overflow-hidden px-4 py-12">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

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
          {/* Back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-[#3170dd] transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            <span>Retour à la connexion</span>
          </Link>

          {!emailSent ? (
            <>
              <h1 className="text-3xl font-black text-white leading-tight mb-2">
                Mot de passe{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3170dd] via-blue-400 to-indigo-400">
                  oublié ?
                </span>
              </h1>
              <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="votre@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email"
                    className="w-full h-12 rounded-xl bg-white/8 border border-white/10 text-white placeholder-neutral-500 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3170dd]/60 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#3170dd] hover:bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /><span>Envoi...</span></>
                  ) : (
                    <><Mail size={18} /><span>Envoyer le lien</span></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-black text-white leading-tight mb-2">
                Email{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                  envoyé !
                </span>
              </h1>
              <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                Un email de réinitialisation a été envoyé à{" "}
                <span className="font-semibold text-[#3170dd]">{email}</span>.{" "}
                Vérifiez votre boîte de réception et suivez les instructions.
              </p>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-300 text-sm mb-1">Email envoyé avec succès</h3>
                  <p className="text-xs text-emerald-400/70 leading-relaxed">
                    Si vous ne voyez pas l'email, vérifiez votre dossier spam ou courrier indésirable.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { setEmailSent(false); setEmail(""); }}
                className="text-xs text-neutral-500 hover:text-[#3170dd] transition-colors"
              >
                Renvoyer l'email
              </button>
            </motion.div>
          )}

          <p className="mt-6 text-center text-xs text-neutral-500">
            Vous vous souvenez de votre mot de passe ?{" "}
            <Link to="/login" className="text-[#3170dd] hover:underline font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default ForgotPasswordPage;
