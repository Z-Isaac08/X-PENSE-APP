# 💰 Xpense - Gestionnaire Financier Intelligent

> Application React de gestion budgétaire avec assistant IA pour un suivi financier simplifié.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11.8.1-FFCA28?logo=firebase)](https://firebase.google.com/)

## 🎯 Vue d'ensemble

**Xpense** est une SPA React + Vite + TypeScript permettant de gérer budgets, dépenses et revenus avec un assistant IA conversationnel alimenté par Groq (Llama 3.3 70B) via backend proxy sécurisé.

### Points forts

- 💳 **Budgets flexibles** : mode plafonné (avec alertes) ou suivi (sans limite)
- 🤖 **Coach IA** : conseils personnalisés basés sur vos données réelles
- 📊 **Dashboard analytique** : graphiques Recharts interactifs
- 🔔 **Notifications intelligentes** : alertes proactives et insights automatiques
- 📄 **Export PDF** : rapports mensuels avec jsPDF

## ✨ Fonctionnalités

### 1. Gestion budgétaire double mode

**Budget Plafonné**

- Montant max défini (ex: Restaurants 200 FCFA/mois)
- Alertes aux seuils 80%, 90%, 100%
- Barre de progression colorée

**Catégorie de Suivi**

- Pas de limite (ex: Achats en ligne)
- Comparaison mensuelle automatique
- Détection de tendances

### 2. Assistant IA conversationnel

**Capacités** :

- Questions : _"Combien j'ai dépensé en restaurants ?"_
- Analyses : _"Comment vont mes finances ce mois ?"_
- Conseils : _"Comment économiser 200 FCFA par mois ?"_
- Prédictions : _"À ce rythme, combien j'aurai dépensé ?"_
- Actions : _"Crée un budget loisirs de 100 FCFA"_

**Architecture** :

```
User Message → Intent Detection → Context Builder
    ↓
Backend Proxy (/api/chat) → Groq API (Llama 3.3 70B)
    ↓
Response Processing → Action Execution → Display
```

**Sécurité** : Clé API Groq cachée côté serveur, rate limiting 30 req/h par IP

### 3. Autres fonctionnalités

- Suivi dépenses/revenus avec catégorisation
- Dashboard avec graphiques (évolution, tendances, répartition)
- Système de notifications (dépassements, rappels, insights)
- Export PDF mensuel

## 🚀 Installation rapide

```bash
# Clone
git clone https://github.com/Z-Isaac08/X-PENSE-APP.git
cd X-PENSE-APP

# Install
npm install

# Configure les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés (Firebase, Groq)

# Run (avec backend proxy)
vercel dev
# OU (frontend uniquement)
npm run dev
```

📖 **Guide complet** : Voir [docs/SETUP.md](docs/SETUP.md)

### Configuration

**Variables d'environnement** : Copier `.env.example` → `.env` et remplir :
- **Firebase** : Credentials depuis Firebase Console
- **Groq API** : Clé depuis https://console.groq.com/keys

⚠️ **Important** : Le fichier `.env` ne doit jamais être commit (déjà dans `.gitignore`)

## 📁 Structure

```
.
├── api/                # Backend Serverless (Vercel)
│   └── chat.js        # Proxy sécurisé Groq API
├── src/
│   ├── components/    # Composants UI
│   ├── pages/         # Pages principales
│   ├── stores/        # Zustand stores
│   ├── services/
│   │   ├── agent/     # Agent IA (orchestrateur, détecteur, etc.)
│   │   └── analytics/ # Analyses financières
│   ├── config/        # Configuration (Firebase, Agent)
│   ├── types/         # Types TypeScript
│   └── utils/         # Utilitaires
├── vercel.json        # Config Vercel + env vars
└── package.json
```

## 🛠️ Stack technique

| Catégorie | Technologies |
|-- | |
| **Core** | React 19.1.0, TypeScript 5.8.3, Vite 6.3.5 |
| **State** | Zustand 5 |
| **Routing** | React Router 7 |
| **UI/CSS** | Tailwind CSS 3, Lucide React |
| **Charts** | Recharts 2 |
| **Backend** | Firebase 11.8.1 (Firestore), Vercel Serverless |
| **AI** | Groq Cloud (Llama 3.3 70B) via Backend Proxy |
| **PDF** | jsPDF 2.5 |

## 🤖 Agent IA

### Modules

1. **Context Builder** : Agrège données financières (budgets, dépenses, revenus, comparaisons)
2. **Intent Detector** : Classifie l'intention (query, analysis, advice, prediction, action)
3. **Backend Proxy** : Endpoint sécurisé `/api/chat` avec rate limiting (30 req/h/IP)
4. **Groq Client** : Appel backend proxy → Groq API (Llama 3.3 70B)
5. **Orchestrator** : Coordonne le flux (intent → context → backend → action)
6. **Action Executor** : Exécute actions via stores (créer budget, ajouter dépense, etc.)

### Prompts système

- Rôle : Assistant financier personnel bienveillant
- Règles : Baser réponses sur données réelles, ton amical, solutions actionnables
- Format : Structuré avec emojis, comparaisons contextuelles

## 📜 Scripts

```bash
npm run dev       # Serveur dev (localhost:5173)
npm run build     # Build production
npm run preview   # Preview build
npm run lint      # ESLint
```

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# 1. Push sur GitHub
git add .
git commit -m "feat: app complete"
git push

# 2. Importer sur Vercel
# - Aller sur vercel.com
# - Import GitHub repo
# - Deploy

# 3. Configurer Firebase
# - Ajouter domaine Vercel dans Firebase Auth
```

### Test Local du Backend Proxy

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (si test local)
vercel dev
# Ou utiliser directement /api/chat en prod
```

## 🗃️ Stores Zustand

| Store               | Responsabilité | Actions clés                                          |
| ------------------- | -------------- | ----------------------------------------------------- |
| `budgetStore`       | Budgets        | `getAllBudgets`, `addBudget`, `updateBudgetSpent`     |
| `expenseStore`      | Dépenses       | `addExpense` (+ trigger check), `batchDeleteExpenses` |
| `incomeStore`       | Revenus        | `addIncome`, `getAllIncomes`                          |
| `notificationStore` | Notifications  | `AllNotifications`, `markAsRead`                      |
| `chatStore`         | Chat IA        | `sendMessage`, `confirmAction`                        |
| `dashboardStore`    | Métriques      | `calculateMetrics`, `getMonthlyTrends`                |
| `themeStore`        | Thème          | `toggleTheme`                                         |

## 📊 Architecture données (Firestore)

```
Collections:
├── budgets/        # {name, type: 'capped'|'tracking', amount?, spent, ...}
├── expenses/       # {amount, category, budgetId, date, ...}
├── incomes/        # {amount, source, date, ...}
└── notifications/  # {type, title, message, read, ...}
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/Feature`)
3. Commit (`git commit -m 'Add Feature'`)
4. Push (`git push origin feature/Feature`)
5. Ouvrir une Pull Request

## 📝 Licence

MIT License - Voir `LICENSE`

**Fait avec ❤️ par Isaac N'CHO**
