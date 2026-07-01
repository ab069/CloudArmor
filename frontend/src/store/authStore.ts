import { create } from "zustand"; import { persist } from "zustand/middleware";
interface U { id: string; email: string; name: string }
interface S { token: string | null; user: U | null; setAuth: (t: string, u: U) => void; logout: () => void }
export const useAuthStore = create<S>()(persist((set) => ({ token: null, user: null, setAuth: (t, u) => set({ token: t, user: u }), logout: () => set({ token: null, user: null }) }), { name: "cloudarmor-auth" }));
