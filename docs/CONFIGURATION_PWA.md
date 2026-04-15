# Configuration PWA pour X-Pense App

Puisque le projet est basé sur **Vite** et **React**, la méthode la plus recommandée et la plus propre pour le transformer en Progressive Web App (PWA) est d'utiliser le plugin officiel `vite-plugin-pwa`. Ce plugin se charge de générer automatiquement le Service Worker (via Workbox) et le fichier `manifest.webmanifest`.

Voici le processus étape par étape pour configurer ce projet en PWA :

## Étape 1 : Installation des dépendances

Ajoutez le module `vite-plugin-pwa` en tant que dépendance de développement :

```bash
npm install -D vite-plugin-pwa
```

## Étape 2 : Ajout des icônes dans `public/`

Une PWA nécessite des icônes spécifiques pour s'afficher correctement sur les différents appareils (Android, iOS, Windows...). Vous devrez créer et placer les fichiers suivants dans le dossier `public/` du projet :

- `pwa-192x192.png`
- `pwa-512x512.png`
- `pwa-512x512-maskable.png` (pour que l'icône s'adapte aux formes du système sur Android)
- `apple-touch-icon.png` (180x180 png, spécifiquement pour iOS)

## Étape 3 : Configuration de `vite.config.ts`

Importez et ajoutez le plugin `VitePWA` dans le tableau des plugins de votre fichier `vite.config.ts`. Cette configuration contiendra les métadonnées de votre application.

```typescript
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Met automatiquement la PWA à jour quand un nouveau build est dispo
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Actifs à mettre en cache
      manifest: {
        name: 'X-Pense App',
        short_name: 'XPense',
        description: 'Application de gestion de dépenses performante et intuitive',
        theme_color: '#0f172a', // Assorti au mode sombre (dark:bg-slate-900)
        background_color: '#0f172a',
        display: 'standalone', // Permet un affichage plein écran natif
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
```

## Étape 4 : Mise à jour de `index.html`

Il faut ajouter quelques balises `<meta>` et `<link>` dans le pavé `<head>` de votre fichier `index.html` pour renforcer l'intégration mobile :

```html
<meta name="theme-color" content="#0f172a" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

## Étape 5 : Gérer l'état de la mise à jour (Optionnel)

Si vous souhaitez informer vos utilisateurs lorsqu'une mise à jour de la PWA est disponible, `vite-plugin-pwa` fournit une API prête à l'emploi (via `virtual:pwa-register`). Vous pourriez créer un composant React qui écoute ces événements et affiche un toast incitant l'utilisateur à rafraîchir l'application.

## Étape 6 : Test de la PWA

En mode développement (`npm run dev`), le Service Worker de "vite-plugin-pwa" n'est pas toujours actif par défaut (sauf configuration spécifique `devOptions`). La meilleure façon de tester la PWA est de simuler la production :

```bash
npm run build
npm run preview
```

Ensuite, rendez-vous dans les "Outils de développement" de votre navigateur (F12) > onglet **Application** pour valider la détection de votre "Manifeste" web et l'enregistrement effectif du "Service Worker".
