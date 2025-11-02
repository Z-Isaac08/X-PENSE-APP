import { create } from "zustand";

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  const savedTheme = localStorage.getItem("theme") === "dark";

  // Appliquer le data-theme dès le chargement
  document.documentElement.setAttribute("data-theme", savedTheme ? "dark" : "light");

  return {
    isDarkMode: savedTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = !state.isDarkMode;
        document.documentElement.setAttribute("data-theme", newTheme ? "dark" : "light");
        localStorage.setItem("theme", newTheme ? "dark" : "light");
        return { isDarkMode: newTheme };
      }),
  };
});
