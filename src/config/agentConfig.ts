import type { AgentConfig } from '../types/agent';

export const AGENT_CONFIG: AgentConfig = {
  model: 'llama-3.3-70b-versatile', // Modèle mis à jour (remplace llama-3.1-70b-versatile décommissionné)
  temperature: 0.7,
  maxTokens: 1500,
  contextWindow: 8000,
  streamingEnabled: false,
  confirmActionsBeforeExecution: true,
  maxHistoryMessages: 10,
  refreshContextAfterAction: true
};
