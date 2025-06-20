import { create } from "zustand";
import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "../firebase";

interface NotificationInterface {
  id: string;
  message: string;
  type: "budget" | "expense" | "income" | "alert";
  date: string;
  read: boolean;
}

interface NotificationStore {
  notifications: NotificationInterface[];
  markAsRead: (userId: string, notificationId: string) => Promise<void>;
  addNotifications: (
    userId: string,
    notification: Omit<NotificationInterface, "id">
  ) => Promise<void>;
  AllNotifications: (userId: string) => Promise<void>;
  removeNotifications: (
    userId: string,
    notificationId: string
  ) => Promise<void>;
  clearAllNotifications: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotifications: async (userId, notification) => {
    try {
      const notificationRef = collection(db, "users", userId, "notifications");
      const docRef = await addDoc(notificationRef, notification);

      set((state) => ({
        notifications: [
          ...state.notifications,
          { ...notification, id: docRef.id },
        ],
      }));
    } catch (error) {
      console.error("Error adding notifications:", error);
      throw new Error("Could not add notifications");
    }
  },
  AllNotifications: async (userId) => {
    try {
      const notificationSnapshots = await getDocs(
        collection(db, "users", userId, "notifications")
      );
      const notifications = notificationSnapshots.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data } as NotificationInterface;
      });

      set({ notifications });
    } catch (error) {
      console.error("Erreur lors du chargement des notifications :", error);
    }
  },
  markAsRead: async (userId, notificationId) => {
    try {
      const notificationRef = doc(
        db,
        "users",
        userId,
        "notifications",
        notificationId
      );
      await updateDoc(notificationRef, { read: true });
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        ),
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la notification :",
        error
      );
      throw error;
    }
  },
  removeNotifications: async (userId, notificationId) => {
    try {
      const docRef = doc(db, "users", userId, "notifications", notificationId);
      await deleteDoc(docRef);

      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification.id !== notificationId
        ),
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      throw error;
    }
  },
  clearAllNotifications: async (userId) => {
    try {
      const notificationSnapshots = getDocs(
        collection(db, "users", userId, "notifications")
      );
      const batchPromises = (await notificationSnapshots).docs.map((docItem) =>
        deleteDoc(doc(db, "users", userId, "notifications", docItem.id))
      );

      Promise.all(batchPromises);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de toutes les notifications:",
        error
      );
      throw new Error(
        "Erreur lors de la suppression de toutes les notifications"
      );
    }
  },
}));
