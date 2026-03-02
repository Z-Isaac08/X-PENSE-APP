# 🚀 X-PENSE - Reprenez le contrôle de demain

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11-orange.svg)](https://firebase.google.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **"Parce que gérer son argent ne devrait pas être une source d'anxiété, mais un pas vers la liberté."**

X-Pense est une application de gestion financière personnelle intelligente conçue pour transformer votre relation avec l'argent. Oubliez les tableaux complexes et le stress des fins de mois ; X-Pense utilise le storytelling et l'IA pour vous offrir une clarté totale et des conseils actionnables.

---

## ✨ Points Forts

- 🤖 **Assistant IA Financier** : Un coach personnel (Groq Llama 3.3) qui analyse vos dépenses, répond à vos questions et exécute des actions pour vous.
- 🎯 **Gestion par Enveloppes** : Trois types de budgets pour une maîtrise parfaite :
  - **Plafonné** : Pour ne jamais dépasser vos limites (Courses, Loisirs).
  - **Suivi** : Pour observer vos dépenses régulières sans stresser (Loyer, Abonnements).
  - **Épargne** : Pour transformer vos économies en victoires.
- 🔔 **Notifications Intelligentes** : Alertes de seuils (80%, 90%), tendances mensuelles et résumés périodiques automatisés.
- 📊 **Dashboard Dynamique** : Visualisez votre santé financière en un coup d'œil avec des graphiques clairs et un export PDF professionnel.
- 🌓 **Interface Premium** : Design moderne, fluide et responsive avec mode sombre et clair élégant.

---

## 🛠️ Stack Technique

- **Frontend** : React 19, TypeScript, Vite 6
- **Style & Animation** : Tailwind CSS v4, Framer Motion, Lucide React
- **State Management** : Zustand
- **Backend & DB** : Firebase (Auth & Firestore)
- **Intelligence Artificielle** : Groq SDK (Llama 3.3 70B)
- **Déploiement** : Vercel (avec Backend Proxy pour la sécurité des clés API)

---

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Cloner le projet
git clone https://github.com/Z-Isaac08/X-PENSE-APP.git
cd X-PENSE-APP

# Installer les dépendances
npm install
```

### 2. Configuration

Copiez le fichier `.env.example` en `.env` et remplissez vos clés Firebase et Groq :

```bash
cp .env.example .env
```

### 3. Lancement

Pour bénéficier du proxy backend (nécessaire pour l'IA) :

```bash
# Avec Vercel CLI (recommandé)
vercel dev

# Ou avec Vite (IA limitée sans proxy local)
npm run dev
```

---

## 📚 Documentation Détaillée

Pour aller plus loin, consultez les guides dans le dossier `/docs` :

1. ⚙️ [**Guide d'Installation (SETUP.md)**](docs/SETUP.md) : Prérequis et configuration détaillée de Firebase/Groq.
2. 🚀 [**Guide de Déploiement (GUIDE_DEPLOIEMENT.md)**](docs/GUIDE_DEPLOIEMENT.md) : Comment mettre votre app en ligne sur Vercel, Netlify ou Firebase.
3. 🤖 [**Architecture de l'IA (AGENT_IA_ARCHITECTURE.md)**](docs/AGENT_IA_ARCHITECTURE.md) : Tout sur le fonctionnement du cerveau de X-Pense.
4. 🔍 [**Audit Projet (AUDIT_COMPLET.md)**](docs/AUDIT_COMPLET.md) : Analyse technique, sécurité et statut des fonctionnalités.
5. 📖 [**Index Documentation (DOCUMENTATION.md)**](docs/DOCUMENTATION.md) : Sommaire de toutes les ressources disponibles.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request pour suggérer des améliorations.

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Développé avec ❤️ pour une meilleure santé financière.**
