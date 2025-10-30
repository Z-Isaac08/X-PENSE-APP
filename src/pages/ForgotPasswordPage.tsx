import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import Illustration from "../assets/illustration.svg";

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
      console.error("Error sending reset email:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("Aucun compte associé à cet email.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Trop de tentatives. Réessayez plus tard.");
      } else {
        toast.error("Erreur lors de l'envoi de l'email.");
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
        <Link
          to="/login"
          className="flex items-center gap-2 text-[#3170dd] hover:underline mb-6 w-fit"
        >
          <ArrowLeft size={20} />
          <span>Retour à la connexion</span>
        </Link>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center md:text-left leading-tight">
          Mot de passe oublié ?
        </h1>
        <p className="pt-4 md:pt-5 text-sm sm:text-base md:text-lg font-light leading-relaxed">
          {emailSent ? (
            <>
              Un email de réinitialisation a été envoyé à{" "}
              <span className="font-semibold text-[#3170dd]">{email}</span>.{" "}
              <span className="hidden sm:inline"><br /></span>
              <span className="sm:hidden"> </span>
              Vérifiez votre boîte de réception et suivez les instructions.
            </>
          ) : (
            <>
              Entrez votre adresse email et nous vous enverrons un lien{" "}
              <span className="hidden sm:inline"><br /></span>
              <span className="sm:hidden"> </span>
              pour réinitialiser votre mot de passe.
            </>
          )}
        </p>

        {!emailSent ? (
          <>
            <div className="mt-6">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="votre@email.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
                className="w-full h-12 sm:h-14 text-center placeholder-neutral-400 sm:text-left rounded border-[1.8px] border-neutral-400 bg-transparent px-4 text-base md:text-lg focus:border-none focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex items-center justify-center md:justify-start gap-2 rounded w-full md:w-fit bg-[#1f1f1f] dark:bg-white dark:text-[#1f1f1f] px-6 py-3 text-base md:text-lg text-white cursor-pointer hover:opacity-90 transition-all duration-300 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <Mail size={20} />
                  <span>Envoyer le lien</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                    Email envoyé avec succès
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Si vous ne voyez pas l'email, vérifiez votre dossier spam ou courrier indésirable.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="text-[#3170dd] hover:underline text-sm"
            >
              Renvoyer l'email
            </button>
          </div>
        )}

        <p className="mt-6 md:mt-8 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          Vous vous souvenez de votre mot de passe ?{" "}
          <Link to="/login" className="text-[#3170dd] hover:underline font-medium">
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

export default ForgotPasswordPage;
