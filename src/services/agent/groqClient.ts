import { AGENT_CONFIG } from "../../config/agentConfig";
import type { ChatMessage } from "../../types/agent";

// URL du backend proxy (local en dev, Vercel en prod)
const API_URL = import.meta.env.DEV
  ? "http://localhost:3000/api/chat"
  : "/api/chat";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class GroqClient {

  constructor() {
    // Plus besoin d'initialiser Groq côté client
  }

  /**
   * Envoie un message à l'API Groq et retourne la réponse
   */
  async sendMessage(
    messages: GroqMessage[],
    temperature?: number,
    maxTokens?: number
  ): Promise<{ content: string; tokensUsed?: number }> {
    try {
      // Appeler le backend proxy au lieu de Groq directement
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          temperature: temperature ?? AGENT_CONFIG.temperature,
          maxTokens: maxTokens ?? AGENT_CONFIG.maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      return {
        content: data.content,
        tokensUsed: data.tokensUsed,
      };
    } catch (error: any) {
      console.error("Error calling backend API:", error);
      throw new Error(`Failed to get response from AI: ${error.message}`);
    }
  }

  /**
   * Convertit les messages du chat en format Groq
   */
  convertChatMessages(messages: ChatMessage[]): GroqMessage[] {
    return messages.map((msg) => ({
      role:
        msg.role === "system"
          ? "system"
          : msg.role === "user"
          ? "user"
          : "assistant",
      content: msg.content,
    }));
  }

  /**
   * Crée un message système avec le contexte
   */
  createSystemMessage(
    systemPrompt: string,
    contextPrompt: string
  ): GroqMessage {
    return {
      role: "system",
      content: `${systemPrompt}\n\n${contextPrompt}`,
    };
  }

  /**
   * Vérifie si l'API key est configurée
   */
  isConfigured(): boolean {
    return true; // Toujours configuré car la clé est intégrée
  }
}

// singleton helpers
let instance: GroqClient | null = null;
export function getGroqClient() {
  if (!instance) instance = new GroqClient();
  return instance;
}
export function initializeGroqClient() {
  // no client-side key allowed — keep for compatibility but do nothing
  if (!instance) instance = new GroqClient();
  return instance;
}
