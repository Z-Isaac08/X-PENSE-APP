import { Bell, ChartNoAxesCombined, House, SunMoon, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import Logo from '../../assets/logo.svg';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { useThemeStore } from '../../stores/ThemeStore';

const NavBar = () => {
  const { user } = useAuthStore();
  const { toggleTheme } = useThemeStore();
  const { notifications } = useNotificationStore();
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 md:p-10 gap-4 sm:gap-5 text-[#1f1f1f] dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-700">
      {/* Logo et Titre */}
      <div
        className="flex items-center cursor-pointer gap-3"
        onClick={() => navigate(user ? '/h' : '/')}
      >
        <img src={Logo} className="h-8" alt="Logo" />
        <p className="md:text-3xl text-xl font-bold">
          <span className="text-[#3170dd]">X</span>pense
        </p>
      </div>

      {/* Actions Utilisateur */}
      {user && (
        <div className="flex items-center gap-4">
          {/* Accueil */}
          <button
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            onClick={() => navigate('/h')}
          >
            <House className="w-5 h-5" />
          </button>

          {/* Dashboard */}
          <button
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            onClick={() => navigate('/h/dashboard')}
          >
            <ChartNoAxesCombined className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              onClick={() => navigate('/h/notifications')}
            >
              <Bell className="w-5 h-5" />
            </button>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Chatbot Financier (Masqué temporairement)
          <button
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            onClick={() => navigate('/h/chat')}
          >
            <Bot className="w-5 h-5" />
          </button>
          */}

          {/* Thème */}
          <button
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            onClick={toggleTheme}
            title="Changer le thème"
          >
            <SunMoon className="w-5 h-5" />
          </button>

          {/* Profil */}
          <button
            className="flex items-center gap-2 border border-neutral-400 dark:border-neutral-600 hover:border-[#3170dd] hover:bg-[#3170dd] hover:text-white rounded-sm px-3 py-2 transition text-sm md:text-base"
            onClick={() => navigate('/h/profile')}
            title="Mon profil"
          >
            <User className="w-5 h-5" />
            <span className="font-extralight hidden md:block">Profil</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
