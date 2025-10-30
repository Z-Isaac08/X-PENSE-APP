import { create } from "zustand";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  db,
  doc,
  setDoc,
  getDoc,
} from "../firebase";

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  userProfile: null,
  loading: true,
  initialized: false,

  register: async (email: string, password: string, name: string) => {
    try {
      // Créer le compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Créer le profil utilisateur dans Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        name: name,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), userProfile);

      set({ user, userProfile, loading: false });
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      throw new Error(error.message || "Erreur lors de l'inscription");
    }
  },

  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Récupérer le profil utilisateur depuis Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userProfile = userDoc.exists()
        ? (userDoc.data() as UserProfile)
        : null;

      set({ user, userProfile, loading: false });
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error);
      throw new Error(error.message || "Erreur lors de la connexion");
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, userProfile: null, loading: false });
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error);
      throw new Error(error.message || "Erreur lors de la déconnexion");
    }
  },

  initializeAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Utilisateur connecté, récupérer son profil
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userProfile = userDoc.exists()
            ? (userDoc.data() as UserProfile)
            : null;

          set({ user, userProfile, loading: false, initialized: true });
        } catch (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          set({ user, userProfile: null, loading: false, initialized: true });
        }
      } else {
        // Utilisateur déconnecté
        set({ user: null, userProfile: null, loading: false, initialized: true });
      }
    });
  },
}));
