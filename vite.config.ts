import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Permet l'accès depuis n'importe quel appareil sur le réseau
    port: 5173, // Le port utilisé par défaut par Vite
  },
  plugins: [react(), tailwindcss()],
});
