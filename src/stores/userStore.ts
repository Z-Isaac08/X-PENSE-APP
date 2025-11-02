import { create } from "zustand";
import { useAuthStore } from "./authStore";

interface UserInterface {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserStore {
  user: UserInterface | null;
}

export const useUserStore = create<UserStore>(() => {
  // Le user est maintenant géré par authStore
  // Ce store sert juste de compatibilité avec le code existant
  const authUser = useAuthStore.getState().userProfile;
  
  return {
    user: authUser ? {
      id: authUser.uid,
      name: authUser.name,
      email: authUser.email,
      createdAt: authUser.createdAt,
    } : null,
  };
});

// Hook pour synchroniser userStore avec authStore
export const syncUserStore = () => {
  useAuthStore.subscribe((state) => {
    if (state.userProfile) {
      useUserStore.setState({
        user: {
          id: state.userProfile.uid,
          name: state.userProfile.name,
          email: state.userProfile.email,
          createdAt: state.userProfile.createdAt,
        },
      });
    } else {
      useUserStore.setState({ user: null });
    }
  });
};
