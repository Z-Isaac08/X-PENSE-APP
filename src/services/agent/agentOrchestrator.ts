import type { AgentResponse, ChatMessage } from '../../types/agent';
import { getGroqClient } from './groqClient';
import { buildFinancialContext } from './contextBuilder';
import { detectIntent } from './intentDetector';
import { processResponse } from './responseProcessor';
import { SYSTEM_PROMPT, buildContextPrompt } from '../../config/agentPrompts';

/**
 * Orchestre le traitement complet d'un message utilisateur
 */
export const handleUserMessage = async (
  message: string,
  _userId: string, // Keeping for backward compatibility
  conversationHistory: ChatMessage[] = []
): Promise<AgentResponse> => {
  const startTime = Date.now();

  try {
    // 1. Construire le contexte financier
    const financialContext = await buildFinancialContext();

    // 2. Détecter l'intention
    const intent = detectIntent(message);

    // 3. Préparer l'historique de conversation
    const historyText = formatConversationHistory(conversationHistory);

    // 4. Construire le prompt contextuel
    const contextPrompt = buildContextPrompt(financialContext, message, historyText);

    // 5. Appeler l'IA
    const response = await callAI(contextPrompt, message);

    // 6. Traiter la réponse
    const { formatted, actions } = processResponse(response.content);

    // 7. Calculer le temps de traitement
    const processingTime = Date.now() - startTime;

    return {
      message: response.content,
      formatted,
      actions: actions.length > 0 ? actions : undefined,
      metadata: {
        intent,
        processingTime,
        tokensUsed: response.tokensUsed
      }
    };
  } catch (error: any) {
    console.error('Error in agent orchestrator:', error);
    
    // Retourner une réponse d'erreur
    return {
      message: "Désolé, j'ai rencontré une erreur en traitant votre demande. Pouvez-vous reformuler ?",
      formatted: {
        text: "Désolé, j'ai rencontré une erreur en traitant votre demande. Pouvez-vous reformuler ?",
        html: "<p>Désolé, j'ai rencontré une erreur en traitant votre demande. Pouvez-vous reformuler ?</p>"
      },
      metadata: {
        intent: { type: 'general_chat' as any, confidence: 0 },
        processingTime: Date.now() - startTime
      }
    };
  }
};

/**
 * Appelle l'IA avec le contexte
 */
const callAI = async (
  contextPrompt: string,
  userMessage: string
): Promise<{ content: string; tokensUsed?: number }> => {
  const groqClient = getGroqClient();

  // Créer le message système avec le contexte
  const systemMessage = groqClient.createSystemMessage(SYSTEM_PROMPT, contextPrompt);

  // Créer le message utilisateur
  const messages = [
    systemMessage,
    {
      role: 'user' as const,
      content: userMessage
    }
  ];

  // Appeler l'API
  return await groqClient.sendMessage(messages);
};

/**
 * Formate l'historique de conversation pour le contexte
 */
const formatConversationHistory = (history: ChatMessage[]): string => {
  if (history.length === 0) {
    return 'Aucun historique (première interaction)';
  }

  // Prendre les 5 derniers messages
  const recentHistory = history.slice(-5);

  return recentHistory
    .map(msg => {
      const role = msg.role === 'user' ? 'Utilisateur' : 'Assistant';
      return `${role}: ${msg.content}`;
    })
    .join('\n');
};

/**
 * Traite un message avec streaming (pour future implémentation)
 */
export const handleUserMessageStream = async (
  message: string,
  userId: string,
  conversationHistory: ChatMessage[] = [],
  onChunk: (chunk: string) => void
): Promise<AgentResponse> => {
  // Pour l'instant, on utilise la version non-streaming
  // TODO: Implémenter le streaming avec Groq
  const response = await handleUserMessage(message, userId, conversationHistory);
  onChunk(response.message);
  return response;
};

/**
 * Vérifie si l'agent est prêt à fonctionner
 */
export const isAgentReady = (): boolean => {
  try {
    const groqClient = getGroqClient();
    return groqClient.isConfigured();
  } catch {
    return false;
  }
};
