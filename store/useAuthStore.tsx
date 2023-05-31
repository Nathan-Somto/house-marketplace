import { create } from "zustand";
import { User } from "firebase/auth";

type Actions = {
  user: User | null;
  login: (payload: User) => void;
  logout: () => void;
};

const useAuthStore = create<Actions>((set) => ({
  user: null,
  login: (payload) => set((state) => ({ user: payload })),
  logout: () => set((state) => ({ user: null })),
}));

export default useAuthStore;
