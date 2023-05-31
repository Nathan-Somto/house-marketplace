import { create } from "zustand";
import { User } from "firebase/auth";

type Store = {
  user: User | null;
  login: (payload: User) => void;
  logout: () => void;
};

const useAuthStore = create<Store>((set) => ({
  user: null,
  login: (payload) => set((state) => ({ user: payload })),
  logout: () => set((state) => ({ user: null })),
}));

export default useAuthStore;
