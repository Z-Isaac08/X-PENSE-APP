// Types pour l'agent IA financier

// ============================================
// INTENTIONS
// ============================================

export enum IntentType {
  GREETING = "greeting", // Salutations et messages de bienvenue
  QUERY_DATA = "query_data", // Question sur données
  ANALYSIS = "analysis", // Demande d'analyse
  ADVICE = "advice", // Demande de conseil
  PREDICTION = "prediction", // Demande de projection
  ACTION_CREATE = "action_create", // Création de données
  ACTION_MODIFY = "action_modify", // Modification de données
  ACTION_DELETE = "action_delete", // Suppression de données
  GENERAL_CHAT = "general_chat", // Discussion générale
}

export interface Intent {
  type: IntentType;
  confidence: number;
  parameters?: Record<string, any>;
}

// ============================================
// CONTEXTE FINANCIER
// ============================================

export interface FinancialContext {
  currentDate: string;
  dayOfMonth: number;
  totalDaysInMonth: number;
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
  type: "capped" | "tracking";
  amount?: number;
  spent: number;
  added: number;
  remaining?: number;
  percentage?: number;
  status: "ok" | "warning" | "exceeded";
}

export interface ExpenseSummary {
  total: number;
  count: number;
  byCategory: Record<string, number>;
  topExpenses: ExpenseItem[];
  averagePerDay: number;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
}

export interface IncomeSummary {
  total: number;
  count: number;
  bySources: Record<string, number>;
  topIncomes: IncomeItem[];
}

export interface IncomeItem {
  id: string;
  name: string;
  amount: number;
  budgetName: string;
  date: Date;
}

export interface HistoricalData {
  months: MonthData[];
  averages: {
    expenses: number;
    incomes: number;
    balance: number;
  };
}

export interface MonthData {
  month: string;
  year: number;
  expenses: number;
  incomes: number;
  balance: number;
  topCategory: string;
}

// ============================================
// ANALYSES
// ============================================

export interface TrendAnalysis {
  overall: "increasing" | "decreasing" | "stable";
  percentage: number;
  byCategory: Record<string, Trend>;
}

export interface Trend {
  direction: "up" | "down" | "stable";
  percentage: number;
  comparison: string;
}

export interface Alert {
  type: "warning" | "danger" | "info";
  category: string;
  message: string;
  value?: number;
  threshold?: number;
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
  projectedDate: Date;
}

export interface Pattern {
  type: "recurring" | "spike" | "unusual";
  category: string;
  description: string;
  frequency?: string;
  amount?: number;
}

// ============================================
// ACTIONS
// ============================================

export enum ActionType {
  CREATE_BUDGET = "create_budget",
  ADD_EXPENSE = "add_expense",
  ADD_INCOME = "add_income",
  MODIFY_BUDGET = "modify_budget",
  DELETE_BUDGET = "delete_budget",
  MODIFY_EXPENSE = "modify_expense",
  DELETE_EXPENSE = "delete_expense",
}

export interface Action {
  id: string;
  type: ActionType;
  parameters: Record<string, any>;
  requiresConfirmation: boolean;
  confirmationMessage: string;
  status: "pending" | "confirmed" | "cancelled" | "executed";
}

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// ============================================
// RÉPONSES
// ============================================

export interface AgentResponse {
  message: string;
  formatted: FormattedMessage;
  actions?: Action[];
  metadata: {
    intent: Intent;
    processingTime: number;
    tokensUsed?: number;
  };
}

export interface FormattedMessage {
  text: string;
  html: string;
  actionButtons?: ActionButton[];
}

export interface ActionButton {
  id: string;
  label: string;
  action: Action;
  variant: "primary" | "secondary" | "danger";
}

// ============================================
// MESSAGES
// ============================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  formatted?: FormattedMessage;
  timestamp: Date;
  intent?: Intent;
  actions?: Action[];
}

// ============================================
// CONFIGURATION
// ============================================

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
  streamingEnabled: boolean;
  confirmActionsBeforeExecution: boolean;
  maxHistoryMessages: number;
  refreshContextAfterAction: boolean;
}
