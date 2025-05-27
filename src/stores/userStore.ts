import { create } from "zustand";
import { addDoc, collection, db, deleteDoc, doc } from "../firebase";

interface UserInterface {
  id: string;
  name: string;
}

interface UserStore {
  user: UserInterface | null;
  addUser: (name: string) => Promise<void>;
  deleteUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => {
  const storedUser = localStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    user: initialUser,

    addUser: async (name) => {
      try {
        const usersCollectionRef = collection(db, "users");
        const docRef = await addDoc(usersCollectionRef, { name });
        const userId = docRef.id;
        const user = { name, id: userId };

        set({ user });
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      }
    },

    deleteUser: async () => {
      const user = get().user;
      if (user) {
        try {
          const userDoc = doc(db, "users", user.id);
          await deleteDoc(userDoc);
        } catch (error) {
          console.warn("Erreur lors de la suppression dans Firestore :", error);
        }
      }
      set({ user: null });
      localStorage.removeItem("user");
    },
  };
});
