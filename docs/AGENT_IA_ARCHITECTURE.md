# 🤖 Agent Conversationnel IA Financier - Architecture

## 📋 Vue d'ensemble

Agent IA personnel qui comprend la situation financière de l'utilisateur et l'aide activement à mieux gérer son argent.

---

## 🎯 Vision de l'Agent

### Ce que l'agent DOIT être
- ✅ Coach financier personnel
- ✅ Connaît toute l'histoire financière de l'utilisateur
- ✅ Répond aux questions en temps réel
- ✅ Donne des conseils personnalisés basés sur SES données réelles
- ✅ Anticipe les problèmes et propose des solutions
- ✅ Encourage les bonnes habitudes financières

### Ce que l'agent NE DOIT PAS être
- ❌ Chatbot générique avec conseils standards
- ❌ Simple calculateur qui répète le dashboard
- ❌ Assistant qui invente des données ou fait des suppositions

---

## 💬 Types de Conversations

### 1. Questions sur les données existantes
**Exemples** :
- "Combien j'ai dépensé en restaurants le mois dernier ?"
- "Quel est mon budget le plus proche du dépassement ?"
- "Combien il me reste sur mon budget courses ?"

**Actions** :
- Analyser les données en temps réel
- Répondre avec chiffres précis et contextualisés
- Ajouter des insights comparatifs

### 2. Analyse et insights proactifs
**Exemples** :
- "Comment vont mes finances ce mois-ci ?"
- "Quelles sont mes dépenses inhabituelles récemment ?"
- "Analyse mes 3 derniers mois"

**Actions** :
- Identifier les tendances
- Comparer les périodes
- Détecter les anomalies
- Donner une vision d'ensemble

### 3. Conseils personnalisés
**Exemples** :
- "Comment je peux économiser 200 FCFA par mois ?"
- "Mes budgets sont-ils réalistes ?"
- "Aide-moi à optimiser mes dépenses"

**Actions** :
- Analyser pour trouver opportunités d'économie
- Identifier catégories problématiques
- Suggérer ajustements basés sur historique réel
- Proposer plan d'action concret

### 4. Prédictions et projections
**Exemples** :
- "Est-ce que je vais finir le mois dans le vert ?"
- "À ce rythme, combien j'aurai dépensé en restaurants ?"
- "Je peux me permettre une dépense de 500 FCFA ?"

**Actions** :
- Calculer projections basées sur patterns
- Anticiper dépassements potentiels
- Simuler impact de décisions

### 5. Création et modification de données
**Exemples** :
- "Crée-moi un budget restaurants de 200 FCFA"
- "Ajoute une dépense de 45 FCFA en courses"
- "Augmente mon budget loisirs de 50 FCFA"

**Actions** :
- Comprendre intention et paramètres
- Confirmer avant exécution
- Effectuer modification en base
- Confirmer avec message clair

---

## 🏗️ Architecture Technique

### Structure des Dossiers et Fichiers

```
src/
├── services/
│   ├── agent/
│   │   ├── groqClient.ts              # Client API Groq
│   │   ├── contextBuilder.ts          # Construction du contexte financier
│   │   ├── intentDetector.ts          # Détection d'intention utilisateur
│   │   ├── responseProcessor.ts       # Traitement des réponses IA
│   │   ├── actionExecutor.ts          # Exécution des actions (CRUD)
│   │   └── agentOrchestrator.ts       # Orchestration globale
│   └── analytics/
│       └── financialAnalyzer.ts       # Analyses financières avancées
│
├── config/
│   ├── agentPrompts.ts                # Prompts système pour l'IA
│   └── agentConfig.ts                 # Configuration de l'agent
│
├── types/
│   └── agent.ts                       # Types TypeScript pour l'agent
│
└── stores/
    └── chatStore.ts                   # Store Zustand (à modifier)
```

---

## 🔧 Composants Détaillés

### 1. **groqClient.ts**
**Rôle** : Communication avec l'API Groq

**Fonctions** :
```typescript
- sendMessage(messages: Message[], context: FinancialContext): Promise<string>
- streamMessage(messages: Message[], context: FinancialContext): AsyncGenerator<string>
```

**Responsabilités** :
- Gérer les appels API Groq
- Gérer les erreurs réseau
- Supporter le streaming de réponses
- Gérer les limites de tokens

---

### 2. **contextBuilder.ts**
**Rôle** : Construire le contexte financier complet

**Fonctions** :
```typescript
- buildFinancialContext(userId: string): Promise<FinancialContext>
- getCurrentMonthSummary(userId: string): MonthSummary
- getHistoricalData(userId: string, months: number): HistoricalData
- detectAnomalies(userId: string): Anomaly[]
```

**Données incluses** :
- Date actuelle et position dans le mois
- Liste complète des budgets avec statuts
- Dépenses du mois (total + détail)
- Revenus du mois (total + détail)
- Solde estimé
- Historique 3-6 derniers mois
- Moyennes et tendances
- Comparaisons période à période
- Dépenses inhabituelles

**Format de sortie** :
```typescript
interface FinancialContext {
  currentDate: string;
  dayOfMonth: number;
  budgets: BudgetSummary[];
  currentMonthExpenses: ExpenseSummary;
  currentMonthIncomes: IncomeSummary;
  balance: number;
  historical: HistoricalData;
  trends: TrendAnalysis;
  alerts: Alert[];
}
```

---

### 3. **intentDetector.ts**
**Rôle** : Classifier la demande utilisateur

**Fonctions** :
```typescript
- detectIntent(message: string): Intent
- extractParameters(message: string, intent: Intent): Parameters
```

**Types d'intentions** :
```typescript
enum IntentType {
  QUERY_DATA = 'query_data',           // Question sur données
  ANALYSIS = 'analysis',                // Demande d'analyse
  ADVICE = 'advice',                    // Demande de conseil
  PREDICTION = 'prediction',            // Demande de projection
  ACTION_CREATE = 'action_create',      // Création de données
  ACTION_MODIFY = 'action_modify',      // Modification de données
  ACTION_DELETE = 'action_delete',      // Suppression de données
  GENERAL_CHAT = 'general_chat'         // Discussion générale
}
```

**Méthodes de détection** :
- Mots-clés (rapide, simple)
- Patterns regex
- Classification par LLM (optionnel, plus précis)

---

### 4. **responseProcessor.ts**
**Rôle** : Traiter et formater les réponses de l'IA

**Fonctions** :
```typescript
- processResponse(rawResponse: string): ProcessedResponse
- detectActions(response: string): Action[]
- formatForDisplay(response: string): FormattedMessage
```

**Responsabilités** :
- Parser la réponse IA
- Détecter actions demandées
- Formater pour affichage (markdown, emojis)
- Extraire données structurées
- Générer boutons d'action

---

### 5. **actionExecutor.ts**
**Rôle** : Exécuter les actions détectées

**Fonctions** :
```typescript
- executeAction(action: Action, userId: string): Promise<ActionResult>
- createBudget(params: BudgetParams): Promise<Budget>
- addExpense(params: ExpenseParams): Promise<Expense>
- addIncome(params: IncomeParams): Promise<Income>
- modifyBudget(budgetId: string, params: Partial<BudgetParams>): Promise<Budget>
- deleteBudget(budgetId: string): Promise<void>
```

**Flow d'exécution** :
1. Détecter intention d'action
2. Extraire paramètres
3. Demander confirmation utilisateur
4. Attendre validation
5. Exécuter via stores Zustand
6. Confirmer succès
7. Rafraîchir contexte

---

### 6. **agentOrchestrator.ts**
**Rôle** : Orchestrer tout le processus

**Fonctions** :
```typescript
- handleUserMessage(message: string, userId: string): Promise<AgentResponse>
- processWithContext(message: string, context: FinancialContext): Promise<string>
```

**Flow complet** :
```
1. Recevoir message utilisateur
2. Construire contexte financier (contextBuilder)
3. Détecter intention (intentDetector)
4. Générer prompt système + contexte
5. Appeler Groq API (groqClient)
6. Traiter réponse (responseProcessor)
7. Détecter actions éventuelles
8. Retourner réponse formatée
9. Si action → attendre confirmation → exécuter
```

---

### 7. **financialAnalyzer.ts**
**Rôle** : Analyses financières avancées

**Fonctions** :
```typescript
- calculateTrends(userId: string, months: number): TrendAnalysis
- detectSpendingPatterns(userId: string): Pattern[]
- identifySavingsOpportunities(userId: string): Opportunity[]
- predictMonthEnd(userId: string): Prediction
- comparePeriods(userId: string, period1: Period, period2: Period): Comparison
```

**Analyses fournies** :
- Tendances (hausse/baisse par catégorie)
- Patterns de dépenses (récurrences, pics)
- Opportunités d'économie
- Prédictions fin de mois
- Comparaisons temporelles
- Détection d'anomalies

---

## ⚙️ Configuration

### **agentPrompts.ts**
```typescript
export const SYSTEM_PROMPT = `
Tu es l'assistant financier personnel de l'utilisateur.
Tu as accès à toutes ses données financières : budgets, dépenses et revenus.
Ton rôle est de l'aider à mieux comprendre et gérer son argent.

RÈGLES :
- Toujours baser les réponses sur les données réelles fournies
- Ne JAMAIS inventer de chiffres ou de données
- Être concis mais complet
- Utiliser un ton amical et encourageant, jamais moralisateur
- Quand tu identifies un problème, proposer toujours une solution
- Formater les montants avec devise (FCFA)
- Utiliser des emojis pertinents

CAPACITÉS :
- Répondre aux questions sur les finances
- Analyser les tendances et patterns
- Donner des conseils personnalisés
- Créer des projections
- Identifier opportunités d'économie
- Détecter anomalies

LIMITES :
- Ne pas donner de conseils financiers génériques
- Ne pas accéder à des données bancaires externes
- Ne pas faire de modifications sans confirmation
`;

export const CONTEXT_TEMPLATE = `
CONTEXTE FINANCIER :
{context}

HISTORIQUE CONVERSATION :
{history}

QUESTION UTILISATEUR :
{question}
`;
```

### **agentConfig.ts**
```typescript
export const AGENT_CONFIG = {
  model: 'llama-3.1-70b-versatile',
  temperature: 0.7,
  maxTokens: 1000,
  contextWindow: 8000,
  streamingEnabled: true,
  confirmActionsBeforeExecution: true,
  maxHistoryMessages: 10,
  refreshContextAfterAction: true
};
```

---

## 📊 Types TypeScript

### **agent.ts**
```typescript
// Intentions
export enum IntentType {
  QUERY_DATA = 'query_data',
  ANALYSIS = 'analysis',
  ADVICE = 'advice',
  PREDICTION = 'prediction',
  ACTION_CREATE = 'action_create',
  ACTION_MODIFY = 'action_modify',
  ACTION_DELETE = 'action_delete',
  GENERAL_CHAT = 'general_chat'
}

export interface Intent {
  type: IntentType;
  confidence: number;
  parameters?: Record<string, any>;
}

// Contexte financier
export interface FinancialContext {
  currentDate: string;
  dayOfMonth: number;
  budgets: BudgetSummary[];
  currentMonthExpenses: ExpenseSummary;
  currentMonthIncomes: IncomeSummary;
  balance: number;
  historical: HistoricalData;
  trends: TrendAnalysis;
  alerts: Alert[];
}

export interface BudgetSummary {
  id: string;
  name: string;
  type: 'capped' | 'tracking';
  amount?: number;
  spent: number;
  percentage?: number;
  status: 'ok' | 'warning' | 'exceeded';
}

export interface ExpenseSummary {
  total: number;
  byCategory: Record<string, number>;
  topExpenses: { name: string; amount: number; category: string }[];
}

export interface IncomeSummary {
  total: number;
  bySources: Record<string, number>;
}

// Actions
export enum ActionType {
  CREATE_BUDGET = 'create_budget',
  ADD_EXPENSE = 'add_expense',
  ADD_INCOME = 'add_income',
  MODIFY_BUDGET = 'modify_budget',
  DELETE_BUDGET = 'delete_budget'
}

export interface Action {
  type: ActionType;
  parameters: Record<string, any>;
  requiresConfirmation: boolean;
  confirmationMessage: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// Réponses
export interface AgentResponse {
  message: string;
  formatted: FormattedMessage;
  actions?: Action[];
  metadata: {
    intent: Intent;
    processingTime: number;
    tokensUsed: number;
  };
}

export interface FormattedMessage {
  text: string;
  html: string;
  actionButtons?: ActionButton[];
}

export interface ActionButton {
  label: string;
  action: Action;
  variant: 'primary' | 'secondary' | 'danger';
}

// Analyses
export interface TrendAnalysis {
  overall: 'increasing' | 'decreasing' | 'stable';
  byCategory: Record<string, Trend>;
}

export interface Trend {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  comparison: string;
}

export interface Opportunity {
  category: string;
  currentSpending: number;
  suggestedTarget: number;
  potentialSavings: number;
  confidence: number;
  reasoning: string;
}

export interface Prediction {
  estimatedEndOfMonthExpenses: number;
  estimatedBalance: number;
  budgetsAtRisk: string[];
  confidence: number;
}
```

---

## 🔄 Modifications du Chat Store

### **chatStore.ts** (modifications)
```typescript
interface ChatState {
  messages: Message[];
  pendingActions: Action[];
  financialContext: FinancialContext | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendMessage: (message: string) => Promise<void>;
  confirmAction: (actionId: string) => Promise<void>;
  cancelAction: (actionId: string) => void;
  refreshContext: () => Promise<void>;
  clearHistory: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  formatted?: FormattedMessage;
  timestamp: Date;
  intent?: Intent;
  actions?: Action[];
}
```

---

## 🎨 Exemple de Conversation

### Conversation 1 : Question simple
```
👤 Utilisateur : Combien j'ai dépensé ce mois ?

🤖 Agent : Ce mois-ci (octobre), tu as dépensé 1,450 FCFA au total.

Voici le détail par catégorie :
• Courses alimentaires : 420 FCFA (29%)
• Restaurants : 180 FCFA (12%)
• Transport : 150 FCFA (10%)
• Loisirs : 75 FCFA (5%)
• Achats en ligne : 340 FCFA (23%)
• Autres : 285 FCFA (20%)

C'est 12% de plus qu'en septembre (1,294 FCFA).
La hausse vient principalement de tes achats en ligne (+95 FCFA)
```

### Conversation 2 : Conseil personnalisé
```
👤 Utilisateur : Comment économiser 300 FCFA par mois ?

🤖 Agent : J'ai analysé tes dépenses et voici 3 pistes concrètes :

1️⃣ **Achats en ligne** (économie : ~150 FCFA)
Tu dépenses en moyenne 340 FCFA/mois sans limite fixée.
En te fixant un budget de 200 FCFA, tu économiserais 140 FCFA.

2️⃣ **Restaurants** (économie : ~80 FCFA)
Moyenne actuelle : 180 FCFA/mois.
En réduisant à 100 FCFA (2-3 sorties au lieu de 5-6), tu économises 80 FCFA.

3️⃣ **Transport** (économie : ~70 FCFA)
150 FCFA/mois actuellement.
Explore le covoiturage pour viser 80 FCFA/mois.

📊 Total économisé : 290 FCFA/mois

Veux-tu que je t'aide à ajuster tes budgets ?

[Bouton: Ajuster mes budgets] [Bouton: Plus de détails]
```

### Conversation 3 : Action
```
👤 Utilisateur : Crée un budget épargne de 500 FCFA

🤖 Agent : Je vais créer un nouveau budget "Épargne" de 500 FCFA par mois en mode plafonné.

Ça te permettra de suivre ton objectif d'économie et je te préviendrai si tu ne l'atteins pas.

Confirmes-tu la création ? ✅

[Bouton: Confirmer] [Bouton: Annuler]

---

👤 Utilisateur : [Clic sur Confirmer]

🤖 Agent : ✅ Budget "Épargne" créé avec succès !

Tu peux le voir dans ton dashboard. Je te tiendrai informé de ta progression chaque mois. 💰
```

---

## 🚀 Implémentation Progressive

### Phase 1 : Base (MVP)
- ✅ Client Groq API
- ✅ Context Builder basique
- ✅ Prompts système
- ✅ Questions/réponses simples
- ✅ Interface chat fonctionnelle

### Phase 2 : Intelligence
- ✅ Intent Detection
- ✅ Financial Analyzer
- ✅ Analyses avancées
- ✅ Conseils personnalisés

### Phase 3 : Actions
- ✅ Action Executor
- ✅ Confirmations utilisateur
- ✅ CRUD via agent
- ✅ Rafraîchissement contexte

### Phase 4 : Optimisations
- ✅ Streaming des réponses
- ✅ Mémoire conversationnelle
- ✅ Prédictions ML
- ✅ Alertes proactives

---

## 📈 Métriques de Succès

L'agent sera réussi si :
- ✅ Répond correctement à 95%+ des questions
- ✅ Analyses correspondent aux chiffres réels
- ✅ Utilisateurs l'utilisent régulièrement
- ✅ Aide à prendre de meilleures décisions
- ✅ Actions proposées sont pertinentes

---

## ⚠️ Pièges à Éviter

1. ❌ Agent trop bavard → Réponses concises
2. ❌ Conseils génériques → Basé sur données réelles
3. ❌ Contexte obsolète → Rafraîchir après actions
4. ❌ Actions non confirmées → Toujours demander validation
5. ❌ Surcharge cognitive → Pas trop d'infos d'un coup
6. ❌ Pas de valeur ajoutée → Plus que le dashboard

---

## 🔮 Évolutions Futures

- 📢 Alertes proactives
- 📊 Rapports automatiques hebdo/mensuels
- 🎯 Objectifs financiers long terme
- 📈 Comparaisons sociales
- 🤖 Prédictions ML avancées
- 🎤 Reconnaissance vocale

---

**🎉 Agent IA Financier - Architecture Complète !**
