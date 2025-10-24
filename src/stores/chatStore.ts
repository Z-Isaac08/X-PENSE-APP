import { create } from "zustand";
import { addDoc, collection, db, deleteDoc, doc, getDocs } from "../firebase";

export interface MessageInterface {
  id: string;
  role: "assistant" | "user";
  content: string;
  date: string;
}

interface ChatStore {
  messages: MessageInterface[];
  addChat: (
    userId: string,
    chat: Omit<MessageInterface, "id">
  ) => Promise<void>;
  getAllChats: (userId: string) => Promise<void>;
  deleteAllChats: (userId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
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
      set({ messages: [] });
    } catch (error) {
      console.error("Erreur lors de la suppression des messages", error);
      throw new Error("Erreur lors de la suppression des messages");
    }
  },
}));
