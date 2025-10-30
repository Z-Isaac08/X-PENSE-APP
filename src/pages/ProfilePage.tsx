import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2, Lock, LogOut, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useAuthStore } from "../stores/authStore";

const ProfilePage = () => {
  const { user, userProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(userProfile?.name || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingName, setLoadingName] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Mettre à jour le nom
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile) return;

    if (name.trim() === "") {
      toast.error("Le nom ne peut pas être vide.");
      return;
    }

    setLoadingName(true);
    try {
      // Mettre à jour Firebase Auth
      await updateProfile(user, { displayName: name });

      // Mettre à jour Firestore
      const userDocRef = doc(db, "users", userProfile.uid);
      await updateDoc(userDocRef, { name });

      toast.success("Nom mis à jour avec succès !");
    } catch (error: any) {
      console.error("Error updating name:", error);
      toast.error("Erreur lors de la mise à jour du nom.");
    } finally {
      setLoadingName(false);
    }
  };

  // Mettre à jour l'email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile) return;

    if (email.trim() === "" || !email.includes("@")) {
      toast.error("Email invalide.");
      return;
    }

    setLoadingEmail(true);
    try {
      // Mettre à jour Firebase Auth
      await updateEmail(user, email);

      // Mettre à jour Firestore
      const userDocRef = doc(db, "users", userProfile.uid);
      await updateDoc(userDocRef, { email });

      toast.success("Email mis à jour avec succès !");
    } catch (error: any) {
      console.error("Error updating email:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error(
          "Pour des raisons de sécurité, veuillez vous reconnecter avant de changer votre email."
        );
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Cet email est déjà utilisé.");
      } else {
        toast.error("Erreur lors de la mise à jour de l'email.");
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  // Mettre à jour le mot de passe
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (newPassword.length < 6) {
      toast.error(
        "Le nouveau mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoadingPassword(true);
    try {
      await updatePassword(user, newPassword);

      toast.success("Mot de passe mis à jour avec succès !");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error(
          "Pour des raisons de sécurité, veuillez vous reconnecter avant de changer votre mot de passe."
        );
      } else {
        toast.error("Erreur lors de la mise à jour du mot de passe.");
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <main className="min-h-screen px-6 py-8 text-[#1f1f1f] dark:text-neutral-100 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Profil</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Gérez vos informations personnelles et vos paramètres de sécurité
        </p>

        <div className="space-y-6">
          {/* Carte Nom */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#3170dd] opacity-20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#3170dd]" />
              </div>
              <h2 className="text-xl font-semibold">Nom complet</h2>
            </div>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded border-[1.8px] border-neutral-400 dark:border-neutral-600 bg-transparent px-4 text-base focus:border-[#3170dd] focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
                placeholder="Votre nom complet"
              />
              <button
                type="submit"
                disabled={loadingName || name === userProfile?.name}
                className="flex items-center gap-2 px-4 py-2 bg-[#3170dd] text-white rounded hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingName ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Mise à jour...</span>
                  </>
                ) : (
                  <span>Mettre à jour le nom</span>
                )}
              </button>
            </form>
          </div>

          {/* Carte Email */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#3170dd] opacity-20 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#3170dd]" />
              </div>
              <h2 className="text-xl font-semibold">Adresse email</h2>
            </div>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded border-[1.8px] border-neutral-400 dark:border-neutral-600 bg-transparent px-4 text-base focus:border-[#3170dd] focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
                placeholder="votre@email.com"
              />
              <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-200 dark:border-yellow-800 rounded p-3 text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Vous devrez peut-être vous reconnecter après avoir changé
                votre email.
              </div>
              <button
                type="submit"
                disabled={loadingEmail || email === userProfile?.email}
                className="flex items-center gap-2 px-4 py-2 bg-[#3170dd] text-white rounded hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingEmail ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Mise à jour...</span>
                  </>
                ) : (
                  <span>Mettre à jour l'email</span>
                )}
              </button>
            </form>
          </div>

          {/* Carte Mot de passe */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#3170dd] opacity-75 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#3170dd]" />
              </div>
              <h2 className="text-xl font-semibold">Mot de passe</h2>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 rounded border-[1.8px] border-neutral-400 dark:border-neutral-600 bg-transparent px-4 text-base focus:border-[#3170dd] focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
                placeholder="Nouveau mot de passe (min. 6 caractères)"
                minLength={6}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 rounded border-[1.8px] border-neutral-400 dark:border-neutral-600 bg-transparent px-4 text-base focus:border-[#3170dd] focus:ring-2 focus:ring-[#3170dd] focus:outline-none transition-all"
                placeholder="Confirmer le nouveau mot de passe"
                minLength={6}
              />
              <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-200 dark:border-yellow-800 rounded p-3 text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Vous devrez peut-être vous reconnecter après avoir changé
                votre mot de passe.
              </div>
              <button
                type="submit"
                disabled={loadingPassword || !newPassword || !confirmPassword}
                className="flex items-center gap-2 px-4 py-2 bg-[#3170dd] text-white rounded hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPassword ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Mise à jour...</span>
                  </>
                ) : (
                  <span>Changer le mot de passe</span>
                )}
              </button>
            </form>
          </div>

          {/* Carte Déconnexion */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-red-200 dark:border-red-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold">Déconnexion</h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Déconnectez-vous de votre compte sur cet appareil.
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
            >
              <LogOut size={18} />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
