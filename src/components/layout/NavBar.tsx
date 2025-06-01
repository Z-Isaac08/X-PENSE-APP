import { Bell, Bot, ChartNoAxesCombined, SunMoon, Trash } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Logo from "../../assets/logo.svg";
import { useThemeStore } from "../../stores/ThemeStore";
import { useUserStore } from "../../stores/userStore";

const NavBar = () => {
  const { user, deleteUser } = useUserStore();
  const { toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteUser();
      toast.success("Compte supprimé avec succès");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="w-full flex flex-col md:flex-row items-center justify-between p-5 md:p-10 gap-5 text-[#1f1f1f] dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-700">
      {/* Logo et Titre */}
      <div
        className="flex items-center cursor-pointer gap-3"
        onClick={() => navigate(user ? "/h" : "/")}
      >
        <img src={Logo} className="h-8" alt="Logo" />
        <p className="md:text-3xl text-xl font-bold">
          <span className="text-[#3170dd]">X</span>pense
        </p>
      </div>

      {/* Actions Utilisateur */}
      {user && (
        <div className="flex items-center gap-4">
          {/* Thème */}
          <button
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            onClick={toggleTheme}
          >
            <SunMoon className="w-5 h-5" />
          </button>

          {/* Dashboard */}
          <button
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            onClick={() => navigate("/h/dashboard")}
          >
            <ChartNoAxesCombined className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* Chatbot Financier */}
          <button
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            onClick={() => navigate("/chat")}
          >
            <Bot className="w-5 h-5" />
          </button>

          {/* Supprimer le compte */}
          <button
            className="flex items-center gap-2 border border-[#e33131] bg-[#e331311a] dark:bg-[#e3313140] text-[#e33131] hover:border-none hover:text-white hover:bg-[#e33131] rounded-sm px-3 py-2 transition text-sm md:text-base"
            onClick={handleDelete}
            title="Supprimer ce compte"
          >
            <Trash />
            <span className="font-extralight hidden md:block">Supprimer</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
