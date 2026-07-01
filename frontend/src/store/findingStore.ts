import { create } from "zustand";
interface F { finding: any; asset_id: string; asset_name: string }
interface S { findings: F[]; addFinding: (f: F) => void }
export const useFindingStore = create<S>((set) => ({ findings: [], addFinding: (f) => set((s) => ({ findings: [f, ...s.findings] })) }));
