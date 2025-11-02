import { create } from "zustand";
import { addDoc, collection, db, deleteDoc, doc, getDocs } from "../firebase";
import type { Action, ChatMessage, FinancialContext } from "../types/agent";
import { handleUserMessage } from "../services/agent/agentOrchestrator";
import { executeAction } from "../services/agent/actionExecutor";
import { buildFinancialContext } from "../services/agent/contextBuilder";
import { useBudgetStore } from "./budgetStore";
import { useExpenseStore } from "./expenseStore";
import { useIncomeStore } from "./incomeStore";

export interface MessageInterface {
  id: string;
  role: "assistant" | "user";
  content: string;
  date: string;
  formatted?: any;
  actions?: Action[];
}

interface ChatStore {
  messages: MessageInterface[];
  pendingActions: Action[];
  financialContext: FinancialContext | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions existantes
  addChat: (
    userId: string,
    chat: Omit<MessageInterface, "id">
  ) => Promise<void>;
  getAllChats: (userId: string) => Promise<void>;
  deleteAllChats: (userId: string) => Promise<void>;
  
  // Nouvelles actions pour l'agent IA
  sendMessage: (message: string, userId: string) => Promise<void>;
  confirmAction: (actionId: string, userId: string) => Promise<void>;
  cancelAction: (actionId: string) => void;
  refreshContext: (userId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  pendingActions: [],
  financialContext: null,
  isLoading: false,
  error: null,
  addChat: async (userId, chat) => {
    try {
      const ChatsRef = collection(db, "users", userId, "chats");
      const docRef = await addDoc(ChatsRef, chat);

      set((state) => ({
        messages: [...state.messages, { ...chat, id: docRef.id }],
      }));
    } catch (error) {
      console.error("Error adding chat:", error);
      throw new Error("Could not add chat");
    }
  },
  getAllChats: async (userId) => {
    try {
      const chatsSnapshot = await getDocs(
        collection(db, "users", userId, "chats")
      );
      const chats = chatsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as MessageInterface)
      );
      const sortedChats = chats.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      set({ messages: sortedChats });
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    }
  },
  deleteAllChats: async (userId) => {
    try {
      const chatsSnapshot = await getDocs(
        collection(db, "users", userId, "chats")
      );
      const batchPromises = chatsSnapshot.docs.map((docItem) =>
        deleteDoc(doc(db, "users", userId, "chats", docItem.id))
      );
      await Promise.all(batchPromises);
      set({ messages: [], pendingActions: [] });
    } catch (error) {
      console.error("Erreur lors de la suppression des messages", error);
      throw new Error("Erreur lors de la suppression des messages");
    }
  },
  
  // Envoyer un message à l'agent IA
  sendMessage: async (message: string, userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Ajouter le message utilisateur
      const userMessage: Omit<MessageInterface, "id"> = {
        role: "user",
        content: message,
        date: new Date().toISOString()
      };
      
      await get().addChat(userId, userMessage);
      
      // Convertir les messages en format ChatMessage pour l'agent
      const conversationHistory: ChatMessage[] = get().messages.map(msg => ({
        id: msg.id,
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
        timestamp: new Date(msg.date),
        formatted: msg.formatted,
        actions: msg.actions
      }));
      
      // Appeler l'agent IA
      const response = await handleUserMessage(message, userId, conversationHistory);
      
      // Ajouter la réponse de l'assistant
      const assistantMessage: Omit<MessageInterface, "id"> = {
        role: "assistant",
        content: response.message,
        date: new Date().toISOString(),
        ...(response.formatted && { formatted: response.formatted }),
        ...(response.actions && response.actions.length > 0 && { actions: response.actions })
      };
      
      await get().addChat(userId, assistantMessage);
      
      // Si des actions sont proposées, les ajouter aux actions en attente
      if (response.actions && response.actions.length > 0) {
        set((state) => ({
          pendingActions: [...state.pendingActions, ...response.actions!]
        }));
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Error sending message to agent:", error);
      set({ 
        isLoading: false, 
        error: error.message || "Erreur lors de l'envoi du message" 
      });
      
      // Ajouter un message d'erreur
      const errorMessage: Omit<MessageInterface, "id"> = {
        role: "assistant",
        content: "Désolé, j'ai rencontré une erreur. Veuillez réessayer.",
        date: new Date().toISOString()
      };
      
      await get().addChat(userId, errorMessage);
    }
  },
  
  // Confirmer et exécuter une action
  confirmAction: async (actionId: string, userId: string) => {
    // Chercher l'action dans pendingActions OU dans les messages
    let action = get().pendingActions.find(a => a.id === actionId);
    
    if (!action) {
      // Chercher dans les messages
      for (const msg of get().messages) {
        if (msg.actions) {
          const foundAction = msg.actions.find(a => a.id === actionId);
          if (foundAction) {
            action = foundAction;
            break;
          }
        }
      }
    }
    
    if (!action) {
      console.error("Action not found:", actionId);
      return;
    }
    
    set({ isLoading: true });
    
    try {
      // Exécuter l'action
      const result = await executeAction(action, userId);
      
      // Retirer l'action des actions en attente
      set((state) => ({
        pendingActions: state.pendingActions.filter(a => a.id !== actionId)
      }));
      
      // Ajouter un message de confirmation
      const confirmationMessage: Omit<MessageInterface, "id"> = {
        role: "assistant",
        content: result.message,
        date: new Date().toISOString()
      };
      
      await get().addChat(userId, confirmationMessage);
      
      // Rafraîchir les données (budgets, dépenses, revenus)
      await useBudgetStore.getState().getAllBudgets(userId);
      await useExpenseStore.getState().getAllExpenses(userId);
      await useIncomeStore.getState().getAllIncomes(userId);
      
      // Rafraîchir le contexte financier
      await get().refreshContext(userId);
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Error executing action:", error);
      set({ isLoading: false, error: error.message });
      
      // Ajouter un message d'erreur
      const errorMessage: Omit<MessageInterface, "id"> = {
        role: "assistant",
        content: "Erreur lors de l'exécution de l'action. Veuillez réessayer.",
        date: new Date().toISOString()
      };
      
      await get().addChat(userId, errorMessage);
    }
  },
  
  // Annuler une action
  cancelAction: (actionId: string) => {
    set((state) => ({
      pendingActions: state.pendingActions.filter(a => a.id !== actionId)
    }));
  },
  
  // Rafraîchir le contexte financier
  refreshContext: async (userId: string) => {
    try {
      const context = await buildFinancialContext(userId);
      set({ financialContext: context });
    } catch (error) {
      console.error("Error refreshing context:", error);
    }
  },
  
  // Définir une erreur
  setError: (error: string | null) => {
    set({ error });
  }
}));

