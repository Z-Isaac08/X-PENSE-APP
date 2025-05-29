import { create } from "zustand";

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  const savedTheme = localStorage.getItem("theme") === "dark";

  // Appliquer la classe "dark" dès le chargement si nécessaire
  if (savedTheme) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return {
    isDarkMode: savedTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = !state.isDarkMode;
        if (newTheme) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
        return { isDarkMode: newTheme };
      }),
  };
});
