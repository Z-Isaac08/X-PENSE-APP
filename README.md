# 💰 Xpense - Gestionnaire Financier Intelligent

> Application React de gestion budgétaire avec assistant IA pour un suivi financier simplifié.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11.8.1-FFCA28?logo=firebase)](https://firebase.google.com/)

## 🎯 Vue d'ensemble

**Xpense** est une SPA React + Vite + TypeScript permettant de gérer budgets, dépenses et revenus avec un assistant IA conversationnel alimenté par Groq (Llama 3.1).

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
Groq API (Llama 3.1 70B) → Response Processing
    ↓
Action Execution (si nécessaire) → Display
```

### 3. Autres fonctionnalités

- Suivi dépenses/revenus avec catégorisation
- Dashboard avec graphiques (évolution, tendances, répartition)
- Système de notifications (dépassements, rappels, insights)
- Export PDF mensuel

## 🚀 Installation rapide

```bash
# Clone
git clone https://github.com/Z-Isaac08/X-PENSE-APP.git
cd xpense

# Install
npm install

# Configure .env
cp .env.example .env
# Éditer .env avec vos clés

# Run
npm run dev
```

### Variables d'environnement (.env)

```env
# Firebase
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Groq AI
VITE_GROQ_API_KEY=gsk_your_groq_key

# OpenRouter (optionnel)
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

## 📁 Structure

```
src/
├── components/          # Composants UI
│   ├── budgets/        # BudgetForm, BudgetCard
│   ├── expenses/       # ExpenseForm, Table
│   ├── charts/         # BudgetEvolutionChart, MonthlyTrendsChart, etc.
│   ├── chat/           # MessageInput, ChatMessage
│   └── Layout.tsx, NavBar.tsx, Footer.tsx
├── pages/              # Pages principales
│   ├── HomePage.tsx, DashboardPage.tsx, BudgetPage.tsx
│   ├── TransactionPage.tsx, NotificationPage.tsx
│   └── ChatBotPage.tsx
├── stores/             # Zustand stores
│   ├── budgetStore.ts, expenseStore.ts, incomeStore.ts
│   ├── notificationStore.ts, chatStore.ts
│   └── dashboardStore.ts, userStore.ts, themeStore.ts
├── services/
│   ├── agent/          # Agent IA
│   │   ├── groqClient.ts          # Client Groq API
│   │   ├── contextBuilder.ts      # Construction contexte financier
│   │   ├── intentDetector.ts      # Détection intention
│   │   ├── responseProcessor.ts   # Traitement réponses
│   │   ├── actionExecutor.ts      # Exécution actions
│   │   └── agentOrchestrator.ts   # Orchestration
│   ├── notifications/  # checkExpenseTriggers, checkMonthlyTriggers
│   └── generateMonthlyReport.ts   # Export PDF
├── config/             # firebase.ts, agentConfig.ts, agentPrompts.ts
├── types/              # Types TypeScript
├── utils/              # Fonctions utilitaires
├── App.tsx             # Routing
└── main.tsx            # Entry point
```

## 🛠️ Stack technique

| Catégorie | Technologies |
|-- | |
| **Core** | React 19.1.0, TypeScript 5.8.3, Vite 6.3.5 |
| **State** | Zustand 5 |
| **Routing** | React Router 7 |
| **UI/CSS** | Tailwind CSS 3, Lucide React |
| **Charts** | Recharts 2 |
| **Backend** | Firebase 11.8.1 (Firestore) |
| **AI** | Groq Cloud (Llama 3.1 70B, Mixtral 8x7B) |
| **PDF** | jsPDF 2.5 |

## 🤖 Agent IA

### Modules

1. **Context Builder** : Agrège données financières (budgets, dépenses, revenus, comparaisons)
2. **Intent Detector** : Classifie l'intention (query, analysis, advice, prediction, action)
3. **Groq Client** : Appel API avec Llama 3.1 70B (vitesse ~1-2s)
4. **Orchestrator** : Coordonne le flux (intent → context → Groq → action)
5. **Action Executor** : Exécute actions via stores (créer budget, ajouter dépense, etc.)

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

### Firebase Hosting

```bash
npm run build
firebase deploy
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
